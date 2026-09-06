# 个人博客技术方案

> 状态：基础工程已初始化，页面功能待实现
> 最后整理：2026-09-06
> 目标：使用 Nuxt 构建一个面向全球访问者、以英文为默认语言并提供手工维护中文译文的个人主页与文章博客。

## 1. 项目目标

项目采用“个人主页 + 博客”的产品形态。第一阶段优先保证内容发布、阅读体验、搜索、SEO 和自动部署，不建设后台管理系统，也不追求复杂应用功能。

核心原则：

- 使用 Nuxt 生态内成熟的模块和 UI 组件缩短上线时间。
- 页面结构和视觉风格自行设计，不使用现成博客页面模板。
- Markdown 和 Git 是唯一内容源，所有文章及译文都可版本控制和回滚。
- 英文是默认语言，也是文章的原始创作语言。
- 中文文章由作者手工编写和维护，不使用机器翻译、翻译 API 或自动翻译流水线。
- 网站以 SSG 方式生成，不依赖常驻服务端或业务数据库。

## 2. 技术栈

| 领域 | 选型 | 用途 |
| --- | --- | --- |
| Web 框架 | Nuxt 4 | 路由、SSR/SSG、模块体系和构建 |
| 前端框架 | Vue 3 | 页面与组件开发 |
| 开发语言 | TypeScript | 类型约束和工程可维护性 |
| 内容系统 | Nuxt Content | Markdown 文章、内容集合、Schema 和查询 |
| UI 组件 | Nuxt UI | 按钮、弹窗、输入框、菜单等基础组件 |
| 样式 | Tailwind CSS 4 | 页面布局、主题和自定义视觉样式 |
| 多语言 | `@nuxtjs/i18n` | UI 文案、语言切换、多语言路由和国际化 SEO |
| 图标 | Nuxt Icon / Iconify | 图标加载与展示 |
| 图片 | Nuxt Image | 响应式图片和图片优化 |
| 搜索 | Nuxt Content Search + Fuse.js | 当前语言下的客户端全文搜索 |
| SEO | `useSeoMeta`、Sitemap、Robots、OG Image | 搜索引擎索引和社交分享 |
| 输出方式 | SSG 静态生成 | 构建静态 HTML 与资源 |
| 包管理 | pnpm | 依赖安装和脚本运行 |
| 代码质量 | ESLint + Vue TypeScript 检查 | 代码风格和静态类型检查 |
| CI/CD | GitHub Actions | 校验、构建、预览和生产部署 |
| 托管 | Vercel | 全球静态内容分发 |

依赖版本由 `pnpm-lock.yaml` 锁定，Node.js 与 pnpm 版本在仓库中固定，确保本地、GitHub Actions 和 Vercel 构建一致。

## 3. 多语言 URL 设计

网站采用与 OpenAI 官网相似的 URL 形态：默认英文不带语言前缀，中文带 `/zh` 前缀。

```text
/                       # 英文首页
/blog                   # 英文文章列表
/blog/:slug             # 英文文章详情
/tags                   # 英文标签集合
/tags/:tag               # 英文标签详情
/about                  # 英文关于页面

/zh                     # 中文首页
/zh/blog                # 中文文章列表
/zh/blog/:slug          # 中文文章详情
/zh/tags                # 中文标签集合
/zh/tags/:tag            # 中文标签详情
/zh/about               # 中文关于页面
```

实现规则：

- `defaultLocale: "en"`。
- `strategy: "prefix_except_default"`。
- 英文 locale code 为 `en`，语言标记为 `en-US`。
- 中文 locale code 为 `zh`，语言标记为 `zh-CN`。
- 关闭浏览器语言自动检测，访问 `/` 始终显示英文。
- 用户通过语言切换器主动切换语言。
- 页面只实现一套，不创建 `pages/en` 或 `pages/zh` 目录。
- 内部链接使用 `useLocalePath()`，语言切换使用 `useSwitchLocalePath()` 或 `SwitchLocalePathLink`。

## 4. 首版范围

### 4.1 页面

- 个人主页：个人介绍、社交链接、精选文章和最新文章。
- 文章列表：按发布时间展示文章，可进入标签筛选。
- 文章详情：正文、目录、代码高亮、阅读时间、上一篇和下一篇。
- 标签集合与标签详情。
- 关于页面。
- 双语 404 页面。
- 全局搜索弹窗。
- 显式语言切换器。

### 4.2 首版不包含

