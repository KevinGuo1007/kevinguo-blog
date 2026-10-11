---
title: "博客写作示例：Markdown、MDC 与组件"
description: 当前博客支持的 Markdown 排版、MDC 属性和文章组件示例，按用途查找并参考对应写法
slug: hello-nuxt
translationKey: hello-nuxt
date: 2026-09-06
updated: 2026-10-11
tags:
  - nuxt
  - vue
  - web
featured: false
draft: false
---

这篇文章是本项目的写作示例。使用目录查找组件，查看实际效果，再打开 `content/zh-CN/blog/hello-nuxt.md` 参考对应写法。英文版本位于 `content/en-US/blog/hello-nuxt.md`。

本文保留为草稿。需要在博客页面预览时，将对应文件顶部的 `draft` 改为 `false`。

## 组件速查

| 想展示的内容                       | 组件或写法                                   | 本文位置                            |
| ---------------------------------- | -------------------------------------------- | ----------------------------------- |
| 普通正文、列表、表格、脚注         | 标准 Markdown                                | [正文排版](#正文排版)               |
| 图片、文字样式、数据绑定           | MDC 属性与绑定                               | [图片与 MDC 属性](#图片与-mdc-属性) |
| 提示、技巧、警告、危险操作         | `note`、`tip`、`warning`、`caution`          | [提示框](#提示框)                   |
| 自定义颜色与图标的提示             | `callout`                                    | [提示框](#提示框)                   |
| 徽章、按键、图标、文件图标         | `badge`、`kbd`、`icon`、`code-icon`          | [行内组件](#行内组件)               |
| 代码标题、行高亮、多组代码、长代码 | 代码块、`code-group`、`code-collapse`        | [代码展示](#代码展示)               |
| 展示效果及对应代码、文件树         | `code-preview`、`code-tree`                  | [代码展示](#代码展示)               |
| 内容标签页                         | `tabs`、`tabs-item`                          | [标签页](#标签页)                   |
| 折叠补充说明与常见问题             | `collapsible`、`accordion`、`accordion-item` | [折叠内容](#折叠内容)               |
| 单张链接卡片、卡片网格             | `card`、`card-group`                         | [卡片](#卡片)                       |
| 分步骤教程                         | `steps`                                      | [步骤](#步骤)                       |
| 参数与配置项                       | `field`、`field-group`                       | [字段说明](#字段说明)               |
| 可复制的提示词                     | `prompt`                                     | [提示词](#提示词)                   |

## 正文排版

### 段落、强调与引用

段落之间空一行。可以使用 **加粗强调**、_斜体补充_、~~删除过时内容~~，以及 `draft: true` 这样的行内代码。

外部链接示例：[Nuxt Content 文档](https://content.nuxt.com/docs/files/markdown)。站内链接示例：[博客列表](/zh/blog)。

> 写作建议：一个段落围绕一个问题展开，用标题组织长文章。
>
> 引用中也可以包含 **强调文字** 和 [普通链接](/zh/blog)。

### 列表与任务列表

- 说明问题的背景。
- 给出可以复现的例子。
  - 补充必要的前提。
  - 解释结果与限制。

1. 先完成文章正文。
2. 再检查图片与链接。
3. 最后确认发布状态。

- [x] 填写文章标题与摘要
- [x] 检查中英文文章的关联字段
- [ ] 完成发布前预览

任务列表在博客中用于展示状态，读者不能直接勾选修改。

### 表格与脚注

| 字段             | 用途                     | 示例         |
| ---------------- | ------------------------ | ------------ |
| `slug`           | 决定文章地址             | `hello-nuxt` |
| `translationKey` | 关联中英文版本           | `hello-nuxt` |
| `draft`          | 控制文章是否出现在博客中 | `true`       |

脚注适合放补充说明或出处，不打断正文。[^writing-example]

[^writing-example]: 本文按当前项目安装的组件编写；新增渲染插件后，可以继续补充示例。

---

## 图片与 MDC 属性

### 图片尺寸

下图复用项目已有的头像文件，指定显示宽度；点击图片可以查看放大效果。

![图片示例：Kevin Guo 的头像](/images/profile/avatar-512x512.png){width="160" height="160"}

本地图片放在 `public/` 下，正文引用从 `/images/…` 开始，不包含 `public`。封面图片需要在 Frontmatter 的 `image` 中单独填写。

### 文字属性与数据绑定

[这段文字独占一行，并留出下方间距。]{.block .mb-2}

[这段文字使用博客的主题色。]{.text-primary}

当前文章标题来自 Frontmatter：**{{ $doc.title }}**。

## 提示框

### note：补充说明

::note
[**笔记范围**]{.mb-2 .block}

这是补充说明。提示框正文可以包含 **加粗**、`行内代码`、[链接](/zh/blog) 和列表。

- 说明适用范围。
- 补充阅读前提。

::

### tip：技巧与建议

::tip
[**写作技巧**]{.mb-2 .block}

文章页会单独显示 Frontmatter 的标题和摘要，正文直接从二级标题开始即可。

::

### warning：注意事项

::warning
[**链接检查**]{.mb-2 .block}

修改已发布文章的 `slug` 会改变 URL。调整文章地址时，需要同时检查旧链接。

::

### caution：危险操作

::caution
[**操作前保留备份**]{.mb-2 .block}

用于强调删除、覆盖或不可逆操作的后果。本示例只展示提示效果。

::

### callout：自定义颜色、图标与链接

::callout{color="primary" icon="i-lucide-info"}
[**主题色提示**]{.mb-2 .block}

适合展示阅读路线、文章摘要或需要特别强调的补充信息。

::

::callout{color="neutral" icon="i-lucide-newspaper" to="/zh/blog"}
点击这个提示框，可以回到博客列表。

::

::callout{color="success" icon="i-lucide-info"}

这条提示使用成功色，适合说明检查已通过或操作已完成。

::

`callout` 可用颜色：`primary`、`secondary`、`neutral`、`info`、`success`、`warning`、`error`。

## 行内组件

### badge：徽章

文章状态： :badge[写作示例]。适合标记实验功能、版本或内容状态。

### kbd：按键

快捷键示例：:kbd{value="meta"} + :kbd{value="K"}，或 :kbd{value="ctrl"} + :kbd{value="K"}。

### icon：图标

主页 :icon{name="i-lucide-house"}，文章 :icon{name="i-lucide-newspaper"}，标签 :icon{name="i-lucide-tag"}。

### code-icon：文件类型图标

Swift 文件 :code-icon{filename="Hello.swift"}。文件图标也会出现在带文件名的代码块中。

## 代码展示

### 代码块：标题与行高亮

这段代码显示文件名，并突出第 2 行。

```swift [Hello.swift] {2}
let name = "Kevin"
let message = "Hello, \(name)!"
print(message)
```

代码块支持复制。常用高亮语言包括 `c`、`cpp`、`python` / `py`、`javascript` / `js`、`typescript` / `ts`、`bash`、`zsh`、`rust` / `rs`、`markdown` / `md`，以及 `css`、`html`、`jsx`、`json`、`mdc`、`sh`、`shell`、`swift`、`tsx`、`vue`、`yaml`。

### 常用语言图标

切换标签查看九种常用语言的图标与高亮。图标根据方括号中的标题或文件扩展名匹配，例如 `Python` 与 `main.py` 都显示 Python 图标。仅写代码语言、不填写标题时，不会显示文件标题栏。

::code-group

```c [C]
#include <stdio.h>

int main(void) {
    puts("Hello, blog!");
    return 0;
}
```

```cpp [C++]
#include <iostream>

int main() {
    std::cout << "Hello, blog!\n";
    return 0;
}
```

```python [Python]
print("Hello, blog!")
```

```javascript [JavaScript]
console.log("Hello, blog!");
```

```typescript [TypeScript]
const message: string = "Hello, blog!";
console.log(message);
```

```bash [Bash]
echo "Hello, blog!"
```

```zsh [Zsh]
print -r -- "Hello, blog!"
```

```rust [Rust]
fn main() {
    println!("Hello, blog!");
}
```

```markdown [Markdown]
# 写作笔记

使用 **加粗** 强调要点。
```

::

C 的 `.c`、`.h` 文件使用 C 图标；C++ 的 `.cpp`、`.cc`、`.cxx`、`.hpp`、`.hh`、`.hxx` 文件使用 C++ 图标。Bash 与 Zsh 使用同一套 Shell 高亮语法，当前配置均使用 GNU Bash 图标，包括 `.sh`、`.zsh`、`.zshrc` 和 `.zprofile`。

### code-group：切换多组代码

切换标签，查看不同用途的命令。

::code-group

```bash [开发预览]
pnpm dev
```

```bash [内容检查]
pnpm content:check
```

```bash [静态生成]
pnpm generate
```

::

### code-collapse：展开长代码

::code-collapse{openText="展开" closeText="收起" name="文章配置"}

```yaml [文章配置]
title: 博客写作示例
description: 用于参考 Markdown 与 MDC 组件
slug: hello-nuxt
translationKey: hello-nuxt
date: 2026-09-06
updated: 2026-10-11
tags:
  - nuxt
  - vue
  - web
featured: false
draft: true
```

::

### code-preview：展示效果与代码

上方是实际展示效果，下方是对应示例代码。`#code` 指定组件的代码插槽。

::code-preview

**预览区域**：这段文字使用加粗效果。

#code

```html
<strong>预览区域</strong>：这段文字使用加粗效果。
```

::

### code-tree：按文件树浏览代码

选择文件查看代码。文件名中的 `/` 形成目录层级；默认打开 `Sources/Welcome.swift`。

::code-tree{default-value="Sources/Welcome.swift" :expand-all="true"}

```swift [Sources/Welcome.swift]
let title = "Writing examples"
print(title)
```

```swift [Sources/Publish.swift]
let isDraft = true
print(isDraft ? "Draft" : "Published")
```

::

## 标签页

### tabs 与 tabs-item：切换正文内容

:::tabs

::tabs-item{label="写作"}
先写清文章的背景、过程与结论，再选择合适的组件辅助说明。

- 短提示使用提示框。
- 多种方案使用标签页。

::

::tabs-item{label="预览"}
检查标题、目录、代码块、图片和站内链接，再确认手机宽度下的排版。

::

::tabs-item{label="发布"}
将准备公开的语言版本设为 `draft: false`，并运行项目检查。

::

:::

## 折叠内容

### collapsible：折叠补充说明

::collapsible{openText="展开" closeText="收起" name="补充说明"}
适合放较长的背景、推导或可选阅读内容。

> 主线内容放在正文中，折叠区承载补充信息。

::

### accordion 与 accordion-item：常见问题

:::accordion

::accordion-item{label="为什么 Obsidian 提示框不能直接使用？"}
Obsidian 的提示框语法与 MDC 不同。博客文章使用 `note`、`tip`、`warning`、`caution` 或 `callout` 组件。

::

::accordion-item{label="可以在组件中继续写 Markdown 吗？"}
可以。组件内容中可以使用 **加粗**、列表、链接，或嵌套其他组件。

::

:::

## 卡片

### card：单张链接卡片与命名插槽

::card{to="/zh/blog" icon="i-lucide-newspaper"}
#title
查看所有文章

#default
卡片的标题来自 `#title` 插槽，这段介绍来自 `#default` 插槽。

::

### card-group：卡片网格

:::card-group

::card{title="博客列表" to="/zh/blog" icon="i-lucide-newspaper"}
阅读已发布的文章。

::

::card{title="标签索引" to="/zh/tags" icon="i-lucide-tag"}
按主题查找相关内容。

::

:::

## 步骤

### steps：带序号的教程步骤

通过 `level` 指定哪些标题作为步骤；这里使用四级标题。

::steps{level="4"}

#### 准备文章

填写标题、摘要、日期、`slug` 与 `translationKey`。

#### 编写正文

用 Markdown 组织章节，再按需要添加提示框、代码与图片。

#### 检查效果

预览页面，检查目录跳转、组件交互与窄屏排版。

::

## 字段说明

### field：单个参数

::field{name="slug" type="string" :required="true"}
文章地址标识，例如 `hello-nuxt`。使用小写英文字母、数字与连字符。

::

### field-group：一组参数

:::field-group

::field{name="title" type="string" :required="true"}
当前语言的文章标题。

::

::field{name="tags" type="string[]"}
文章标签数组，例如 `nuxt`、`vue`、`web`。

::

::field{name="draft" type="boolean"}
设为 `true` 时，文章不会出现在当前博客列表、详情查询与搜索中。

::

:::

## 提示词

### prompt：复制完整提示词

点击复制按钮获取下面的写作提示词。这个组件用于展示与复制内容，本身不会调用 AI。

::prompt{description="请将文章整理成背景、步骤和结论，并检查标题层级、图片说明和站内链接。" icon="i-lucide-info"}

请将文章整理成背景、步骤和结论，并检查标题层级、图片说明和站内链接。

::

## 从 Obsidian 迁移时的对应关系

| Obsidian 内容                 | 博客中的对应方式                            |
| ----------------------------- | ------------------------------------------- |
| 双链 `[[笔记]]`               | 标准 Markdown 链接，目标使用文章的实际 URL  |
| 图片嵌入 `![[图片.png]]`      | 标准 Markdown 图片，引用 `public/` 下的文件 |
| Callout                       | 本文的提示框组件                            |
| 可折叠 Callout                | `collapsible` 或 `accordion`                |
| 高亮文字                      | MDC 文字属性，例如主题色样式                |
| 隐藏注释                      | HTML 注释                                   |
| 笔记嵌入、块引用、Dataview    | 当前没有自动转换或专用渲染                  |
| 数学公式、Mermaid、Excalidraw | 当前没有配置专用渲染，可使用导出的图片      |

Obsidian 的 `%%…%%` 注释不会在博客中自动隐藏。迁移时，先核对内容与附件，再用本项目的实际页面预览确认效果。
