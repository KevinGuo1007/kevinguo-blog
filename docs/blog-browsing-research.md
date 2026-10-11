# 博客文章浏览方式调研

调研日期：2026-10-11。

本报告采用代表性样本研究，核查官方文档、维护方源码和实际页面，不是流量排名或市场占有率调查。“主流”在此表示选取有代表性的博客系统与设计，不表示所有博客都采用这些方式。平台能力、主题提供的展示和站点作者实际开启的入口需要分别判断；可选功能不能写成默认启用。此次只为后续设计提供证据，不修改博客功能。

## 平台与主题的组织方式

### WordPress：分类、标签、日期归档分别存在，布局由主题决定

- 分类用于较宽的主题分组，标签用于具体关键词；二者可以同时使用。[WordPress.com 分类与标签指南](https://wordpress.com/support/posts/categories-vs-tags/)
- 一篇文章可属于多个分类；分类支持父子层级。分类链接进入对应文章归档，父分类的归档也包含子分类文章，典型路径为 `/category/animals/`。[WordPress.org 分类说明](https://wordpress.org/documentation/article/posts-categories-screen/)
- 标签也可多选，但没有父子层级；文章标签链接进入对应标签归档，也可以提供标签云入口。[WordPress.org 标签说明](https://wordpress.org/documentation/article/posts-tags-screen/)
- 日期入口可用 Archives 区块展示：默认列表，也可改为下拉菜单、显示文章数量，并按年、月、周、日分组。[Archives 区块文档](https://wordpress.org/documentation/article/archives-block/)
- 分类、标签和日期归档可使用不同模板，也可回退到共同的 `archive.html`。因此，三种归档有各自的数据范围，并不要求各自拥有完全不同的卡片样式。入口在导航、侧栏或页面中的位置取决于主题与站点配置。[模板层级文档](https://developer.wordpress.org/themes/templates/template-hierarchy/)

**可借鉴点（设计归纳）：** 分类负责主题目录，标签提供跨目录的关联，日期归档提供历史入口。独立链接和共用文章列表可以同时成立。

### Ghost：以标签组织内容，用主标签承担栏目作用

- 一篇文章可以有多个标签，自动进入每个标签对应的内容列表；标签列表拥有独立 URL、RSS 和封面等元数据。第一个标签是主标签，一些主题默认只显示主标签。[Ghost 标签管理说明](https://ghost.org/help/tags/)
- 官方说明明确将 `primary_tag` 的用途之一描述为前台类似分类的组织方式。因此，不能假定所有博客都同时维护独立的 `category` 和 `tags` 字段。[Primary Tags 官方说明](https://ghost.org/changelog/primary-tags/)
- 默认标签路由是 `/tag/:slug/`，支持分页；可使用标签专用模板，也可复用 `index.hbs`。[Tag context 文档](https://ghost.org/docs/themes/contexts/tag/)
- 默认首页按发布顺序倒序，默认路由提供标签和作者归档。自定义 routes、collections 或 channels 可提供额外浏览入口，排序可设为 `published_at desc`。注意，路由文档中的 collection 是互斥内容区，一篇文章只能属于一个；这与文章可以出现在多个标签归档中不同。[动态路由文档](https://docs.ghost.org/themes/routing/)

**核实边界：** 上述官方默认路由没有列出按年月分组的全站时间线；本次没有找到官方默认年月时间线的证据，不能据此说 Ghost 无法实现。时间分组页面需要继续核查具体主题或自定义模板。

**可借鉴点（设计归纳）：** 标签可用于内容关联，同时选一个主标签表示文章的大方向；栏目入口与标签名称、URL 前缀可以按站点需求定制。

### Hexo + NexT：独立归档、分类目录和标签云

- 文章 Frontmatter 原生提供 `date`、`updated`、`categories`、`tags`。分类列表的顺序具有语义：`[Sports, Baseball]` 表示父子分类路径，不能直接解释成两个互不关联的分类。多个分类路径可以用嵌套数组表达，标签则处于同一级。[Hexo Frontmatter 文档](https://hexo.io/docs/front-matter)
- 默认目录配置为 `archives`、`categories`、`tags`；这些目录可以调整，分类及标签 slug 也可映射。[Hexo 配置文档](https://hexo.io/docs/configuration)
- 官方 archive generator 默认按 `date` 倒序，可生成年度、月度归档，并支持分页。[hexo-generator-archive 官方 README](https://github.com/hexojs/hexo-generator-archive)
- NexT 文档给出 `/archives/` 导航入口；标签总览需创建 `type: tags` 页面并加入菜单，显示标签云；分类总览同样创建 `type: categories` 页面。它们是可配置的独立入口，不能说安装后都默认显示。[NexT 自定义页面文档](https://theme-next.js.org/docs/theme-settings/custom-pages)
- 当前 NexT 源码的 `menu` 中包含这些示例，但菜单项处于注释状态，侧栏的文章／分类／标签统计则有独立配置。[NexT 配置源码](https://github.com/next-theme/hexo-theme-next/blob/master/_config.yml)
- NexT 的归档、单个分类和单个标签页面都调用相同的 `post-collapse` 宏，并提供分页；即三种结果页复用文章列表模板。[归档模板](https://raw.githubusercontent.com/next-theme/hexo-theme-next/master/layout/archive.njk)、[分类模板](https://raw.githubusercontent.com/next-theme/hexo-theme-next/master/layout/category.njk)、[标签模板](https://raw.githubusercontent.com/next-theme/hexo-theme-next/master/layout/tag.njk)

**核实边界：** 本次 web 抓取未能访问 NexT 官网的 `/archives/` 页面及 `post-collapse` 宏正文。因此，上述源码可以确认三个页面复用同一个列表宏；不能只依靠宏名称推断它有折叠交互，也不能断言当前宏具体按年份分组或日期的视觉样式。

**可借鉴点（设计归纳）：** 用标签云／分类目录解决“先选主题”，用归档解决“按时间找旧文章”；进入某个标签或分类后，文章列表可以继续复用时间排序或归档式展示。

### Hugo：两个默认分类系统都可多值，视觉行为交给模板

- 默认配置含 `categories` 与 `tags` 两种 taxonomy，文章 Frontmatter 均以数组指定，可有一个或多个值。[Hugo taxonomy 配置文档](https://gohugo.io/configuration/taxonomies/)
- 官方明确说明 taxonomy 是平铺词条列表，而非嵌套结构。自动生成词条总览和每个词条的文章列表，例如 `/categories/` 与 `/categories/development/`。[Hugo Taxonomies 文档](https://gohugo.io/content-management/taxonomies/)
- 时间分组可通过 `GroupByDate` 构建，默认用 Frontmatter 中的 `date` 并倒序排列；官方示例是年月标题下面的文章标题链接列表。[GroupByDate 文档](https://gohugo.io/methods/pages/groupbydate/)

**核实边界：** 上述是 Hugo 的内容与模板能力，不是统一主题的导航、标签云或时间线默认 UI。不能将某一个 Hugo 主题的样式称为 Hugo 平台默认，也不能从 taxonomy 平铺推断文章目录／section 无法嵌套。

**可借鉴点（设计归纳）：** 两种主题维度虽然技术结构相同，仍可通过编辑约定赋予不同意义；时间线是对同一批文章按日期重新分组的模板。

## 平台样本支持的设计结论

以下是基于上述样本的归纳，不是全网使用率统计：

1. **“归档”一词有两种含义。** 广义可指任何文章集合页（标签归档、分类归档）；用户要求的时间线则是按发布日期组织的日期归档。讨论时应明确说“时间归档／时间线”。
2. **有独立 URL，不等于必须有三个顶级导航项。** 平台提供独立集合页，主题和站点配置决定入口所在位置。
3. **分类、标签没有统一的数据规则。** WordPress 分类有层级且可多选，Hexo 数组可表示父子路径，Hugo 两者均平铺多值，Ghost 以主标签表达栏目。之前建议的“一个主分类 + 多个标签”是适合维护的候选规则，不是行业唯一标准。
4. **主题维度和文章列表样式可以组合。** 标签／分类负责选择文章集合；选择之后的列表仍可按时间分组。NexT 复用列表模板、WordPress/Ghost 的模板回退都支持这个方向。
5. **按时间倒序的普通卡片列表与年份分组时间线应区分。** 前者突出最近文章；后者额外暴露年月结构，便于浏览历史。默认倒序不意味着已有时间线。

## 实际网站的页面与导航

本节直接查看站点自己的公开页面。Josh Comeau 的分类菜单、Simon Willison 的标签页额外通过浏览器打开检查。对未见到的入口只记录“本次页面未发现”，不据此断言全站不存在。页面数量会变化，以下仅记录结构。

| 样本 | 标签或主题入口 | 分类入口 | 时间浏览与文章预览 | 来源 |
| --- | --- | --- | --- | --- |
| DEV Community | 首页有 Popular Tags，文章条目下有可点击标签；标签进入 `/t/react` 等聚合页 | 所检查首页以标签为主要主题入口，未展示独立 Categories 目录 | 首页提供 Relevant / Latest / Top 切换；条目含作者、标题、日期、标签、阅读时间和互动信息。Latest 是排序入口，未按年份分组 | [首页](https://dev.to/)、[Latest](https://dev.to/latest)、[React 标签页](https://dev.to/t/react) |
| Medium | Explore topics 有主题搜索、推荐主题、宽泛主题与更具体词条的分组 | 展示具有目录层次的主题发现页；不能直接把平台主题分组等同于作者 Frontmatter 的 categories 字段 | 所检查的是主题目录；本次不对 Medium 全站的日期归档能力下结论 | [Explore topics](https://medium.com/explore-topics) |
| Josh W. Comeau | 所检查首页没有单独 Tags 总览入口 | 顶部 Categories 下拉菜单、页面侧栏与页脚分类链接；`/css/` 等独立分类页显示分类名称和文章数量 | 首页与分类页主要是标题、摘要和 Read more 链接；所检查导航未见年份归档入口 | [首页](https://www.joshwcomeau.com/)、[CSS 分类页](https://www.joshwcomeau.com/css/) |
| Julia Evans | 所检查首页以分类目录为主要主题入口 | 首页先列最近 10 篇，再直接按类别分节列出全部文章；类别标题也是链接，包含 Uncategorized | 类别下使用“月份年份 + 标题”的紧凑条目，同时展示内容方向与时间 | [首页](https://jvns.ca/) |
| Simon Willison | `/tags/` 提供标签云、条目数量和独立标签链接；页面明确支持最多三个标签的交集 | 首页另有 Entries / Links / Quotes / Notes 等内容类型入口，不能直接将内容类型当作主题分类 | 标签页侧栏有 Archive by year 年份链接；`/2025/` 用月份分节、数量统计、日期和标题构成紧凑目录；该年页从一月到十二月排列 | [首页](https://simonwillison.net/)、[标签页](https://simonwillison.net/tags/)、[年份归档](https://simonwillison.net/2025/) |
| 阮一峰的网络日志 | 本次归档页未展示标签云 | 存档页列分类名称和篇数；分类进入独立 URL，如 `/blog/developer/index.html`，分类文章再按年份分组 | 存档页有“按日期排列”链接，进入月份归档；月份页有年月选择和上月导航。分类页主要是紧凑标题列表，月份页也展示摘要 | [存档入口](https://www.ruanyifeng.com/blog/archives.html)、[开发者手册分类](https://www.ruanyifeng.com/blog/developer/index.html)、[月份归档](https://www.ruanyifeng.com/blog/2026/10/index.html) |
| Substack 实例：Simon Willison’s Newsletter | 本次 `/archive` 页面未见标签云或分类总览 | 不以这个单一实例推断 Substack 平台是否支持栏目或标签 | `/archive` 按月份标题分节；文章预览包含标题、简短说明、日期、图片和互动信息，说明时间归档也可以采用较丰富的预览形式 | [Archive](https://simonw.substack.com/archive) |
| Dan Abramov：overreacted | 所检查主页未展示标签入口 | 所检查主页未展示分类入口 | 主页直接按日期倒序列标题、日期和一句摘要，无年月分组；这是简洁最新文章列表的对照案例 | [主页](https://overreacted.io/) |

### 标签浏览：发现主题与组合筛选是不同的交互

- **点击一个标签进入文章集合：** DEV 用热门标签与文章上的标签链接提供入口。[DEV 首页](https://dev.to/)、[React 标签页](https://dev.to/t/react)
- **先浏览所有标签：** NexT 的标签云、Simon 的带数量标签云是标签总览页面。[NexT 页面配置](https://theme-next.js.org/docs/theme-settings/custom-pages)、[Simon 标签页](https://simonwillison.net/tags/)
- **组合多个标签：** Simon 明确提供标签交集 URL；这与当前项目的多个标签 AND 筛选具有相似语义。不能据此说所有博客都采用 AND 或所有标签页都支持多选。[Simon 标签页](https://simonwillison.net/tags/)

设计推论：博客可以同时有“标签目录”和“列表上的标签筛选”。当前项目已有后者，是否增加前者是额外的设计选择。

### 分类浏览：既可以先选分类，也可以直接按分类列文章

- **分类目录 → 分类文章页：** Josh 的分类菜单和阮一峰的分类目录都是这个模式；前者保留摘要预览，后者进一步按年份分组。[Josh 首页](https://www.joshwcomeau.com/)、[Josh CSS 页](https://www.joshwcomeau.com/css/)、[阮一峰分类页](https://www.ruanyifeng.com/blog/developer/index.html)
- **分类标题 → 直接列对应文章：** Julia 的首页将各类别及其文章放在同一长页面，读者不用先点进一个分类才能看到文章标题。[Julia 首页](https://jvns.ca/)

设计推论：分类展示并不必然要求卡片网格。要决定的是先让读者认识内容目录，还是让读者马上扫描各类文章。

### 时间浏览：最新排序、年月归档、视觉时间轴需要区分

- **最新排序：** DEV Latest 和 overreacted 的倒序文章列表主要回答“最近发布了什么”。[DEV Latest](https://dev.to/latest)、[overreacted](https://overreacted.io/)
- **年月归档：** Simon 年份页、阮一峰月份页暴露年月结构；同样称为归档，但 Simon 年份页的月份是升序，说明倒序并非所有归档的固定规则。[Simon 年份页](https://simonwillison.net/2025/)、[阮一峰月份页](https://www.ruanyifeng.com/blog/2026/10/index.html)
- **时间与预览形式可独立选择：** Simon 年份页主要是日期标题目录，Substack 实例的月份归档使用更丰富的文章预览。[Simon 年份页](https://simonwillison.net/2025/)、[Substack Archive](https://simonw.substack.com/archive)

设计推论：时间线的核心行为是让读者看见发布时间结构。竖线、圆点、左右交错卡片是可选择的视觉装饰；本次样本不足以支持“装饰性时间轴是主流标准”的说法。

## 对当前博客的启示（候选建议，尚未确认）

以下结合样本与仓库现状推导，不是外部网站明确要求我们采用的方案。

### 当前基线

- [`app/pages/blog/index.vue`](../app/pages/blog/index.vue) 是摘要卡片列表，支持多个标签 AND 筛选，已按 `date` 倒序；目前没有年月分组。
- [`content.config.ts`](../content.config.ts) 有 `date`、`updated`、`tags`，尚无分类字段。
- [`app/pages/tags/index.vue`](../app/pages/tags/index.vue) 是占位页面，还没有真正的标签目录。
- [`app/components/AppHeader.vue`](../app/components/AppHeader.vue) 的顶部导航为 Home、Project、Blog、About。
- 内容是中英文独立集合；所有新浏览方式应沿用当前语言集合和 `draft: false` 的文章范围。

### 建议的职责分工

| 入口 | 读者需求 | 候选展示 |
| --- | --- | --- |
| 文章列表 | 查看最新文章、读摘要后挑选 | 保留现有摘要卡片与标签筛选 |
| 时间归档 / 时间线 | 回顾某年、某月发布的文章 | 年份标题、篇数、日期与文章标题；优先紧凑列表 |
| 分类目录 | 了解作者有哪些内容方向 | 分类名称、说明或篇数；进入分类后按时间列文章 |
| 标签目录（可选） | 找到具体技术、工具或关键词 | 可点击标签与篇数；当前多标签筛选可继续保留 |

### 对上一轮方案的修正

1. **不先锁定三个同页视图。** 单页视图切换只是候选。实际样本中，独立分类／标签／时间归档 URL 反复出现；应把“入口在同一个 Blog 区域”与“所有视图都由 query 参数驱动”分开决定。
2. **不把单分类说成行业规范。** 可以为维护简单选择单个主分类，但 WordPress 的多分类、Ghost 的主标签、Hexo 的分类路径都提供了其他有效模型。
3. **分类与时间可以组合。** 分类结果页仍可按年份分组，类似阮一峰；分类本身选择文章，时间结构帮助读者浏览。
4. **不必强制三种视图显示相同内容密度。** 文章列表保留摘要，时间归档改为紧凑目录，分类总览显示数量，各自服务于不同阅读需求。

### 路由与导航的两个候选

- **同页切换：** `/blog?view=timeline`、`/blog?view=categories`。页面与数据易共享；适合主要作为当前列表的展示切换。若希望分别输出静态页面和不同页面元信息，需要额外安排。
- **独立页面、统一入口：** `/blog`、`/archives`、`/categories`、`/categories/<id>`，以及可选的 `/tags`、`/tags/<id>`。这些页面可在 Blog 内通过二级导航互相切换，顶部仍保留一个 Blog。独立页面有各自可直接访问的地址，也便于分别处理静态生成和页面元信息。

候选倾向：当前站点使用静态生成，且现有 `/tags` 已占位，可以优先考虑“独立页面 + Blog 区域内统一入口”。这是对维护、直接访问和样本设计的综合判断，不是已经确定的需求。具体路径可改；若改为 `/blog/timeline` 等路径，需考虑它与现有 `/blog/[slug]` 文章地址的命名空间关系。

### 后续再确认的决定

- 三种方式属于同一页的切换，还是三个有独立 URL 的页面；顶部 Blog 是否提供下拉入口。
- 分类采取一个主分类、多个平级分类，还是有父子层级；标签如何避免与分类重复。
- 分类页先显示分类目录，还是直接按分类展示各组文章。
- 时间归档按年还是年 + 月，是否展示摘要，默认顺序与是否需要年份跳转。
- 现有标签筛选是否跨视图保留；是否需要实现标签总览。
- 中英文分类共用稳定 ID 后的显示名称、旧文章未分类的处理方式。

## 方法与未核实范围

- 调研覆盖公开未登录页面与官方文档，没有对所有站点的手机菜单做完整交互测试，也没有进入作者后台。因此不对移动端差异或后台字段约束作未经核实的结论。
- 曾尝试访问 CSS-Tricks `/archives/`，抓取返回 403；该站不纳入证据表，也不据此判断其归档设计。
- 这份报告记录当前可观察结构，不评价哪种方式更受欢迎或转化率更高；没有流量或用户行为数据支持这样的排名。

