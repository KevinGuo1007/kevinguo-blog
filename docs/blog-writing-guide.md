# 博客文章写作与 Markdown 迁移指南

本文面向文章作者。博客以仓库里的 Markdown 文件为内容源：英文原文放在 `content/en-US/blog/`，中文译文放在 `content/zh-CN/blog/`。页面使用 Nuxt Content 渲染正文；文章列表和详情页分别使用 Frontmatter 中的摘要、日期、标签和正文。英文文章地址是 `/blog/<slug>`，中文文章地址是 `/zh/blog/<slug>`。

## 从一篇新文章开始

1. 在 `content/en-US/blog/` 新建 `.md` 文件。建议文件名与 `slug` 一致，例如 `my-first-post.md`；实际文章地址由 `slug` 字段决定，不由文件名决定。
2. 复制下方模板，填写文章信息与正文。先用 `draft: true` 保存草稿。
3. 如果要发布中文版本，在 `content/zh-CN/blog/` 新建对应文件，手工编写中文标题、摘要和正文。英文原文可以单独发布；新中文文章需要有对应英文原文。
4. 完成后运行 `pnpm content:check`，再把准备发布的文章设为 `draft: false`，运行 `pnpm dev` 检查页面。提交前运行 `pnpm check`。

````md
---
title: "A Practical Guide to My Topic"
description: "What readers will learn from this article, in one or two sentences."
slug: my-first-post
translationKey: my-first-post
date: "2026-09-29"
updated: "2026-09-29"
image: /images/blog/my-first-post/cover.webp
tags:
  - writing
  - web
featured: false
draft: true
---

这里填写正文。文章页已经会显示 Frontmatter 的标题和摘要，正文可以直接从二级标题开始。

## 第一节

解释一个问题，并给出例子。

![说明图片内容的替代文字](/images/blog/my-first-post/example.webp)

```ts
const message = "Hello, blog";
```
````

模板中的封面路径只是示例：使用 `image` 时，要先把对应文件放到 `public/images/blog/my-first-post/cover.webp`。没有封面时可以删除 `image` 和图片文件。`updated`、`image` 也可以不填；其余内容按下表处理。

## Frontmatter 字段

Frontmatter 是文件顶部两行 `---` 之间的 YAML。第一行必须是 `---`；不要把原笔记的正文或 Obsidian 私有字段直接当作博客字段。

| 字段             | 怎么填写                                               | 页面或校验中的作用                                                         |
| ---------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `title`          | 必填，当前语言的文章标题                               | 文章页标题、列表标题、搜索结果和 SEO 标题                                  |
| `description`    | 必填，当前语言的一两句摘要；建议直接说明读者会读到什么 | 文章页标题下方、列表卡片、搜索内容和 SEO 摘要                              |
| `slug`           | 必填，例如`my-first-post`                              | 决定`/blog/my-first-post` 和 `/zh/blog/my-first-post`；同一语言内不可重复  |
| `translationKey` | 必填，建议与`slug` 相同                                | 连接英文原文和中文译文；同一语言内不可重复                                 |
| `date`           | 必填，`YYYY-MM-DD`                                     | 文章发布日期与列表排序                                                     |
| `updated`        | 可选，`YYYY-MM-DD`                                     | 记录修订日期；当前文章页只显示`date`                                       |
| `image`          | 可选，建议写`/images/blog/…`                           | 列表封面和文章的 Open Graph 图片；本地路径须指向`public/` 中真实存在的文件 |
| `tags`           | 可选，数组，例如`- web`                                | 文章标签和列表筛选；不填时默认为空数组                                     |
| `featured`       | 可选，布尔值`true` 或 `false`                          | 内容字段，默认`false`；当前首页尚未读取精选文章                            |
| `draft`          | 可选，布尔值`true` 或 `false`                          | 默认`false`；`true` 时当前文章列表、详情查询和搜索不会显示这篇文章         |

`slug`、`translationKey` 和每个标签 ID 只能用小写英文字母、数字及中间的连字符，例如 `swiftui`、`software-engineering`。不要用中文、空格、下划线或 `#标签`。标签在当前页面直接显示 ID，因此要选对两种语言都容易识别的词。

有中文译文时，两篇文章的 `slug`、`translationKey`、`tags` 和 `image` 必须一致；标题、摘要、正文按各自语言填写。两篇文章的 `draft` 各自生效，可以先发布英文版，再完成中文版。修改已发布文章的 `slug` 会改变 URL，已有外链需要人工处理。

## 写出适合页面的正文

- **标题与目录：** 详情页已单独显示 `title` 作为页面标题。正文建议从 `##` 开始，用 `###`、`####` 逐层展开；正文标题会进入侧边或移动端目录。不要只用加粗文字充当章节标题，也尽量避免跳级。标题文本改动后，指向该小节的锚点链接也可能需要更新。
- **段落、列表和引用：** 段落之间空一行；列表前后空一行；普通提示可用 `> 提示内容`。长文章拆成有意义的小节，避免整页只有一个超长段落或大表格。
- **代码：** 用三个反引号围住代码，并在起始围栏后写语言名，例如模板中的 `ts`，或 `bash`、`swift`。项目已配置 `bash`、`css`、`html`、`js`、`jsx`、`json`、`md`、`mdc`、`swift`、`ts`、`tsx`、`vue`、`yaml` 的代码高亮；其他语言请在预览中确认效果。不要用缩进代替代码围栏。
- **图片：** 正文用 `![准确描述图片的替代文字](/images/blog/my-first-post/example.webp)`。将图片放在 `public/images/blog/my-first-post/` 后，以 `/images/…` 开头引用；路径大小写要与文件一致。封面 `image` 和正文图片是两处独立引用，需要分别填写。宽截图可裁剪、压缩或拆图，并检查手机宽度下的可读性。
- **链接：** 外部链接用 `[说明文字](https://example.com)`；本站文章链接用 `[相关文章](/blog/other-post)`，中文文章可用 `/zh/blog/other-post`。确认目标文章已发布且路径正确。若链接到正文小节，先在实际页面核对生成的锚点。
- **表格：** 普通 Markdown 表格可用，但列很多或单元格内容很长时手机上难读；适合改为分节列表。图注、出处与图片或表格紧邻放置，便于读者理解。

