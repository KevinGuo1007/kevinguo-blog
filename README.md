# Kevin Guo's Blog

基于 Nuxt 4、Nuxt Content、Nuxt UI 和 `@nuxtjs/i18n` 的中英双语个人博客。英文是默认语言和原始内容语言，中文内容由作者手工编写维护。

当前仓库已经完成项目初始化、运行环境固定、基础模块安装、双语路由、内容集合与示例文章配置，可以开始实现博客页面。完整技术方案参见 [`docs/blog-tech-scheme.md`](docs/blog-tech-scheme.md)。

## 技术栈

- Nuxt 4、Vue 3、TypeScript
- Nuxt Content 3
- Nuxt UI 4、Tailwind CSS 4
- `@nuxtjs/i18n`
- Nuxt Image、Nuxt Icon
- Nuxt Sitemap、Nuxt Robots、Nuxt OG Image
- Fuse.js
- pnpm

## 环境要求

- Node.js 24.x，具体版本见 `.node-version`
- pnpm 11.25.0

项目启用了 `engine-strict=true`，版本不匹配时依赖安装会失败。建议使用 fnm、nvm、mise 或其他版本管理器切换到 `.node-version` 指定的 Node.js 版本。

## 开始使用

安装依赖：

```bash
pnpm install --frozen-lockfile
```

生产域名固定为 `https://kevinguo.ink`，直接配置在 `nuxt.config.ts` 中，同时用于 canonical、`hreflang`、Sitemap 和 Open Graph URL。

启动开发服务器：

```bash
pnpm dev
```

访问：

- 英文首页：`http://localhost:3000/`
- 英文博客：`http://localhost:3000/blog`
- 中文首页：`http://localhost:3000/zh`
- 中文博客：`http://localhost:3000/zh/blog`

项目不会根据浏览器语言自动跳转。访问 `/` 始终显示默认英文版本，用户主动切换语言后才进入对应的 `/zh` 页面。

## 常用命令

```bash
pnpm dev        # 启动开发服务器
pnpm lint       # ESLint 检查
pnpm typecheck  # Vue 与 TypeScript 类型检查
pnpm generate   # 静态生成站点
pnpm preview    # 预览静态生成结果
pnpm check      # 依次运行 lint、typecheck 和 generate
```

提交代码前至少运行：

```bash
pnpm check
```

## 项目结构

```text
app/
├── assets/css/main.css        # Tailwind CSS 与 Nuxt UI 样式入口
├── composables/               # 可复用的页面与内容逻辑
├── layouts/default.vue        # 默认页面布局
├── pages/                     # Nuxt 页面路由
└── app.vue                    # 应用入口
content/
├── en-US/blog/                # 英文原始文章
└── zh-CN/blog/                # 手工维护的中文译文
i18n/locales/
├── zh-CN.json                 # 中文 UI 文案
└── en-US.json                 # 英文 UI 文案
public/                        # 不经构建处理的公开资源
content.config.ts              # Content 集合与 Frontmatter Schema
nuxt.config.ts                 # Nuxt 与模块配置
```

页面只实现一套。i18n 使用 `prefix_except_default`：默认英文路由不带前缀，中文路由自动增加 `/zh`。不要在 `app/pages/` 下重复创建语言目录。

## 发布一篇文章

先编写英文原文：

```text
content/en-US/blog/<slug>.md
```

需要中文版本时，再由作者手工编写对应译文：

```text
content/zh-CN/blog/<slug>.md
```

项目不使用机器翻译、翻译 API 或自动翻译工作流。两个文件独立维护，但必须使用相同的 ASCII `slug` 和 `translationKey`。英文 Frontmatter 示例：

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

字段约定：

- `slug`、`translationKey` 和标签 ID 只能使用小写 ASCII 字母、数字与连字符。
- `date` 和 `updated` 使用 `YYYY-MM-DD`。
- `draft: true` 的文章之后必须从列表、搜索、Sitemap 和静态路由中排除。
- `featured: true` 表示可展示在首页精选文章区域。
- 标签保存稳定 ID；显示名称放在 i18n 语言文件中。
- 英文文章可以单独发布；只有中文文件真实存在时才生成对应中文文章路由和 `hreflang`。
- 中文译文必须对应一篇英文原文，不允许只存在中文文件。

已有的 `hello-nuxt.md` 可作为内容格式参考。

## 接下来从哪里开始搭建

建议先完成一条可验证的纵向链路，而不是同时开发所有页面。

### 1. 实现文章列表

编辑 `app/pages/blog/index.vue`：

- 调用 `useBlogCollection()` 获取当前语言对应的集合。
- 使用 `queryCollection()` 查询文章。
- 排除 `draft: true`。
- 按 `date` 倒序排列。
- 创建 `PostCard.vue` 渲染标题、摘要、日期、标签和封面。

### 2. 实现文章详情

创建：

```text
app/pages/blog/[slug].vue
```

根据当前语言集合和 URL slug 查询文章，使用 `<ContentRenderer>` 渲染正文。找不到文章时返回 404，并为文章设置 title、description、canonical 和 Open Graph 信息。

### 3. 实现全局布局

在 `app/layouts/default.vue` 中加入：

- `AppHeader.vue`
- 导航菜单
- 语言切换器
- 搜索按钮
- `AppFooter.vue`

导航文案应从 `i18n/locales/*.json` 读取，内部链接使用 `useLocalePath()` 生成。

### 4. 实现首页和标签

- 首页查询 `featured: true` 的精选文章和最新文章。
- 标签首页汇总当前语言的非草稿文章标签。
- 创建 `app/pages/tags/[tag].vue` 展示对应标签文章。
- 创建 `app/error.vue` 实现双语 404 页面。

### 5. 实现搜索

通过 `queryCollectionSearchSections()` 获取当前语言搜索数据，使用 Fuse.js 在浏览器中搜索，并支持 `Cmd/Ctrl + K` 打开搜索弹窗。

完成每一个阶段后运行 `pnpm check`，避免问题累积到部署阶段。

## 后续配置清单

以下内容不阻塞页面开发，应在主体页面完成后逐步实现。

### 内容与多语言

- [ ] 实现重复 slug、标签、图片路径和翻译映射校验脚本
- [ ] 增加 `pnpm content:check`
- [ ] 校验每篇中文译文都存在相同 `translationKey` 的英文原文
- [ ] 在语言切换器中仅链接真实存在的文章译文
- [ ] 约定英文原文更新后同步检查中文译文的人工维护流程

### SEO 与静态生成

- [ ] 确定作者资料、社交链接和默认 OG 图片
- [ ] 为各页面接入 `useLocaleHead()` 和完整 SEO 元数据
- [ ] 显式收集双语文章和标签的 Nitro prerender 路由
- [ ] 将有效文章和标签动态路由接入 Sitemap
- [ ] 只为真实存在的译文输出 `hreflang`
- [ ] 校验草稿不会进入页面、搜索、Sitemap 和静态产物

### 工程与部署

- [ ] 创建 GitHub Actions `ci.yml`
- [ ] 创建 Vercel Preview 与 Production 部署工作流
- [ ] 配置 `VERCEL_TOKEN`、`VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID`
- [ ] 关闭 Vercel 原生 Git 自动部署，避免重复部署
- [ ] 根据需要决定是否接入访问统计

## 当前完成标准

项目基础配置应满足：

```bash
pnpm lint
pnpm typecheck
pnpm generate
```

三条命令全部通过后，即可认为开发基线可用。
