# 个人博客技术方案

> 状态：规划中，尚未开始实现  
> 最后整理：2026-09-06  
> 目标：使用 Nuxt 快速上线一个面向全球访问者、以中文创作为主的中英双语个人主页与文章博客。

## 1. 项目目标

项目采用“个人主页 + 博客”的产品形态。第一阶段优先保证内容发布、阅读体验、搜索、SEO 和自动部署，不建设后台管理系统，也不追求复杂的应用功能。

核心原则：

- 使用 Nuxt 生态内成熟的模块和 UI 组件缩短上线时间。
- 页面结构和视觉风格自行设计，不基于 Nuxt UI 官方博客模板修改。
- Markdown 和 Git 是内容源，所有文章与翻译结果都可以版本控制和回滚。
- 网站以 SSG 方式生成，不依赖常驻服务端或业务数据库。
- 中文是主要创作语言，英文由发布阶段的自动翻译流程生成。
- 翻译不发生在用户访问期间，不让翻译服务的延迟和故障影响线上访问。

## 2. 技术栈

除表格中明确标注“待最终确认”的 UI 组件项外，其余选型已经确认。

| 领域 | 选型 | 用途 |
| --- | --- | --- |
| Web 框架 | Nuxt 4 | 路由、SSR/SSG、模块体系和构建 |
| 前端框架 | Vue 3 | 页面与组件开发 |
| 开发语言 | TypeScript | 类型约束和工程可维护性 |
| 内容系统 | Nuxt Content | Markdown 文章、内容集合、Schema 和查询 |
| UI 组件 | Nuxt UI（默认方案，待最终确认） | 按钮、弹窗、输入框、菜单等基础组件，不使用官方页面模板 |
| 样式 | Tailwind CSS 4 | 页面布局、主题和自定义视觉样式 |
| 多语言 | `@nuxtjs/i18n` | UI 文案、语言切换、多语言路由和国际化 SEO |
| 图标 | Nuxt Icon / Iconify | 图标加载与展示 |
| 图片 | Nuxt Image | 响应式图片和图片优化 |
| 搜索 | Nuxt Content Search + Fuse.js | 当前语言下的客户端全文搜索 |
| SEO | `useSeoMeta`、Sitemap、Robots、OG Image | 搜索引擎索引和社交分享 |
| 输出方式 | SSG 静态生成 | 构建静态 HTML 与资源 |
| 包管理 | pnpm | 依赖安装和脚本运行 |
| 代码质量 | ESLint + TypeScript 检查 | 代码风格和静态类型检查 |
| CI/CD | GitHub Actions | 校验、构建、预览和生产部署 |
| 托管 | Vercel | 全球静态内容分发 |

依赖版本应由 `pnpm-lock.yaml` 锁定，并在项目中固定 Node.js 与 pnpm 版本，避免本地和 GitHub Actions 构建结果不一致。

## 3. 首版范围

### 3.1 页面

- 个人主页：个人介绍、社交链接、精选文章和最新文章。
- 文章列表：按发布时间展示文章，可进入标签筛选。
- 文章详情：正文、目录、代码高亮、阅读时间、上一篇和下一篇。
- 标签集合：展示全部标签。
- 标签详情：展示属于某个标签的文章。
- 关于页面：更完整的个人资料。
- 404 页面。
- 全局搜索弹窗。

推荐的逻辑路由如下，最终是否对所有语言使用前缀仍待确认：

```text
/zh/
/zh/blog
/zh/blog/:slug
/zh/tags
/zh/tags/:tag
/zh/about

/en/
/en/blog
/en/blog/:slug
/en/tags
/en/tags/:tag
/en/about
```

### 3.2 首版不包含

- 内容管理后台。
- 用户注册和登录。
- 评论、点赞和收藏。
- 业务数据库。
- 运行时机器翻译。
- 自定义 `<AutoT>` 标记、Vue 源码扫描或自研 i18n 编译器。
- 现成博客页面模板。
- Newsletter 和定时发布，除非后续明确加入。

## 4. 建议的项目结构

以下结构是实施目标，不代表仓库中已经存在这些文件：

