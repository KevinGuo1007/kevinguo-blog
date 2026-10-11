# 个人博客技术方案

> 状态：基础工程已初始化，页面功能待实现
> 最后整理：2026-10-11
> 目标：使用 Nuxt 构建一个面向全球访问者、界面以英文为默认语言、支持中文切换，文章按原始语言发布的个人主页与文章博客。

## 1. 项目目标

项目采用“个人主页 + 博客”的产品形态。第一阶段优先保证内容发布、阅读体验、搜索、SEO 和自动部署，不建设后台管理系统，也不追求复杂应用功能。

核心原则：

- 使用 Nuxt 生态内成熟的模块和 UI 组件缩短上线时间。
- 页面结构和视觉风格自行设计，不使用现成博客页面模板。
- Markdown 和 Git 是唯一内容源，所有文章都可版本控制和回滚。
- 英文是默认界面语言，文章的写作语言由作者决定。
- 每篇文章只维护一份 Markdown，不需要译文；中英文界面显示相同的文章内容。
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
| 搜索 | Nuxt Content Search + Fuse.js | 统一文章集合的客户端全文搜索 |
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
/blog                   # 英文界面的统一文章列表
/blog/:slug             # 英文界面的原文详情
/tags                   # 英文标签集合
/tags/:tag               # 英文标签详情
/about                  # 英文关于页面

/zh                     # 中文首页
/zh/blog                # 中文界面的统一文章列表
/zh/blog/:slug          # 中文界面的原文详情
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
- 文章列表：按发布时间倒序展示，每页 10 篇；标签筛选后按筛选结果分页，改变筛选条件时回到第一页。有文章时显示分页控件，包括只有一页的情况；没有文章时隐藏。
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
│   └── blog/                # 所有文章，每篇只维护一份原文
├── i18n/
│   └── locales/
│       ├── en.json
│       └── zh.json
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
- `content/blog/**/*.md` 保存所有文章的标题、摘要、正文和元数据，不按语言划分。

## 6. 统一文章内容

### 6.1 内容集合

只建立一个 Nuxt Content 集合 `blog`，读取 `content/blog/**/*.md`。列表、详情、上一篇和下一篇以及搜索都查询这个集合，不随界面语言改变内容源。

### 6.2 文章规则

每篇文章只有一份 Markdown，Frontmatter 示例：

```yaml
---
title: Building a Personal Blog with Nuxt
description: Notes on the technical decisions behind this personal blog
slug: building-a-nuxt-blog
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

- `slug` 在所有文章中唯一，使用小写 ASCII 字母、数字和连字符。
- 标题、摘要、正文和图片替代文字按作者写作的内容原样展示，允许中文、英文或混合语言。
- 标签使用稳定 ID，当前页面直接显示 ID。
- 导航、按钮、搜索提示、目录标题和日期格式随界面语言切换。
- 每篇已发布文章同时可通过 `/blog/<slug>` 和 `/zh/blog/<slug>` 阅读；切换界面语言时保留当前文章。
- `draft: true` 的文章不进入列表、详情、上一篇和下一篇、搜索或 Sitemap。

### 6.3 写作流程

```text
在 content/blog/ 编写或修改一篇 Markdown
  -> 本地预览，检查中英文界面均展示相同原文
  -> 运行内容校验和静态构建
  -> 提交文章
  -> 部署
```

## 7. 搜索与标签

首版使用 Nuxt Content 的 `queryCollectionSearchSections` 生成搜索数据，Fuse.js 在浏览器中完成搜索。搜索模块在用户首次打开弹窗时才加载并生成统一文章索引，不进入普通页面的 SSR payload。

规则：

- Header 提供搜索入口。
- `Cmd/Ctrl + K` 打开搜索弹窗。
- 两种界面语言都搜索 `blog` 中的同一批文章。
- 搜索标题、摘要、正文和标签。
- 文章搜索数据按需加载并复用，结果链接随当前界面语言生成。
- `draft: true` 的文章不进入索引。

内容提交前由 `pnpm content:check` 校验所有文章 slug 的格式与唯一性，以及本地图片路径；`pnpm check` 与 GitHub Actions CI 都会执行这项校验。

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
- 每篇已发布文章有两种界面语言的 URL，使用 i18n 输出互相对应的 alternate URL。
- `hreflang` 和 Open Graph locale 表示界面语言，标题、摘要和正文均取自同一份文章。
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
- 所有已发布文章的无前缀路由和 `/zh` 路由。
- 两种语言中实际存在的标签路由。

构建时排除草稿和无效内容。生成结束后检查英文首页、中文首页、文章详情、标签、Sitemap、404 和静态资源。

## 10. GitHub Actions 与 Vercel

建议拆分为两个工作流。

### `ci.yml`

- `pnpm install --frozen-lockfile`。
- ESLint。
- TypeScript 类型检查。
- Nuxt Content Schema 校验。
- 全局 slug 唯一性与格式、本地封面资源路径校验。
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
pnpm content:check        # 内容 slug 与本地封面校验
pnpm generate             # 生成静态站点
pnpm preview              # 本地预览生产产物
pnpm check                # 执行当前全部质量检查
```

## 12. 已知技术问题与处理方向

| 问题 | 处理方向 |
| --- | --- |
| 默认语言意外出现 `/en` 前缀 | 使用 `prefix_except_default`，所有链接通过 locale helper 生成 |
| 浏览器自动把 `/` 跳到中文 | 关闭 `detectBrowserLanguage`，只允许用户主动切换 |
| i18n 路由与 Content 路径重复语言前缀 | 页面路由和内容集合解耦，两种界面共用 `blog` 集合 |
| SSG 未发现全部动态路由 | 构建阶段显式枚举并预渲染 |
| Fuse.js 索引随文章增加而变大 | 统一集合懒加载，达到阈值后评估 Pagefind |
| 标签翻译导致 URL 不稳定 | 使用稳定标签 ID，显示名称单独翻译 |
| 本地与 CI 依赖版本不一致 | 固定 Node.js、pnpm 和 lockfile |

## 13. 已确认决策

1. 使用 Nuxt UI 基础组件，页面视觉自行设计。
2. 英文是默认界面语言，文章可以使用任意写作语言。
3. 英文路由不带前缀，中文路由统一带 `/zh`。
4. 访问根路径始终显示英文，不执行浏览器语言自动跳转。
5. UI 文案保留中英文；文章只维护一份原文，不需要译文。
6. 不实现机器翻译、翻译 API、自动翻译脚本或翻译工作流。
7. 搜索首版仅提供全局弹窗。
8. 首版默认不接入访问统计。
9. 生产域名为 `https://kevinguo.ink`，直接写入项目配置，不通过环境变量注入。

仍待确定：

- 正式网站名称、作者信息、默认 OG 图片和社交链接。
- 首页最终信息架构与视觉方案。

## 14. 首版验收标准

- `/`、`/blog`、`/tags`、`/about` 显示英文且不带语言前缀。
- `/zh`、`/zh/blog`、`/zh/tags`、`/zh/about` 显示中文。
- 用户可主动切换语言，且不会因浏览器语言被自动重定向。
- 每篇文章只需在 `content/blog/` 维护一个 Markdown 文件。
- 两种界面展示同一批文章、标签和搜索内容，标题、摘要与正文保持原样。
- 已发布文章在两种界面语言下均可访问，语言切换保留文章。
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