## 从 Obsidian 或其他 Markdown 迁移

先复制原文件到文章目录，保留原笔记备份，再逐项调整。Obsidian 能显示的语法并不都属于通用 Markdown；迁移后以本博客的页面预览为准。

| 原文章写法                                                                                  | 在博客中怎么改                                                                                                                            |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Obsidian 的`[[另一篇笔记]]`、`[[另一篇笔记\|显示文字]]`                                     | 改成标准链接，例如`[显示文字](/blog/other-post)`；中文页面用 `/zh/blog/other-post`。先确认目标文章已有 `slug` 且已发布。                  |
| `[[笔记#某一节]]`、`[[笔记^块 ID]]`                                                         | 改成已发布页面的链接；小节锚点在页面上核对后再添加。Obsidian 块引用没有直接对应的博客路由。                                               |
| `![[图片.png]]`、`![[附件/图片.png\|600]]`                                                  | 把附件复制到`public/images/blog/<slug>/`，改成 `![替代文字](/images/blog/<slug>/image.png)`。原来的显示宽度参数不会自动变成网站图片尺寸。 |
| `![[别的笔记]]`                                                                             | 将需要展示的内容写入本文，或改为指向已发布文章的普通链接；不要依赖笔记嵌入。                                                              |
| `> [!note]`、`> [!warning]` 等 Obsidian Callout                                             | 改成普通引用，如`> **提示：**这里是内容。`；写完检查段落和引用块的边界。                                                                  |
| Obsidian 属性中的`aliases`、`cssclasses`、`publish`，或其他平台的 `categories`、`permalink` | 按上面的字段表手工映射需要保留的信息；这些原字段不会自动生成本站标题、标签或地址。                                                        |
| 正文里的`#标签`、Dataview 查询、Excalidraw、Mermaid、数学插件语法                           | 标签改填 Frontmatter 的`tags`；插件内容改写成文字、代码或导出的图片，并在页面预览。当前仓库没有为这些 Obsidian 插件语法配置专用渲染。     |
| `obsidian://…`、`file:///…`、`./assets/image.png` 等本地路径                                | 改成可公开访问的站内链接或`/images/…` 图片路径；本地磁盘地址对网站读者无效。                                                              |

普通 Markdown 文章也要检查图片相对路径、站内 `.md` 链接、Frontmatter 字段名和代码围栏。比如原文的 `[下一篇](./next-note.md)` 应改成 `[下一篇](/blog/next-note)`；搬动文件本身不会重写链接。

例如，原 Obsidian 正文：

```md
# 我的主题

参考 [[上一篇笔记|上一篇]]。

> [!note] 提示
> 看这张图：![[流程图.png]]
```

可改为博客正文，并按前文模板另加 Frontmatter：

```md
## 背景

参考 [上一篇](/zh/blog/previous-post)。

> **提示：**流程见下图。

![流程图展示的步骤](/images/blog/my-first-post/diagram.png)
```

这里的 `previous-post` 和图片文件名只是示例，必须替换成实际存在的文章 `slug` 与图片路径。

### 一次完整的图片迁移

假设原笔记中有 `![[Pasted image 2026-09-29.png]]`，当前文章 `slug` 为 `my-first-post`：

1. 将附件复制或转换为 `public/images/blog/my-first-post/diagram.webp`。
2. 把笔记中的嵌入改为 `![文章流程示意图](/images/blog/my-first-post/diagram.webp)`。
3. 若它也是封面，在 Frontmatter 另加 `image: /images/blog/my-first-post/diagram.webp`。
4. 启动站点后检查正文图片、列表封面、图片替代文字和窄屏显示。`pnpm content:check` 目前只检查 Frontmatter 中的本地 `image`，不会逐张检查正文图片。

## 预览、校验与发布

在仓库根目录运行：

```bash
pnpm content:check
pnpm dev
```

开发服务器启动后，打开 `http://localhost:3000/blog/<slug>` 或 `http://localhost:3000/zh/blog/<slug>`。`draft: true` 的文章不会出现在当前详情查询中；需要完整预览时，暂时设为 `draft: false`，检查后按发布计划保留 `false` 或改回 `true`。同时检查列表卡片、目录跳转、代码块、图片、所有链接，以及桌面和手机宽度下的排版。中文版本发布后，再检查语言切换能否到达对应译文。

准备提交时运行 `pnpm check`。它会依次做内容关系检查、lint、类型检查和静态生成。内容检查能发现重复 `slug` / `translationKey`、译文结构字段不一致以及本地封面缺失；它不能替代正文图片和链接的页面预览。发布前还应确认每个要公开的版本都已设为 `draft: false`。
