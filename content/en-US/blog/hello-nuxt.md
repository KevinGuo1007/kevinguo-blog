---
title: "Blog Writing Examples: Markdown, MDC and Components"
description: Examples of the Markdown formatting, MDC attributes and article components supported by this blog, organized for quick reference
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

This article is the project's writing reference. Use the table of contents to find a component, inspect its rendered example, then open `content/en-US/blog/hello-nuxt.md` to reuse its syntax. The Chinese version is in `content/zh-CN/blog/hello-nuxt.md`.

This article remains a draft. To preview it on the blog, change `draft` to `false` in the corresponding file's frontmatter.

## Component quick reference

| Content to display                                      | Component or syntax                          | Example section                                         |
| ------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| Text, lists, tables and footnotes                       | Standard Markdown                            | [Text formatting](#text-formatting)                     |
| Images, text styles and data binding                    | MDC attributes and bindings                  | [Images and MDC attributes](#images-and-mdc-attributes) |
| Notes, tips, warnings and dangerous operations          | `note`, `tip`, `warning`, `caution`          | [Callouts](#callouts)                                   |
| A callout with a custom color and icon                  | `callout`                                    | [Callouts](#callouts)                                   |
| Badges, keys, icons and file icons                      | `badge`, `kbd`, `icon`, `code-icon`          | [Inline components](#inline-components)                 |
| Code titles, highlighted lines, code tabs and long code | Code fences, `code-group`, `code-collapse`   | [Code display](#code-display)                           |
| A preview with code, or a file tree                     | `code-preview`, `code-tree`                  | [Code display](#code-display)                           |
| Tabbed text                                             | `tabs`, `tabs-item`                          | [Tabs](#tabs)                                           |
| Extra details and FAQs                                  | `collapsible`, `accordion`, `accordion-item` | [Collapsible content](#collapsible-content)             |
| A link card or a grid of cards                          | `card`, `card-group`                         | [Cards](#cards)                                         |
| A tutorial with numbered steps                          | `steps`                                      | [Steps](#steps)                                         |
| Parameters and configuration options                    | `field`, `field-group`                       | [Fields](#fields)                                       |
| A prompt readers can copy                               | `prompt`                                     | [Prompts](#prompts)                                     |

## Text formatting

### Paragraphs, emphasis and quotations

Separate paragraphs with a blank line. Use **bold for emphasis**, _italics for an aside_, ~~strikethrough for outdated text~~, and inline code such as `draft: true`.

External link: [Nuxt Content documentation](https://content.nuxt.com/docs/files/markdown). Internal link: [Blog index](/blog).

> Writing tip: focus each paragraph on one question and organize long articles with headings.
>
> Quotations can also contain **emphasis** and [regular links](/blog).

### Lists and task lists

- Explain the background.
- Provide a reproducible example.
  - Include the necessary prerequisites.
  - Explain the result and its limitations.

1. Complete the article body.
2. Check images and links.
3. Confirm publication settings.

- [x] Add the title and description
- [x] Check the fields linking the English and Chinese versions
- [ ] Finish the publication preview

Task lists display their state on the blog; readers cannot change the checkboxes.

### Tables and footnotes

| Field            | Purpose                                          | Example      |
| ---------------- | ------------------------------------------------ | ------------ |
| `slug`           | Determines the article URL                       | `hello-nuxt` |
| `translationKey` | Links the English and Chinese versions           | `hello-nuxt` |
| `draft`          | Controls whether the article appears on the blog | `true`       |

Footnotes hold extra context or sources without interrupting the text.[^writing-example]

[^writing-example]: These examples use the components currently installed in this project. Add more examples when new rendering plugins are introduced.

---

## Images and MDC attributes

### Image dimensions

This example reuses the project's existing avatar and sets its display width. Click the image to view it enlarged.

![Image example: Kevin Guo's avatar](/images/profile/avatar-512x512.png){width="160" height="160"}

Store local images under `public/` and reference them with a path starting with `/images/…`, omitting `public`. Set the frontmatter `image` separately when using a cover image.

### Text attributes and data binding

[This text occupies its own line and has space below it.]{.block .mb-2}

[This text uses the blog's primary color.]{.text-primary}

The current article title comes from frontmatter: **{{ $doc.title }}**.

## Callouts

### note: additional context

::note
[**Scope of these notes**]{.mb-2 .block}

This is additional context. A callout can contain **bold text**, `inline code`, [links](/blog) and lists.

- Explain the scope.
- Include prerequisites.

::

### tip: practical advice

::tip
[**Writing tip**]{.mb-2 .block}

The article page already displays the title and description from frontmatter. Start the body with a level-two heading.

::

### warning: things to check

::warning
[**Check your links**]{.mb-2 .block}

Changing a published article's `slug` changes its URL. Check existing links when changing an article address.

::

### caution: dangerous operations

::caution
[**Keep a backup first**]{.mb-2 .block}

Use this component to highlight the consequences of deletion, overwriting or irreversible actions. This example only displays a callout.

::

### callout: custom colors, icons and links

::callout{color="primary" icon="i-lucide-info"}
[**Primary-color callout**]{.mb-2 .block}

Use it for a reading path, an article summary or extra information that needs emphasis.

::

::callout{color="neutral" icon="i-lucide-newspaper" to="/blog"}
Click this callout to return to the blog index.

::

::callout{color="success" icon="i-lucide-info"}

This callout uses the success color to show that a check passed or an operation completed.

::

Available `callout` colors: `primary`, `secondary`, `neutral`, `info`, `success`, `warning` and `error`.

## Inline components

### badge: status labels

Article status: :badge[Writing example]. Use a badge for an experimental feature, a version or a content status.

### kbd: keyboard keys

Shortcut examples: :kbd{value="meta"} + :kbd{value="K"}, or :kbd{value="ctrl"} + :kbd{value="K"}.

### icon: inline icons

Home :icon{name="i-lucide-house"}, articles :icon{name="i-lucide-newspaper"}, tags :icon{name="i-lucide-tag"}.

### code-icon: file-type icons

A Swift file :code-icon{filename="Hello.swift"}. File icons also appear in code blocks with filenames.

## Code display

### Code blocks: filenames and highlighted lines

This block displays a filename and highlights its second line.

```swift [Hello.swift] {2}
let name = "Kevin"
let message = "Hello, \(name)!"
print(message)
```

Code blocks include a copy button. Common highlighting languages include `c`, `cpp`, `python` / `py`, `javascript` / `js`, `typescript` / `ts`, `bash`, `zsh`, `rust` / `rs` and `markdown` / `md`, alongside `css`, `html`, `jsx`, `json`, `mdc`, `sh`, `shell`, `swift`, `tsx`, `vue` and `yaml`.

### Common language icons

Switch tabs to inspect icons and highlighting for nine common languages. Icons match the bracketed title or file extension: both `Python` and `main.py` select the Python icon. A code fence with only a language and no title does not display a file header.

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
# Writing notes

Use **bold** to emphasize key points.
```

::

C files with `.c` or `.h` extensions use the C icon. C++ files with `.cpp`, `.cc`, `.cxx`, `.hpp`, `.hh` or `.hxx` extensions use the C++ icon. Bash and Zsh share the Shell highlighting grammar; both currently use the GNU Bash icon, including `.sh`, `.zsh`, `.zshrc` and `.zprofile` files.

### code-group: switch between code blocks

Switch tabs to see commands for different tasks.

::code-group

```bash [Development preview]
pnpm dev
```

```bash [Content check]
pnpm content:check
```

```bash [Static generation]
pnpm generate
```

::

### code-collapse: expand long code

::code-collapse{openText="Expand" closeText="Collapse" name="article configuration"}

```yaml [Article configuration]
title: Blog writing examples
description: A reference for Markdown and MDC components
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

### code-preview: a rendered result and its code

The rendered result appears above its example code. `#code` identifies the component's code slot.

::code-preview

**Preview area**: this text uses bold emphasis.

#code

```html
<strong>Preview area</strong>: this text uses bold emphasis.
```

::

### code-tree: browse code by file

Select a file to view its code. Slashes in filenames create directories; `Sources/Welcome.swift` is selected initially.

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

## Tabs

### tabs and tabs-item: switch between text sections

:::tabs

::tabs-item{label="Write"}
Explain the background, process and conclusion, then choose components that help communicate them.

- Use callouts for short notes.
- Use tabs for alternative approaches.

::

::tabs-item{label="Preview"}
Check headings, the table of contents, code blocks, images and internal links. Then review the mobile layout.

::

::tabs-item{label="Publish"}
Set the language versions ready for publication to `draft: false` and run the project checks.

::

:::

## Collapsible content

### collapsible: optional details

::collapsible{openText="Show" closeText="Hide" name="additional details"}
Use this area for longer background information, derivations or optional reading.

> Keep the main explanation in the article body and put supporting details here.

::

### accordion and accordion-item: frequently asked questions

:::accordion

::accordion-item{label="Why can't I reuse an Obsidian callout directly?"}
Obsidian callouts use a different syntax from MDC. Blog articles use the `note`, `tip`, `warning`, `caution` or `callout` components.

::

::accordion-item{label="Can I use Markdown inside a component?"}
Yes. Component content can contain **bold text**, lists, links or nested components.

::

:::

## Cards

### card: a link card with named slots

::card{to="/blog" icon="i-lucide-newspaper"}
#title
Browse all articles

#default
The card title comes from the `#title` slot, and this description comes from the `#default` slot.

::

### card-group: a grid of cards

:::card-group

::card{title="Blog index" to="/blog" icon="i-lucide-newspaper"}
Read published articles.

::

::card{title="Tag index" to="/tags" icon="i-lucide-tag"}
Find related articles by topic.

::

:::

## Steps

### steps: numbered tutorial steps

Use `level` to choose which headings become steps. This example uses level-four headings.

::steps{level="4"}

#### Prepare the article

Fill in the title, description, date, `slug` and `translationKey`.

#### Write the body

Organize sections with Markdown, then add callouts, code and images as needed.

#### Check the result

Preview the page and check navigation, component interactions and the mobile layout.

::

## Fields

### field: a single parameter

::field{name="slug" type="string" :required="true"}
The article address identifier, such as `hello-nuxt`. Use lowercase English letters, digits and hyphens.

::

### field-group: related parameters

:::field-group

::field{name="title" type="string" :required="true"}
The article title in the current language.

::

::field{name="tags" type="string[]"}
An array of article tags, such as `nuxt`, `vue` and `web`.

::

::field{name="draft" type="boolean"}
When `true`, the article is excluded from the current blog listing, detail query and search.

::

:::

## Prompts

### prompt: copy a complete prompt

Use the copy button to get this writing prompt. The component displays and copies content; it does not call an AI model itself.

::prompt{description="Organize the article into background, steps and conclusions. Check heading levels, image descriptions and internal links." icon="i-lucide-info"}

Organize the article into background, steps and conclusions. Check heading levels, image descriptions and internal links.

::

## Moving content from Obsidian

| Obsidian content                           | Blog equivalent                                                  |
| ------------------------------------------ | ---------------------------------------------------------------- |
| Wikilinks such as `[[Note]]`               | Standard Markdown links using the actual article URL             |
| Image embeds such as `![[image.png]]`      | Standard Markdown images referencing files under `public/`       |
| Callouts                                   | The callout components shown in this article                     |
| Foldable callouts                          | `collapsible` or `accordion`                                     |
| Highlighted text                           | MDC text attributes, such as the primary-color style             |
| Hidden comments                            | HTML comments                                                    |
| Note embeds, block references and Dataview | No automatic conversion or dedicated renderer is configured      |
| Math formulas, Mermaid and Excalidraw      | No dedicated renderer is configured; exported images can be used |

Obsidian `%%…%%` comments are not automatically hidden on the blog. Check content and attachments during migration, then preview the actual page to confirm the result.