- 内容管理后台。
- 用户注册和登录。
- 评论、点赞和收藏。
- 业务数据库。
- 任何机器翻译、运行时翻译或翻译 API。
- 自动生成译文的脚本或 GitHub Action。
- 自定义 i18n 编译器或 UI 文案自动提取。
- Newsletter 和定时发布，除非后续明确加入。

## 5. 项目结构

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
│   ├── en-US/blog/          # 英文原始文章
│   └── zh-CN/blog/          # 手工维护的中文译文
├── i18n/
│   └── locales/
│       ├── en-US.json
│       └── zh-CN.json
├── public/
│   └── images/
├── scripts/
│   └── content-check.ts
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
├── content.config.ts
├── nuxt.config.ts
├── package.json
└── pnpm-lock.yaml
```

UI 文案与文章内容分开管理：

- `i18n/locales/*.json` 保存导航、按钮、搜索提示、空状态等 UI 文案。
- `content/en-US/blog/*.md` 保存英文原文。
- `content/zh-CN/blog/*.md` 保存作者手工维护的中文译文。

## 6. 内容与手工翻译方案

### 6.1 内容集合

分别建立两个 Nuxt Content 集合：

- `blogEn`：读取 `content/en-US/blog/**/*.md`。
- `blogZh`：读取 `content/zh-CN/blog/**/*.md`。

页面根据当前 locale 选择集合，多语言页面路由与 Content 文件路径保持解耦。

### 6.2 文章对应关系

英文和中文文件独立维护，通过相同的 ASCII `slug` 和 `translationKey` 建立关系：

```yaml
---
title: Building a Personal Blog with Nuxt
description: Notes on the technical decisions behind this personal blog
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
---
```

内容规则：

- 英文文章是原文，可以没有中文译文并单独发布。
- 中文文章必须存在相同 `translationKey` 的英文原文。
- 中文译文不存在时，不生成对应中文文章路由。
- 语言切换器只链接真实存在的译文，不能链接到 404。
- `slug`、`translationKey`、标签和图片路径等结构化字段应在两种语言中保持一致。
- 标题、摘要、SEO 文案、正文和图片替代文字由作者分别编写。
- 标签使用稳定 ID；中英文显示名称放在语言字典中。
- 原文更新后，由作者自行检查并同步中文译文。

项目不维护 `machine`、`reviewed`、`locked`、`stale` 等机器翻译状态，也不保存模型、提示词或翻译缓存信息。

### 6.3 推荐写作流程

```text
编写或修改英文 Markdown
  -> 本地预览英文页面
  -> 需要中文版本时手工创建或更新中文 Markdown
  -> 检查 slug 与 translationKey 对应关系
  -> 运行内容校验和静态构建
  -> 提交英文原文与中文译文
  -> 部署
```

## 7. 搜索与标签

首版使用 Nuxt Content 的 `queryCollectionSearchSections` 生成搜索数据，Fuse.js 在浏览器中完成搜索。

规则：

- Header 提供搜索入口。
- `Cmd/Ctrl + K` 打开搜索弹窗。
- 英文页面只搜索 `blogEn`。
- 中文页面只搜索 `blogZh`。
- 搜索标题、摘要、正文和标签。
- 两种语言索引分开生成并按需加载。
- `draft: true` 的文章不进入索引。

文章数量或搜索索引明显增大后，再评估 Pagefind，不在首版提前引入。

## 8. SEO

页面 SEO 由以下部分组成：

- `useSeoMeta` 设置标题、描述和社交分享信息。
- `useLocaleHead` 设置 HTML `lang`、canonical、`hreflang` 和 Open Graph locale。
- Sitemap 输出所有可发布的英文和中文页面。
- Robots 控制抓取策略并关联 Sitemap。
- OG Image 提供默认图片，并允许文章覆盖。

URL 与 alternate 规则：

- 英文 canonical 使用无前缀 URL，例如 `/blog/example`。
- 中文 canonical 使用 `/zh` 前缀，例如 `/zh/blog/example`。
- 只有中文译文真实存在时，英文文章才输出指向中文页面的 `hreflang`。
- 中文页面必须输出对应英文原文的 alternate URL。
- 不为缺失译文生成中文 Sitemap URL 或无效 `hreflang`。
- 草稿不进入 Sitemap。

生产域名确定为 `https://kevinguo.ink`，直接配置在 `nuxt.config.ts` 中，并同时提供给站点配置和 i18n SEO `baseUrl`。

正式上线前还需要补齐：

- 网站名称和作者名称。
- 英文与中文网站描述。
- 默认 OG 图片。
- 社交账号链接。

## 9. SSG 与动态路由

项目使用 `nuxt generate` 生成静态站点。构建阶段需要显式收集：