```text
.
├── app/
│   ├── assets/css/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── app.vue
├── content/
│   ├── zh-CN/blog/
│   └── en-US/blog/
├── i18n/
│   └── locales/
│       ├── zh-CN.json
│       └── en-US.json
├── public/
│   └── images/
├── scripts/
│   ├── translate-content.ts
│   └── check-translations.ts
├── .github/workflows/
│   ├── ci.yml
│   ├── translate.yml
│   └── deploy.yml
├── content.config.ts
├── nuxt.config.ts
├── package.json
└── pnpm-lock.yaml
```

UI 短文案和文章内容分开管理：

- `i18n/locales/*.json` 保存导航、按钮、搜索提示、空状态等 UI 文案，使用原生 `$t()`、`t()` 和 `i18n-t`。
- `content/<locale>/blog/*.md` 保存文章及文章级 SEO 信息，由 Nuxt Content 管理。

## 5. 多语言方案

### 5.1 语言定义

- 源语言：`zh-CN`。
- 首个目标语言：`en-US`。
- UI 文案：在语言 JSON 中维护，不实现自动源码提取。
- 长文章：中文 Markdown 为源文件，英文 Markdown 为生成并可人工编辑的版本。

推荐所有语言都使用 URL 前缀，即 `@nuxtjs/i18n` 的 `prefix` 路由策略。根路径 `/` 默认进入中文站；若启用浏览器语言检测，建议仅在访问根路径时执行，避免覆盖用户主动选择的语言。

### 5.2 UI 文案

UI 组件直接使用 `@nuxtjs/i18n`：

```vue
<template>
  <h1>{{ $t('home.hero.title') }}</h1>
  <i18n-t keypath="home.hero.description" />
</template>
```

语言文件采用清晰、稳定的语义 ID：

```json
{
  "home": {
    "hero": {
      "title": "分享我的技术学习与开发实践"
    }
  }
}
```

### 5.3 内容集合

中文和英文文章建议分别建立 Nuxt Content 集合，并通过当前 locale 选择对应集合。多语言路由与 Content 内部路径应解耦，避免路径中出现重复语言前缀。

文章建议使用相同的 ASCII slug 和稳定的 `translationKey`：

```yaml
---
title: 使用 Nuxt 搭建个人博客
description: 记录个人博客的技术选型与实现过程
slug: building-a-nuxt-blog
translationKey: building-a-nuxt-blog
date: 2026-09-06
updated: 2026-09-06
image: /images/blog/building-a-nuxt-blog.webp
tags:
  - nuxt
  - frontend
featured: false
draft: false
translation:
  enabled: true
  targets:
    - en-US
---
```

标签在 Frontmatter 中保存稳定 ID，例如 `frontend`；中英文显示名称由单独的语言字典提供。这样语言切换不会改变标签标识或破坏 URL。

## 6. 文章自动翻译

### 6.1 基本约束

翻译发生在内容发布阶段，由独立脚本或 GitHub Action 执行。翻译结果写入 `content/en-US/blog/` 并进入 Git 版本控制。正式的 `nuxt generate` 不直接调用翻译 API，只检查翻译产物是否满足发布要求。

推荐流程：

```text
编写或修改中文 Markdown
  -> 检测需要翻译的文章
  -> 调用翻译服务
  -> 生成或更新英文 Markdown
  -> 校验 Markdown 与 MDC 结构
  -> 创建翻译 PR
  -> 人工确认并合并
  -> 静态构建
  -> 部署 Vercel
```

### 6.2 缓存与版本

翻译脚本需要记录源内容 Hash，只翻译新增或修改的文章。Hash 应基于实际需要翻译的字段和正文生成，并排除 `updated`、翻译状态等不会影响译文的元数据。

为了降低长文章小幅修改后的重复成本，可以进一步保存章节或段落级 Hash。缓存键至少包含：

```text
sourceHash + targetLocale + promptVersion + glossaryHash
```

翻译服务、提示词版本、模型、生成时间和审核状态不应混入 Nuxt i18n 语言 JSON，可保存在独立 Manifest 或英文文章的翻译元数据中。

### 6.3 Markdown 结构保护

翻译脚本不能简单通过正则替换或把整份原始文件不加保护地交给模型。应解析 Markdown/MDC，隔离 Frontmatter，并确保以下内容保持不变：

- 代码块和行内代码。
- 链接目标 URL。
- 图片地址。
- HTML 标签。
- MDC 组件名称、属性和 Vue binding。
- 显式标题 ID。
- 日期、slug、图片、标签 ID 等非翻译字段。

