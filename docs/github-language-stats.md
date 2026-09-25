# GitHub 语言统计：Nuxt 服务端获取与缓存方案

> **实现状态（2026-09-25）：** 项目最终采用构建时生成方案，而不是本文后半部分讨论的运行时 `server/api` + Nitro 缓存方案。当前实现入口是 `scripts/generate-github-languages.ts`，生成结果为 `app/generated/github-language-stats.json`；`pnpm dev`、`pnpm build` 和 `pnpm generate` 都会在 Nuxt 启动或构建前刷新该快照。生成结果按聚合字节数降序展示前五种语言，其余语言合并为 `Other`。本文保留为技术选型记录。

> 调研日期：2026-09-25  
> 范围：GitHub REST API、Nuxt 4 服务端路由、Nitro 2 缓存、当前仓库的 SSG 约束。  
> 本文只记录方案，不修改应用代码。

## 结论

GitHub 不提供“某个用户所有仓库的语言占比”单一 REST 接口。需要先调用 `GET /users/{username}/repos` 获取公开仓库，再对每个纳入统计的仓库调用 `GET /repos/{owner}/{repo}/languages`，最后按语言累加字节数。语言接口返回的数值是该语言的代码字节数，因此可以直接作为 `UProgressGroup` 的 `value`，总字节数作为 `max`。[GitHub：List repositories for a user](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)；[GitHub：List repository languages](https://docs.github.com/en/rest/repos/repos#list-repository-languages)

当前仓库的 `vercel.json` 明确设置了 `"buildCommand": "pnpm generate"` 和 `"outputDirectory": ".output/public"`，技术方案也把 SSG 定为既定架构。Nuxt 官方明确说明：预渲染后的静态输出中不包含服务器，因此部署后不能使用任何 `server/api` 端点；需要服务端能力时应使用 `nuxt build`。[Nuxt：Rendering Modes](https://nuxt.com/docs/4.x/guide/concepts/rendering#deploying-a-static-client-rendered-app)

因此有两种可行路径：

1. **保留当前 SSG（更符合现有技术方案）**：构建期间获取 GitHub 数据，把结果写入页面 payload；数据只在重新部署时更新。此时没有运行时 API，也不需要长期运行的缓存。
2. **改为 Nuxt 服务端部署**：把构建改为 `nuxt build`，并移除 `vercel.json` 中强制指向 `.output/public` 的纯静态输出配置，让 Vercel 使用 Nuxt/Nitro 的 serverless output；然后增加 `/api/github/languages`，再用 Nitro 缓存 6–24 小时。只有这条路径能实现“部署后定期自动刷新”的 Nuxt 服务端 API。

如果 About 页不要求小时级更新，优先选择第一条；GitHub 语言比例不是高频数据，用一次部署更新换取继续保持纯静态架构更简单。如果希望用户访问时自动更新，再采用第二条。

## GitHub API 事实

### 仓库列表

`GET /users/{username}/repos` 返回指定用户的公开仓库，无需认证也可访问公开数据。`type` 默认为 `owner`，`per_page` 默认 30、最大 100。[GitHub：List repositories for a user](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user)

建议请求参数保持稳定：

```text
GET https://api.github.com/users/KevinGuo1007/repos
    ?type=owner
    &sort=full_name
    &direction=asc
    &per_page=100
```

统计前应明确过滤规则。个人作品统计通常排除：

- `fork === true`：避免把其他人的代码算入自己的语言分布；
- `archived === true`：是否排除由展示目标决定；
- `disabled === true`：排除不可用仓库；
- 明确不想展示的配置、练习或镜像仓库：最好使用仓库 allowlist/denylist，而不是依赖临时命名规则。

如果公开仓库超过 100 个，需要处理分页。GitHub 建议跟随响应的 `Link` header，而不是自行推断分页 URL。[GitHub：REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#do-not-manually-parse-urls)

### 单仓库语言

`GET /repos/{owner}/{repo}/languages` 返回语言名到代码字节数的映射，例如：

```json
{
  "TypeScript": 182340,
  "Vue": 85620,
  "CSS": 21450
}
```

接口文档明确说明右侧数值是对应语言的代码字节数；公开仓库无需认证，fine-grained token 只需仓库 `Metadata: read` 权限。[GitHub：List repository languages](https://docs.github.com/en/rest/repos/repos#list-repository-languages)

总语言数据的聚合方式：

```ts
totals[language] = (totals[language] ?? 0) + bytes
```

随后按字节数降序排序。百分比为 `bytes / totalBytes * 100`，但 API 响应最好保留原始 `bytes`；`UProgressGroup` 可以自己依据 `value` 和 `max` 计算比例，避免提前四舍五入造成总和不等于 100%。

GitHub 的语言接口不返回颜色。若要复刻 GitHub 颜色，可以在前端维护有限的语言颜色映射；GitHub Linguist 的 `languages.yml` 定义了用于语言展示的 CSS 颜色。[GitHub Linguist：languages.yml](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml)

## 认证、请求头与限流

公开数据可以匿名请求，但匿名 REST API 限额是每个来源 IP 每小时 60 次，认证用户通常是每小时 5,000 次。[GitHub：REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api#primary-rate-limit-for-unauthenticated-users)

一次完整刷新约消耗：

```text
1 次仓库列表请求 + N 次仓库语言请求
```

因此运行时服务推荐使用认证请求。个人项目可用 fine-grained personal access token，并限制到最小仓库范围和只读权限；GitHub 建议优先使用 fine-grained token，并为凭据设置最小权限和有效期。[GitHub：Managing personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)；[GitHub：Keeping API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure)

请求头建议固定为：

```ts
const headers = {
  accept: "application/vnd.github+json",
  authorization: `Bearer ${token}`,
  "x-github-api-version": "2026-03-10",
}
```

GitHub REST API 是日期版本化 API；`2026-03-10` 是当前受支持版本，显式固定版本可避免无版本请求的默认行为在旧版本退役后变化。[GitHub：API Versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions)

GitHub 官方建议为避免 secondary rate limit 而串行发送请求。因此不要直接对大量仓库使用无限制的 `Promise.all`；仓库较少时用 `for...of` 串行即可，仓库较多时优先缩小统计范围。[GitHub：Avoid concurrent requests](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#avoid-concurrent-requests)

遇到 `403`/`429` 时应读取 `retry-after`、`x-ratelimit-remaining` 和 `x-ratelimit-reset`，按 GitHub 的规则停止请求，而不是立即重试。[GitHub：Handling rate limit errors](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#handle-rate-limit-errors-appropriately)

## Nuxt 服务端路由与密钥

Nuxt 会把 `server/api` 下的文件自动注册为带 `/api` 前缀的路由。例如 `server/api/github/languages.get.ts` 对应 `GET /api/github/languages`，页面可用 `useFetch('/api/github/languages')` 读取。[Nuxt：Server directory](https://nuxt.com/docs/4.x/directory-structure/server#server-routes)

Token 必须放在私有 `runtimeConfig`，不能放入 `runtimeConfig.public`。Nuxt 只把 `public` 和 `app` 下的配置暴露给客户端；服务端路由中建议把 `event` 传给 `useRuntimeConfig(event)`，以正确读取运行时环境覆盖。[Nuxt：Runtime Config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config)

建议配置形态：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    githubToken: "",
    githubUsername: "KevinGuo1007",
  },
})
```

对应环境变量：

```dotenv
NUXT_GITHUB_TOKEN=github_pat_xxx
NUXT_GITHUB_USERNAME=KevinGuo1007
```

`.env` 只用于本地开发/构建；Nuxt 生产运行不会自动读取 `.env`，必须在托管平台设置环境变量。[Nuxt：`.env` production behavior](https://nuxt.com/docs/4.x/directory-structure/env#production)

当前仓库已忽略 `.env` 和 `.env.*`（保留 `.env.example`），因此可新增只含占位符的 `.env.example`，不要提交真实 token。

## 推荐的动态服务端实现

下面是建议结构，不是本次调研产生的应用代码改动。

### 1. 服务端 API

```ts
// server/api/github/languages.get.ts
type GitHubRepository = {
  name: string
  fork: boolean
  archived: boolean
  disabled: boolean
}

type GitHubLanguages = Record<string, number>

export default defineEventHandler(async (event) => {
  const { githubToken, githubUsername } = useRuntimeConfig(event)

  if (!githubUsername) {
    throw createError({
      statusCode: 500,
      statusMessage: "GitHub username is not configured",
    })
  }

  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2026-03-10",
  }

  if (githubToken) {
    headers.authorization = `Bearer ${githubToken}`
  }

  const repositories = await $fetch<GitHubRepository[]>(
    `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos`,
    {
      headers,
      query: {
        type: "owner",
        sort: "full_name",
        direction: "asc",
        per_page: 100,
      },
    },
  )

  const includedRepositories = repositories.filter(
    repository =>
      !repository.fork &&
      !repository.archived &&
      !repository.disabled,
  )

  const totals: GitHubLanguages = {}

  // GitHub 建议串行发送请求，避免触发 secondary rate limit。
  for (const repository of includedRepositories) {
    const languages = await $fetch<GitHubLanguages>(
      `https://api.github.com/repos/${encodeURIComponent(githubUsername)}/${encodeURIComponent(repository.name)}/languages`,
      { headers },
    )

    for (const [language, bytes] of Object.entries(languages)) {
      totals[language] = (totals[language] ?? 0) + bytes
    }
  }

  const languages = Object.entries(totals)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  return {
    username: githubUsername,
    repositoryCount: includedRepositories.length,
    totalBytes: languages.reduce((sum, language) => sum + language.value, 0),
    languages,
    updatedAt: new Date().toISOString(),
  }
})
```

生产代码还应处理超过 100 个仓库的分页。如果只想展示精选项目，更推荐将仓库名设为 allowlist，这能减少请求、稳定统计口径，也避免新增实验仓库突然改变图表。

### 2. Nitro 缓存

当前项目锁定 `nitropack@2.13.4`；对应 Nitro v2 API 支持 `defineCachedEventHandler`、`defineCachedFunction` 和 `routeRules.cache`。Nitro 官方说明缓存可用于昂贵的上游 API 请求，`maxAge` 单位是秒。[Nitro v2：Cache](https://v2.nitro.build/guide/cache)

最少侵入的方式是在 `nuxt.config.ts` 给这个公开、无用户差异的 API 增加 route rule：

```ts
export default defineNuxtConfig({
  routeRules: {
    "/api/github/languages": {
      cache: {
        maxAge: 60 * 60 * 6,
        swr: true,
        name: "github-language-stats",
      },
    },
  },
})
```

建议起始值是 6 小时；若只用于 About 页，24 小时也足够。`swr: true` 允许先返回旧值并在后台刷新，适合这种允许短暂陈旧的展示数据。缓存处理器还会对同一 cache key 的并发请求去重。[Nitro：Cache behavior](https://nitro.build/docs/cache#request-deduplication)

也可以把外部请求提取到 `server/utils/github.ts` 并用 `defineCachedFunction` 包裹。这样更容易复用和手动失效；在 edge worker 上应按 Nitro 文档把 `event` 作为缓存函数第一个参数传入。[Nitro v2：Cached functions and edge workers](https://v2.nitro.build/guide/cache#edge-workers)

### 3. 页面消费

```ts
const { data, error, status } = await useFetch("/api/github/languages")

const languageItems = computed(() => data.value?.languages ?? [])
const languageTotal = computed(() => data.value?.totalBytes ?? 0)
```

模板中把 `languageItems` 传给 `UProgressGroup.items`，把 `languageTotal` 传给 `max`。页面应提供 loading、error 和空数据状态；不要因为 GitHub 暂时不可用而让整张 About 页面渲染失败。

## 缓存边界与持久性

Nitro v2 在生产环境默认使用内存 cache driver，缓存不会跨进程重启持久化。[Nitro v2：Customize cache storage](https://v2.nitro.build/guide/cache#customize-cache-storage)

这意味着在 serverless 环境中：

- 不同实例可能分别执行一次 GitHub 聚合；
- 冷启动后缓存可能为空；
- `maxAge` 不能被理解成全局唯一刷新周期。

低流量个人站点可以先接受这个限制，但应使用 GitHub token。若以后流量增加，或必须保证所有实例共享缓存，再把 Nitro 的 `cache` mount 配置到 Redis/其他持久化 driver；Nitro v2 官方支持通过 `storage.cache` 覆盖生产缓存存储。[Nitro v2：KV Storage](https://v2.nitro.build/guide/storage#configuration)

不要一开始为了这一个小组件引入 Redis。更简单且更符合当前仓库架构的选择仍是构建时获取。

## GitHub 条件请求（可选的第二层优化）

GitHub 多数 endpoint 会返回 `etag`，后续可发送 `If-None-Match`；数据未变化时返回 `304 Not Modified`。在请求带有正确 `Authorization` header 的前提下，`304` 不计入 primary rate limit。[GitHub：Conditional requests](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#use-conditional-requests)

实现条件请求需要为每个 GitHub URL 持久化：

```ts
{
  etag: string
  body: unknown
}
```

刷新时发送保存的 `etag`；若收到 `304`，复用保存的 body；若收到 `200`，同时替换 body 和新 `etag`。这与 Nitro 给自己 API 响应生成的 ETag 是两个不同层次：

- GitHub ETag：减少 Nuxt 服务到 GitHub 的流量与 GitHub 限额消耗；
- Nitro/HTTP 缓存：减少浏览器或 CDN 到 Nuxt handler 的执行次数。

首版不建议实现 GitHub ETag 存储。6–24 小时的聚合缓存、认证请求和有限仓库数已足够；只有监控到 GitHub 请求量或冷启动重复请求成为问题时，再增加这一层。

## 与当前 SSG 的落地选择

### 方案 A：保持 `nuxt generate`（推荐）

- 在 About 页预渲染期间获取数据并写入 Nuxt payload，或用构建脚本生成静态 JSON；
- GitHub token 只存在于构建环境；
- 数据随部署更新；
- 部署产物不包含 `/api/github/languages` 运行时服务。

Nuxt 会把预渲染页面用到的数据写入 payload，客户端导航可复用构建时数据。[Nuxt：Static hosting and payload](https://nuxt.com/docs/4.x/getting-started/deployment#static-hosting)

### 方案 B：改为 `nuxt build`

- 部署 Nitro 服务端/Serverless Function；
- `/api/github/languages` 在生产环境可用；
- 使用 Nitro 缓存和运行时环境变量；
- 需要接受服务器执行、冷启动和缓存存储的运维复杂度。

Nuxt 官方把 Node、serverless、edge 和静态预渲染列为不同部署形态；运行时服务端 API 需要包含 server output 的构建。[Nuxt：Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)

## 验证清单

- `NUXT_GITHUB_TOKEN` 未进入客户端 bundle、页面 payload 或 API 响应。
- `/api/github/languages` 只返回聚合后的公开数据。
- forks、archived repos 和排除仓库的规则符合想展示的口径。
- 仓库超过 100 个时正确处理 `Link` pagination。
- 连续请求命中缓存；超过 `maxAge` 后才重新调用 GitHub。
- GitHub 返回 `401`、`403`、`429` 或 `5xx` 时，页面有降级 UI，服务端不会无休止重试。
- API 返回 `repositoryCount`、`totalBytes`、`languages` 和 `updatedAt`，便于排查统计是否合理。
- 若继续使用 `pnpm generate`，确认页面不在浏览器运行时重新请求一个不存在的 `/api`。

## 官方参考

- [GitHub REST API：Repositories endpoints](https://docs.github.com/en/rest/repos/repos)
- [GitHub REST API：Rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [GitHub REST API：Best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
- [GitHub REST API：Authentication](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api)
- [GitHub REST API：API versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions)
- [Nuxt 4：Server directory](https://nuxt.com/docs/4.x/directory-structure/server)
- [Nuxt 4：Runtime Config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config)
- [Nuxt 4：Rendering Modes](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [Nuxt 4：Deployment](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Nitro v2：Cache](https://v2.nitro.build/guide/cache)
- [Nitro v2：Storage](https://v2.nitro.build/guide/storage)