- 英文固定页面路由。
- 中文固定页面路由。
- 所有已发布英文文章路由。
- 所有真实存在的中文文章路由。
- 两种语言中实际存在的标签路由。

构建时排除草稿和无效内容。生成结束后检查英文首页、中文首页、文章详情、标签、Sitemap、404 和静态资源。

## 10. GitHub Actions 与 Vercel

建议拆分为两个工作流。

### `ci.yml`

- `pnpm install --frozen-lockfile`。
- ESLint。
- TypeScript 类型检查。
- Nuxt Content Schema 校验。
- 中英文映射、重复 slug、标签与资源路径校验。
- 执行 SSG 构建。

### `deploy.yml`

- Pull Request 部署 Vercel Preview。
- `main` 分支部署 Vercel Production。
- 使用 Vercel CLI 拉取项目配置、构建并通过 `vercel deploy --prebuilt` 发布。
- 使用 GitHub Actions `concurrency` 避免同一环境并行部署。

Vercel 原生 Git 自动部署应关闭，避免同一提交重复部署。

预期 GitHub Secrets：

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

项目不需要任何翻译服务密钥。

## 11. 项目命令

```text
pnpm dev                  # 本地开发
pnpm lint                 # ESLint
pnpm typecheck            # Vue / TypeScript 类型检查
pnpm content:check        # 内容 Schema、映射与路由校验，待实现
pnpm generate             # 生成静态站点
pnpm preview              # 本地预览生产产物
pnpm check                # 执行当前全部质量检查
```

## 12. 已知技术问题与处理方向

| 问题 | 处理方向 |
| --- | --- |
| 默认语言意外出现 `/en` 前缀 | 使用 `prefix_except_default`，所有链接通过 locale helper 生成 |
| 浏览器自动把 `/` 跳到中文 | 关闭 `detectBrowserLanguage`，只允许用户主动切换 |
| i18n 路由与 Content 路径重复语言前缀 | 页面路由和内容集合解耦，按 locale 选择集合 |
| 缺少中文译文时语言切换进入 404 | 切换前通过 `translationKey` 检查目标集合是否存在 |
| 缺少译文时生成无效 `hreflang` | 只为真实存在的译文输出 alternate URL |
| 英文原文更新但中文译文遗漏 | 内容校验报告成对文章更新时间差异，由作者人工确认 |
| SSG 未发现全部动态路由 | 构建阶段显式枚举并预渲染 |
| Fuse.js 索引随文章增加而变大 | 按语言懒加载，达到阈值后评估 Pagefind |
| 标签翻译导致 URL 不稳定 | 使用稳定标签 ID，显示名称单独翻译 |
| 本地与 CI 依赖版本不一致 | 固定 Node.js、pnpm 和 lockfile |

## 13. 已确认决策

1. 使用 Nuxt UI 基础组件，页面视觉自行设计。
2. 英文是默认语言和原始创作语言。
3. 英文路由不带前缀，中文路由统一带 `/zh`。
4. 访问根路径始终显示英文，不执行浏览器语言自动跳转。
5. UI 文案和文章的中文版本都由作者手工维护。
6. 不实现机器翻译、翻译 API、自动翻译脚本或翻译工作流。
7. 搜索首版仅提供全局弹窗。
8. 首版默认不接入访问统计。
9. 生产域名为 `https://kevinguo.ink`，直接写入项目配置，不通过环境变量注入。

仍待确定：

- 正式网站名称、作者信息、默认 OG 图片和社交链接。
- 首页最终信息架构与视觉方案。
- 英文原文修改后提醒中文译文同步的具体校验规则。

## 14. 首版验收标准

- `/`、`/blog`、`/tags`、`/about` 显示英文且不带语言前缀。
- `/zh`、`/zh/blog`、`/zh/tags`、`/zh/about` 显示中文。
- 用户可主动切换语言，且不会因浏览器语言被自动重定向。
- 可通过 Markdown 独立维护英文原文和中文译文。
- 文章、标签和搜索结果只展示当前语言内容。
- 缺少中文译文时，不生成无效中文文章页、Sitemap URL 或 `hreflang`。
- 草稿不会出现在页面、搜索索引和 Sitemap 中。
- 文章详情正确渲染 Markdown、代码块、图片、目录和 MDC 组件。
- 页面具备正确的 title、description、canonical、`hreflang`、OG 和 Sitemap。
- `pnpm lint`、`pnpm typecheck`、内容校验和 `pnpm generate` 全部通过。
- Pull Request 能产生 Preview，`main` 能部署到 Vercel Production。

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