需要翻译的内容包括标题、摘要、SEO 文案、正文段落、列表、引用、表格文字、链接显示文字和图片替代文字。MDC 组件属性默认不翻译；确有需要时使用组件和属性白名单。

生成英文文件后必须再次解析并比较结构签名。若代码块、URL、图片或 MDC 结构发生变化，任务失败且不得覆盖上一个有效版本。

### 6.4 审核与失败回退

推荐支持以下翻译状态：

- `machine`：机器翻译，尚未人工确认。
- `reviewed`：已经人工审核。
- `locked`：允许长期人工维护，自动流程不得覆盖。
- `stale`：中文原文已更新，英文版本尚未同步。

推荐的生产策略是：

- 翻译失败时不覆盖旧译文。
- 结构校验失败时不写入英文文件。
- 对声明必须翻译的文章执行严格检查；检查失败则不部署新版本，Vercel 保留上一个成功版本。
- 若未来希望中文文章不等待英文翻译即可发布，需要额外实现逐文章的语言可用性和 `hreflang` 控制。

自动翻译服务、模型、费用上限、重试策略、术语表和翻译风格目前尚未确定，是该功能实施前唯一明确的外部依赖。

## 7. 搜索与标签

首版采用 Nuxt Content 的 `queryCollectionSearchSections` 生成搜索数据，Fuse.js 在浏览器中完成搜索。

推荐交互：

- Header 提供搜索入口。
- `Cmd/Ctrl + K` 打开搜索弹窗。
- 只搜索当前语言的文章。
- 搜索标题、摘要、正文和标签。
- 中文与英文索引分开生成并按需加载。
- `draft: true` 的文章不进入索引。

对于个人博客的初始文章规模，客户端 Fuse.js 足够简单。文章数量或搜索索引明显增大后，再评估构建期静态索引或 Pagefind，不在首版提前引入。

## 8. SEO

页面 SEO 由以下部分组成：

- `useSeoMeta` 设置页面和文章的标题、描述及社交分享信息。
- `@nuxtjs/i18n` 的 `useLocaleHead` 设置 HTML `lang`、canonical、`hreflang` 和 Open Graph locale。
- Sitemap 输出所有可发布语言下的主页、文章页和标签页。
- Robots 控制抓取策略并关联 Sitemap。
- OG Image 提供默认图片，并允许文章覆盖。

只有真实存在且通过校验的目标语言页面才能进入 Sitemap 和 `hreflang`。不能为缺少英文内容的文章生成指向 404 页面的英文 alternate URL。

正式上线前需要补齐：

- 网站名称和作者名称。
- 网站描述。
- 生产域名和 `baseUrl`。
- 默认 OG 图片。
- 社交账号链接。

## 9. SSG 与动态路由

项目使用 `nuxt generate` 生成静态站点。文章页、标签页和多语言动态路由不能只依赖页面文件本身，应在构建阶段显式收集：

- 两种语言的已发布文章路由。
- 两种语言的标签路由。
- 固定页面路由。

构建时应排除草稿、无效内容和不满足翻译发布策略的目标语言页面。生成结束后需要检查关键页面、Sitemap、404 和静态资源是否存在。

## 10. GitHub Actions 与 Vercel

建议拆分为三个工作流：

### `translate.yml`

- 检测中文文章变化。
- 调用翻译服务。
- 写入英文 Markdown。
- 运行结构与翻译完整性检查。
- 创建或更新翻译 PR。

### `ci.yml`

- `pnpm install --frozen-lockfile`。
- ESLint。
- TypeScript 类型检查。
- Nuxt Content Schema 校验。
- 翻译映射、重复 slug 和标签校验。
- 执行 SSG 构建。

### `deploy.yml`

- Pull Request 可部署 Vercel Preview。
- `main` 分支部署 Vercel Production。
- 使用 Vercel CLI 拉取项目配置、构建并通过 `vercel deploy --prebuilt` 发布。
- 使用 GitHub Actions `concurrency` 避免同一环境并行部署。

Vercel 原生 Git 自动部署应关闭，避免同一次提交由 Vercel Git 集成和 GitHub Actions 重复部署。

预期使用的 GitHub Secrets：

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
TRANSLATION_API_KEY
```

具体翻译服务确定后，可将通用的 `TRANSLATION_API_KEY` 替换成供应商明确的变量名。

## 11. 计划中的项目命令

以下是建议约定，需在初始化项目时落实：

```text
pnpm dev                  # 本地开发
pnpm lint                 # ESLint
pnpm typecheck            # TypeScript / Nuxt 类型检查
pnpm content:check        # 内容 Schema 与路由校验
pnpm translate            # 生成需要更新的英文文章
pnpm translate:check      # 检查翻译状态与结构
pnpm generate             # 生成静态站点
pnpm preview              # 本地预览生产产物
```

## 12. 已知技术问题与处理方向

| 问题 | 处理方向 |
| --- | --- |
| i18n 路由与 Content 路径可能产生重复语言前缀 | 多语言页面路由和内容集合解耦，按 locale 选择集合 |
| SSG 不一定自动发现全部文章和标签动态路由 | 构建阶段显式枚举并预渲染 |
| 缺少译文时可能生成无效 `hreflang` | 构建前校验目标页面是否存在，只输出有效 alternate URL |
| 翻译 API 导致构建不确定 | 翻译独立执行并提交结果，正式构建不调用模型 |
| 模型可能破坏 Markdown、URL、代码和 MDC | AST/结构化分段、占位符保护、生成后结构校验 |
| 自动翻译可能覆盖人工修改 | 使用审核状态和 `locked` 机制 |
| Fuse.js 索引可能随文章增加而变大 | 按语言懒加载，达到规模阈值后更换静态搜索方案 |
| Vercel 与 GitHub Actions 可能重复部署 | 关闭 Vercel 原生 Git 自动部署 |
| 本地与 CI 依赖版本不一致 | 固定 Node.js、pnpm 和 lockfile |
| 标签翻译导致 URL 不稳定 | 使用稳定标签 ID，显示名称单独翻译 |

## 13. 待最终确认

开始实现前仍需确定以下事项：

1. 是否确认使用 Nuxt UI 基础组件；若否，则改为纯 Tailwind 自建组件。
2. 是否确认 `/zh/*`、`/en/*` 均带语言前缀，根路径 `/` 默认进入中文站。
3. 自动翻译所使用的供应商、模型、预算上限、翻译风格和术语表。
4. 机器翻译是否必须经过人工审核后才能发布。
5. 翻译失败时阻止整个部署，还是允许只发布中文版本。
6. 首页是否只包含个人介绍、社交链接、精选文章和最新文章。
7. 是否需要独立搜索页面；默认仅提供搜索弹窗。
8. 正式网站名称、作者信息、生产域名、默认 OG 图片和社交链接。
9. 是否在首版接入访问统计；默认不接入。

## 14. 首版验收标准

- 中文和英文固定页面可访问并能正确切换语言。
- 可通过 Markdown 新增中文文章，并生成可版本控制的英文文章。
- 文章、标签和搜索结果只展示当前语言内容。
- 草稿不会出现在页面、搜索索引和 Sitemap 中。
- 文章详情正确渲染 Markdown、代码块、图片、目录和 MDC 组件。
- 页面具备正确的 title、description、canonical、`hreflang`、OG 和 Sitemap。
- `pnpm lint`、`pnpm typecheck`、内容校验和 `pnpm generate` 全部通过。
- Pull Request 能产生 Preview，`main` 分支能通过 GitHub Actions 部署到 Vercel Production。
- 翻译或部署失败不会覆盖线上最后一个成功版本。

## 15. 官方参考

- [Nuxt Content](https://content.nuxt.com/docs/getting-started)
- [Nuxt Content Markdown 与 MDC](https://content.nuxt.com/docs/files/markdown)
- [Nuxt Content 全文搜索](https://content.nuxt.com/docs/advanced/fulltext-search)
- [Nuxt UI](https://ui.nuxt.com/docs/components/)
- [Nuxt i18n 路由策略](https://i18n.nuxtjs.org/docs/guide)
- [Nuxt i18n SEO](https://i18n.nuxtjs.org/docs/guide/seo)
- [Nuxt 静态部署](https://nuxt.com/docs/4.x/getting-started/deployment)
- [Nuxt 部署到 Vercel](https://nuxt.com/deploy/vercel)
- [Vercel GitHub Actions 部署](https://vercel.com/docs/git/vercel-for-github)
