---
title: Swift 与 SwiftUI 学习笔记
description: 系统整理 SwiftUI 的核心概念、布局、数据流与示例项目，并提供旧教程迁移提示和复习路线
slug: swift-swiftui-learning-notes
translationKey: swift-swiftui-learning-notes
date: 2026-09-09
tags:
  - swift
  - swiftui
  - ios
featured: false
draft: false
---

# swift & swiftUI 学习笔记

## swift 语法特性

## swiftUI

> [!abstract] 笔记范围
> 本节整理自 Apple 的 [Learning SwiftUI](https://developer.apple.com/tutorials/swiftui-concepts) 与 [Exploring SwiftUI Sample Apps](https://developer.apple.com/tutorials/sample-apps) 两条学习路径。目标是用“核心知识 → 最小示例 → 原文入口”的形式快速复习，而不是逐步照抄教程。

> [!warning] 版本提示（2026-09-02）
> Apple 已在这两条路径顶部标注：内容不再代表最新的 SwiftUI 或 Xcode 实践，并建议改读 [Develop in Swift Tutorials](https://developer.apple.com/tutorials/develop-in-swift/)。下面仍保留原教程的知识结构；示例尽量使用现代写法。阅读旧项目时尤其注意：`NavigationView` 通常改用 `NavigationStack` / `NavigationSplitView`，`PreviewProvider` 可改用 `#Preview`；iOS 17+ 的新项目可优先考虑 Observation（`@Observable`），但 `ObservableObject` 系列 API 仍能使用。

### 快速学习地图

| 学习阶段          | 先掌握什么                                                 | 对应实践                                |
| ----------------- | ---------------------------------------------------------- | --------------------------------------- |
| 1. App 骨架       | `App`、`Scene`、`View`、声明式视图树                       | About Me、Choose Your Own Story         |
| 2. 自适应布局     | 固有尺寸、Dynamic Type、stack、overlay/background、spacing | Organizing with Grids、Laying Out Views |
| 3. 数据流         | 单一事实来源、`@State`、`@Binding`、共享模型               | Date Planner、Image Gallery             |
| 4. 异步与系统能力 | `async/await`、`.task`、传感器、手势、相机                 | Meme Creator、Bubble Level、Camera 系列 |
| 5. 图形与智能能力 | `Shape`、动画、Vision、Core ML、数据集                     | Animating Shapes、Machine Learning 系列 |

### 一、SwiftUI Concepts：核心心智模型

#### 1. App principles：App、Scene 与 View

##### 1.1 SwiftUI App 的结构

核心知识：

- SwiftUI 是声明式 UI：描述“当前状态应该呈现什么”，状态变化后由框架重新计算相关视图。
- 一个 SwiftUI App 只有一个带 `@main` 的入口类型，并遵循 `App` 协议。
- `App.body` 返回一个或多个 `Scene`；`WindowGroup` 是常见主场景。
- `Scene` 保存窗口级生命周期与视图层级；`View.body` 描述界面节点。
- 小而可组合的 `View` 比在一个巨大 `body` 中堆叠全部内容更易复用与测试。

```swift [Swift]
import SwiftUI

@main
struct LearningApp: App {
    var body: some Scene {
        WindowGroup {
            DashboardView()
        }
    }
}

struct DashboardView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("SwiftUI Review", systemImage: "swift")
                .font(.title)
            Text("App → Scene → View")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}

#Preview {
    DashboardView()
}
```

文档出处：[Exploring the structure of a SwiftUI app](https://developer.apple.com/tutorials/swiftui-concepts/exploring-the-structure-of-a-swiftui-app)

##### 1.2 用 Scene 定义视图层级

核心知识：

- `WindowGroup` 会按平台提供窗口行为；iPadOS / macOS 可支持多窗口。
- 一个 App 可组合主场景与辅助场景，例如 macOS 的 `Settings`。
- 可根据平台条件编译不同场景或根视图，也可把复杂场景抽成自定义 `Scene`。
- `TabView`、`NavigationStack`、`NavigationSplitView` 是视图容器，不是 `Scene`；它们通常位于 `WindowGroup` 内。

```swift [Swift]
@main
struct JournalApp: App {
    var body: some Scene {
        WindowGroup {
            #if os(macOS)
            NavigationSplitView {
                SidebarView()
            } detail: {
                EntryListView()
            }
            #else
            TabView {
                EntryListView()
                    .tabItem { Label("Journal", systemImage: "book") }
                SettingsView()
                    .tabItem { Label("Settings", systemImage: "gear") }
            }
            #endif
        }

        #if os(macOS)
        Settings {
            SettingsView()
        }
        #endif
    }
}
```

文档出处：[Specifying the view hierarchy of an app using a scene](https://developer.apple.com/tutorials/swiftui-concepts/specifying-the-view-hierarchy-of-an-app-using-a-scene)

#### 2. View layout：让布局适应内容与环境

##### 2.1 保持内置 View 的自适应尺寸

核心知识：

- `Text` 应优先使用 `.body`、`.title`、`.caption` 等语义字体，系统才能响应 Dynamic Type。
- SF Symbols 更像文字而不是普通位图；用 `.font(...)` 调整其尺寸和字重。
- 文本与图标表达同一含义时优先使用 `Label`，让系统负责二者的尺寸和基线对齐。
- 控件优先使用系统尺寸与样式，例如 `.controlSize(...)`，不要随意固定 frame 破坏可点击区域。
- 普通图片默认按原始尺寸显示；需要缩放时组合 `.resizable()` 与 `.scaledToFit()` / `.scaledToFill()`。
- `Shape` 天生会填充提议尺寸，通常需要通过容器、`frame` 或 `aspectRatio` 约束。

```swift [Swift]
VStack(alignment: .leading, spacing: 16) {
    Label("Library", systemImage: "books.vertical.fill")
        .font(.title)

    AsyncImage(url: coverURL) { phase in
        switch phase {
        case .success(let image):
            image.resizable().scaledToFill()
        case .failure:
            ContentUnavailableView("无法加载封面", systemImage: "photo")
        default:
            ProgressView()
        }
    }
    .frame(height: 180)
    .clipShape(.rect(cornerRadius: 16))

    Button("Continue") { }
        .controlSize(.large)
}
```

文档出处：[Maintaining the adaptable sizes of built-in views](https://developer.apple.com/tutorials/swiftui-concepts/maintaining-the-adaptable-sizes-of-built-in-views)

##### 2.2 让非文本尺寸随文字缩放

核心知识：

- 布局中与文字关联的图标、间距和装饰也应随 Dynamic Type 改变。
- `Label` 会自动协调文字与 SF Symbol。
- 对必须使用数值的尺寸，用 `@ScaledMetric(relativeTo:)` 让数值相对某种字体样式缩放。
- 预览时至少检查：短/长文本、本地化、普通字号与辅助功能大字号。

```swift [Swift]
struct KeywordBadge: View {
    let title: String
    let symbol: String
    @ScaledMetric(relativeTo: .body) private var inset = 10

    var body: some View {
        Label(title, systemImage: symbol)
            .font(.body)
            .padding(inset)
            .background(.teal.opacity(0.16), in: Capsule())
    }
}

#Preview("Dynamic Type") {
    KeywordBadge(title: "Accessibility", symbol: "accessibility")
        .environment(\.dynamicTypeSize, .accessibility3)
}
```

文档出处：[Scaling views to complement text](https://developer.apple.com/tutorials/swiftui-concepts/scaling-views-to-complement-text)

##### 2.3 overlay 与 background 的布局关系

核心知识：

- `overlay` 把内容放在主视图前方，`background` 放在后方。
- 二者以被修饰视图为布局基准，适合“装饰必须跟随主体尺寸”的设计。
- modifier 顺序会改变结果：先 `padding` 再 `background`，背景会包含 padding；反过来则不会。
- 只需前后叠层时优先用 overlay/background；多个平级视图共同决定整体尺寸时使用 `ZStack`。

```swift [Swift]
Image("mountain")
    .resizable()
    .scaledToFit()
    .overlay(alignment: .bottomLeading) {
        Text("Morning trail")
            .font(.caption.bold())
            .padding(8)
            .background(.black.opacity(0.65), in: Capsule())
            .foregroundStyle(.white)
            .padding(10)
    }
    .clipShape(.rect(cornerRadius: 16))
```

文档出处：[Layering content](https://developer.apple.com/tutorials/swiftui-concepts/layering-content)

##### 2.4 隐藏 View：移除还是保留空间

| 方法                    | 是否占据布局空间 | 适合场景                           |
| ----------------------- | ---------------- | ---------------------------------- |
| `if condition { view }` | 否               | 内容确实不存在，其他内容应重新排布 |
| `.opacity(0)`           | 是               | 暂时不可见，但不希望周围内容移动   |
| `.hidden()`             | 是               | 始终隐藏，用它的尺寸参与测量或占位 |

```swift [Swift]
VStack {
    TextField("Email", text: $email)

    // 错误消失时仍保留一行高度，输入框不会跳动。
    Text(errorMessage ?? "占位")
        .foregroundStyle(.red)
        .opacity(errorMessage == nil ? 0 : 1)

    if wantsDifferentBillingAddress {
        BillingAddressForm()
    }
}
```

文档出处：[Choosing the right way to hide a view](https://developer.apple.com/tutorials/swiftui-concepts/choosing-the-right-way-to-hide-a-view)

##### 2.5 用 Stack 组织与对齐内容

核心知识：

- `VStack` 纵向、`HStack` 横向、`ZStack` 前后叠放。
- 对齐是容器的职责：常用 `.leading` 与 `.firstTextBaseline`。
- 可嵌套 stack 形成复杂但仍可读的布局；相关内容应先封装成小 View。
- 日期和数字优先使用 `Text(value, format: ...)`，系统会处理 locale。
- 装饰背景可以用形状叠层，最后统一 `clipShape`，避免分别裁切产生错误边角。

```swift [Swift]
VStack(alignment: .leading, spacing: 8) {
    HStack(alignment: .firstTextBaseline) {
        Image(systemName: "gift.fill")
        Text(event.title).font(.title2.bold())
        Spacer()
        Text(event.date, format: .dateTime.month().day())
            .foregroundStyle(.secondary)
    }
    Text("\(event.remainingTasks) tasks remaining")
}
.padding()
.background(.teal.opacity(0.12), in: RoundedRectangle(cornerRadius: 16))
```

文档出处：[Organizing and aligning content with stacks](https://developer.apple.com/tutorials/swiftui-concepts/organizing-and-aligning-content-with-stacks)

##### 2.6 spacing、padding 与 Spacer

核心知识：

- stack 的 `spacing` 控制子视图之间的距离；传 `0` 可完全移除默认间距。
- `.padding()` 在被修饰视图外侧增加空间；作用对象与 modifier 顺序决定最终效果。
- `Spacer()` 消耗所在轴上的剩余空间，把相邻内容推开。
- 需要跟随字号的间距时使用 `@ScaledMetric`。
- 先观察系统默认值，再决定是否自定义，通常更容易得到跨平台自适应布局。

```swift [Swift]
struct ToolbarRow: View {
    @ScaledMetric(relativeTo: .body) private var gap = 12

    var body: some View {
        HStack(spacing: gap) {
            Label("Inbox", systemImage: "tray")
            Spacer(minLength: gap)
            Button("Compose", systemImage: "square.and.pencil") { }
        }
        .padding(.horizontal)
    }
}
```

文档出处：[Adjusting the space between views](https://developer.apple.com/tutorials/swiftui-concepts/adjusting-the-space-between-views)

#### 3. State and data flow：单一事实来源

##### 3.1 用 State 驱动 UI，用 Binding 共享可写访问

核心知识：

- View 是当前数据的函数；数据变更时，SwiftUI 只更新依赖该数据的界面。
- `@State` 表示由当前 View 拥有的轻量、局部状态；属性本身应保持 `private`。
- `$value` 是投影值，通常表示可传给子 View 或控件的 `Binding`。
- `@Binding` 不拥有数据，只提供对其他位置“事实来源”的读写通道。
- 呈现 sheet 时，先用 state 描述编辑配置，再在 dismiss / save 时把结果写回模型。

```swift [Swift]
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
            Stepper("Adjust", value: $count, in: 0...20)
        }
    }
}

struct ResetButton: View {
    @Binding var value: Int

    var body: some View {
        Button("Reset") { value = 0 }
    }
}
```

文档出处：[Driving changes in your UI with state and bindings](https://developer.apple.com/tutorials/swiftui-concepts/driving-changes-in-your-ui-with-state-and-bindings)

##### 3.2 构建绑定值的自定义输入控件

设计自定义控件时先回答三件事：控件需要什么数据、怎样修改数据、如何把数据状态表现出来。控件本身接收 `@Binding`，事实来源由父 View 持有。

```swift [Swift]
struct StarRating: View {
    @Binding var rating: Int
    let maximum = 5

    var body: some View {
        HStack {
            ForEach(1...maximum, id: \.self) { value in
                Button {
                    rating = rating == value ? 0 : value
                } label: {
                    Image(systemName: value <= rating ? "star.fill" : "star")
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(value) stars")
            }
        }
        .foregroundStyle(.yellow)
    }
}
```

父 View 使用 `StarRating(rating: $rating)`，子控件即可读写同一值。

文档出处：[Creating a custom input control that binds to a value](https://developer.apple.com/tutorials/swiftui-concepts/creating-a-custom-input-control-that-binds-to-a-value)

##### 3.3 自定义 Binding 与动态事实来源

核心知识：

- `Binding(get:set:)` 可把存储在字典、数据仓库或转换层中的值暴露成可绑定属性。
- 自定义 binding 适合“View 只有 id，值必须动态查找”的少数情况。
- 它不保存值；getter 和 setter 必须指向同一个真实数据源。
- 优先使用普通 `@State` / 可观察模型；只有无法直接持有值时才创建自定义 binding。

```swift [Swift]
struct TitleEditor: View {
    let id: UUID
    @State private var titles: [UUID: String] = [:]

    private var title: Binding<String> {
        Binding(
            get: { titles[id, default: ""] },
            set: { titles[id] = $0 }
        )
    }

    var body: some View {
        TextField("Title", text: title)
    }
}
```

文档出处：[Defining the source of truth using a custom binding](https://developer.apple.com/tutorials/swiftui-concepts/defining-the-source-of-truth-using-a-custom-binding)

---

### 二、Exploring SwiftUI Sample Apps：项目式复习

#### Chapter 1：Navigating Apps

##### 1. About Me

学习重点：

- 用 `TabView` 将 Home、Story、Favorites、Fun Facts 拆成独立页面。
- 把共享内容集中在数据类型中，各页面只负责选择和呈现。
- 用 `ScrollView` 呈现长文；用 stack 与 `ForEach` 构建重复 UI。
- 用 `@State` 保存当前随机事实等临时交互状态。

```swift [Swift]
TabView {
    ProfileHome(profile: profile)
        .tabItem { Label("Home", systemImage: "person") }
    FavoritesView(items: profile.favorites)
        .tabItem { Label("Favorites", systemImage: "heart") }
}
```

文档出处：[About Me](https://developer.apple.com/tutorials/sample-apps/aboutme)

##### 2. Choose Your Own Story

学习重点：

- 用 `Story`、`StoryPage`、`Choice` 建模非线性故事，选择项保存目标页面标识。
- `NavigationStack` 管理导航；`NavigationLink` 把选择映射为下一页。
- 页面 View 接收模型和当前页 id，避免把故事数据散落到 UI。

```swift [Swift]
NavigationStack {
    List(story.start.choices) { choice in
        NavigationLink(choice.text) {
            StoryPageView(story: story, pageID: choice.destination)
        }
    }
    .navigationTitle(story.start.title)
}
```

文档出处：[Choose Your Own Story](https://developer.apple.com/tutorials/sample-apps/chooseyourownstory)

##### 3. Date Planner

学习重点：

- `Event` / `EventTask` 遵循 `Identifiable`，让 `List` / `ForEach` 稳定追踪元素。
- 用计算属性派生“已过期、七天内、已完成”等分组状态，不在 View 内重复业务判断。
- 旧教程使用 `ObservableObject`、`@Published`、`@StateObject`、`@EnvironmentObject` 共享事件数据。
- `List` + `Section` 展示分组数据，`NavigationLink` 进入详情，`swipeActions` 提供行级操作。

```swift [Swift]
List {
    ForEach(store.upcomingEvents) { event in
        NavigationLink(value: event.id) {
            EventRow(event: event)
        }
        .swipeActions {
            Button("Delete", role: .destructive) {
                store.delete(event.id)
            }
        }
    }
}
.navigationDestination(for: Event.ID.self) { id in
    EventDetail(id: id)
}
```

文档出处：[Date Planner](https://developer.apple.com/tutorials/sample-apps/dateplanner)

#### Chapter 2：Presenting Content

##### 1. Organizing with Grids

学习重点：用 `[GridItem]` 描述列布局，以 `LazyVGrid` 延迟创建网格内容；用 `@State` 保存选中颜色，并让选中状态反映到界面。

```swift [Swift]
struct ColorGrid: View {
    private let columns = [GridItem(.adaptive(minimum: 72))]
    @State private var selected: Color?

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns) {
                ForEach(palette, id: \.description) { color in
                    RoundedRectangle(cornerRadius: 12)
                        .fill(color)
                        .frame(height: 72)
                        .overlay {
                            if selected == color { Image(systemName: "checkmark") }
                        }
                        .onTapGesture { selected = color }
                }
            }
        }
    }
}
```

文档出处：[Organizing with Grids](https://developer.apple.com/tutorials/sample-apps/organizingwithgrids)

##### 2. Editing Grids

学习重点：为网格元素提供稳定身份；用 `NavigationStack` 导航到符号详情；用显式编辑状态控制添加、选择和删除操作。

```swift [Swift]
struct Symbol: Identifiable, Hashable {
    let id = UUID()
    var name: String
}

LazyVGrid(columns: columns) {
    ForEach(symbols) { symbol in
        NavigationLink(value: symbol) {
            Image(systemName: symbol.name)
        }
    }
}
```

文档出处：[Editing Grids](https://developer.apple.com/tutorials/sample-apps/editinggrids)

##### 3. Image Gallery

学习重点：

- 数据模型发布图片项目集合，顶层注入后由网格与详情页共享。
- `AsyncImage` 负责异步加载与占位；`ProgressView` 表示等待状态。
- `GeometryReader` 可读取网格单元尺寸，但应局部使用，避免让布局依赖变复杂。
- 图片选择、添加与删除会改变模型，从而自动刷新 `LazyVGrid`。

```swift [Swift]
LazyVGrid(columns: columns) {
    ForEach(items) { item in
        AsyncImage(url: item.url) { image in
            image.resizable().scaledToFill()
        } placeholder: {
            ProgressView()
        }
        .aspectRatio(1, contentMode: .fit)
        .clipShape(.rect(cornerRadius: 10))
    }
}
```

> [!note] 现代实践
> 从系统照片库选择图片时，优先查看 [PhotosPicker](https://developer.apple.com/documentation/photosui/photospicker)，不要直接把网络图片的 `AsyncImage` 模式套到 PhotoKit 资源上。

文档出处：[Image Gallery](https://developer.apple.com/tutorials/sample-apps/imagegallery)

##### 4. Laying Out Views

学习重点：

- 先用 `HStack` / `VStack` / `ZStack` 表达关系，再用 frame、spacing 和 alignment 微调。
- `.frame(maxWidth: .infinity, alignment: ...)` 表示占用可用空间并对齐内容。
- `fixedSize`、layout priority、最小/理想/最大尺寸解决不同内容压缩问题。
- 调试布局时临时加 `.border(...)` 或背景色，观察每层 View 的真实边界。

```swift [Swift]
VStack(alignment: .leading, spacing: 12) {
    Text("Featured").font(.headline)
    Image("feature")
        .resizable()
        .scaledToFill()
        .frame(minHeight: 160, maxHeight: 260)
        .clipped()
}
.frame(maxWidth: .infinity, alignment: .leading)
```

文档出处：[Laying Out Views](https://developer.apple.com/tutorials/sample-apps/layingoutviews)

#### Chapter 3：Retrieving Content from a Server

##### Meme Creator

学习重点：

- 让数据模型遵循 `Decodable`，把服务端 JSON 映射为 Swift 类型。
- `URLSession.shared.data(for:)` 以 `async/await` 获取数据；检查 HTTP 状态后解码。
- 在 View 的 `.task` 中启动与生命周期相关的异步工作。
- `AsyncImage` 处理远程图片阶段；`@FocusState` 管理文本输入焦点。
- 网络错误、空数据与加载状态都应在 UI 中有明确表现。

```swift [Swift]
struct Panda: Decodable, Identifiable {
    let id: Int
    let imageURL: URL
}

func loadPandas(from endpoint: URL) async throws -> [Panda] {
    let (data, response) = try await URLSession.shared.data(from: endpoint)
    guard let http = response as? HTTPURLResponse,
          (200..<300).contains(http.statusCode) else {
        throw URLError(.badServerResponse)
    }
    return try JSONDecoder().decode([Panda].self, from: data)
}
```

文档出处：[Meme Creator](https://developer.apple.com/tutorials/sample-apps/memecreator)

#### Chapter 4：Responding to User Input

##### 1. Bubble Level

学习重点：Core Motion 的 `CMMotionManager` 产生姿态数据；模型把 x/y 倾斜值转换为可观察状态；View 同时以数字与气泡位置表现数据。传感器的开始/停止应与 View 生命周期对应。

```swift [Swift]
Circle()
    .fill(.green)
    .frame(width: 36, height: 36)
    .offset(
        x: motion.roll.clamped(to: -1...1) * 80,
        y: motion.pitch.clamped(to: -1...1) * 80
    )
    .animation(.smooth, value: motion.roll)
    .animation(.smooth, value: motion.pitch)
```

文档出处：[Bubble Level](https://developer.apple.com/tutorials/sample-apps/bubblelevel)

##### 2. Seismometer

学习重点：复用运动检测模型；将振动强度映射为旋转指针与 `Path` 折线；在多个子 View 间共享数据；对采样值进行限制、缩放和格式化。

```swift [Swift]
Path { path in
    guard let first = samples.first else { return }
    path.move(to: first.point(in: size))
    for sample in samples.dropFirst() {
        path.addLine(to: sample.point(in: size))
    }
}
.stroke(.mint, style: StrokeStyle(lineWidth: 2, lineJoin: .round))
```

文档出处：[Seismometer](https://developer.apple.com/tutorials/sample-apps/seismometer)

##### 3. Recognizing Gestures

学习重点：

- 简单交互可用 `onTapGesture`；需要手势值或组合时使用 `TapGesture`、`LongPressGesture`、`DragGesture`、`RotateGesture`。
- `onChanged` 更新进行中的临时状态，`onEnded` 提交最终状态。
- 拖动手势的位置可转化为 `Path` 的点，实现手绘线条。
- 同时识别、顺序识别或互斥识别应根据产品语义选择。

```swift [Swift]
@State private var offset: CGSize = .zero

Circle()
    .offset(offset)
    .gesture(
        DragGesture()
            .onChanged { offset = $0.translation }
            .onEnded { _ in
                withAnimation(.spring) { offset = .zero }
            }
    )
```

文档出处：[Recognizing Gestures](https://developer.apple.com/tutorials/sample-apps/recognizinggestures)

##### 4. Animating Shapes

学习重点：用 `@State` 表示动画前后状态；用 `withAnimation` 触发显式动画，或用 `.animation(_:value:)` 绑定特定值；通过 repeat、delay、speed 组合节奏；自定义 `Shape` / `Animatable` 实现插值动画。

```swift [Swift]
@State private var pulsing = false

Image(systemName: "heart.fill")
    .font(.system(size: 80))
    .foregroundStyle(.pink)
    .scaleEffect(pulsing ? 1.15 : 0.85)
    .animation(
        .easeInOut(duration: 0.7).repeatForever(autoreverses: true),
        value: pulsing
    )
    .onAppear { pulsing = true }
```

文档出处：[Animating Shapes](https://developer.apple.com/tutorials/sample-apps/animatingshapes)

#### Chapter 5：Capturing and Displaying Photos

> [!warning] 权限与设备
> 相机与照片库流程涉及隐私权限、硬件和系统资源。必须配置相应用途说明，并在真机验证授权被拒、受限、切换前后摄像头、进入后台等情况。实现前同时查阅当前版本的 [AVFoundation](https://developer.apple.com/documentation/avfoundation) 与 [PhotoKit](https://developer.apple.com/documentation/photokit) 文档。

##### 1. Previewing the Camera Output

学习重点：相机持续产生视频帧；数据层把帧转换为可显示图像并通过异步序列输出；View 启动相机任务并消费 preview stream；设备切换与资源释放属于相机模型职责。

```swift [Swift]
.task {
    await camera.start()
    for await frame in camera.previewStream {
        previewImage = frame
    }
}
```

文档出处：[Previewing the Camera Output](https://developer.apple.com/tutorials/sample-apps/capturingphotos-camerapreview)

##### 2. Capturing and Saving a Photo

学习重点：快门按钮只发出拍照意图；相机层调用照片输出并接收 delegate 结果；将捕获数据解包成完整图片和缩略图；获得照片库授权后保存。

```swift [Swift]
Button {
    Task { await camera.capturePhoto() }
} label: {
    Image(systemName: "circle.inset.filled")
        .font(.system(size: 72))
}
```

文档出处：[Capturing and Saving a Photo](https://developer.apple.com/tutorials/sample-apps/capturingphotos-captureandsave)

##### 3. Browsing Your Photos

学习重点：使用 PhotoKit 获取 `PHAsset` 集合；缓存缩略图降低滚动成本；`LazyVGrid` 呈现图库；进入 / 离开页面时开始与停止缓存；导航到单图详情后按目标尺寸请求图像。

```swift [Swift]
ScrollView {
    LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 2)], spacing: 2) {
        ForEach(photoAssets) { asset in
            NavigationLink(value: asset.id) {
                PhotoThumbnail(asset: asset)
                    .aspectRatio(1, contentMode: .fill)
            }
        }
    }
}
```

文档出处：[Browsing Your Photos](https://developer.apple.com/tutorials/sample-apps/capturingphotos-browsephotos)

#### Chapter 6：Get Started with Machine Learning

##### 1. Recognizing Gestures with Machine Learning

学习重点：理解“训练数据 → 模型 → 输入特征 → 预测标签”；Vision 的手部姿态请求把相机图像转成关节点；再把关节点转换为模型需要的 `MLMultiArray`，交给 Core ML 分类器预测手势。

```swift [Swift]
let request = VNDetectHumanHandPoseRequest()
let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer)
try handler.perform([request])

guard let observation = request.results?.first else { return }
let points = try observation.keypointsMultiArray()
let prediction = try gestureModel.prediction(poses: points)
```

文档出处：[Recognizing Gestures with Machine Learning](https://developer.apple.com/tutorials/sample-apps/getstartedwithmachinelearning-recognizegestures)

##### 2. Debugging Your Machine Learning Model

学习重点：把 Vision 识别到的关节点覆盖在相机预览上，先确认输入是否正确；用已知手势逐类测试置信度与混淆情况；输入管线有误与模型能力不足要分开排查。

```swift [Swift]
ZStack {
    CameraPreview(image: frame)
    if debugMode {
        HandPoseOverlay(points: recognizedPoints)
            .allowsHitTesting(false)
    }
}
```

文档出处：[Debugging Your Machine Learning Model](https://developer.apple.com/tutorials/sample-apps/getstartedwithmachinelearning-debugmlmodel)

##### 3. Creating Your Own Machine Learning Dataset

学习重点：

- 每个类别应有足够、平衡且有代表性的样本。
- 训练集、验证集、测试集要隔离，避免同一来源的近重复数据泄漏。
- 可用旋转、平移、水平翻转等数据增强覆盖合理变化，但增强不能改变标签语义。
- 采集场景应覆盖不同人物、背景、光照、距离与设备角度。

```swift [Swift]
let augmentations: [ImageAugmentation] = [
    .rotate(maxDegrees: 10),
    .translate(maxFraction: 0.08),
    .horizontalFlip
]
```

> [!note]
> 上面的 `ImageAugmentation` 是用于记忆数据增强思路的示意类型，不是 Swift 标准库 API；实际训练请使用 Create ML 或当前训练工具提供的增强选项。

文档出处：[Creating Your Own Machine Learning Dataset](https://developer.apple.com/tutorials/sample-apps/getstartedwithmachinelearning-createmldataset)

---

### 三、旧教程迁移速查

| 在旧教程中看到                    | 新项目优先考虑                             | 说明                                     |
| --------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `NavigationView`                  | `NavigationStack` / `NavigationSplitView`  | 分别用于栈式导航与多栏导航               |
| `NavigationLink(destination:)`    | value + `navigationDestination(for:)`      | 导航状态更容易集中管理和深链恢复         |
| `PreviewProvider`                 | `#Preview`                                 | Xcode 15+ 的预览宏，写法更短             |
| `foregroundColor(...)`            | `foregroundStyle(...)`                     | 可表达层级样式、渐变和材质等             |
| `ObservableObject` + `@Published` | iOS 17+ 可考虑 `@Observable`               | 采用哪套观察机制取决于部署版本与架构     |
| `@EnvironmentObject`              | Observation 可用 `@Environment(Type.self)` | 使用前仍必须由祖先注入，否则运行时会失败 |
| 自定义照片选择器封装              | `PhotosPicker`                             | 先检查 PhotosUI 的当前能力与部署版本     |

### 四、一分钟自检清单

- [ ] 我能解释 `App → Scene → View` 各自负责什么。
- [ ] 我会先用语义字体、系统控件和自适应容器，再考虑固定尺寸。
- [ ] 我知道 modifier 顺序为什么会改变布局结果。
- [ ] 我能根据“是否保留空间”选择 `if`、`opacity` 或 `hidden`。
- [ ] 我能区分 `@State` 的所有权与 `@Binding` 的可写引用。
- [ ] 我的 `ForEach` / `List` 元素有稳定且唯一的 identity。
- [ ] 我不会在 `body` 中做阻塞网络或图像处理；异步工作有 loading / error / empty 状态。
- [ ] 传感器、相机和照片任务会随生命周期启动并停止，也处理权限失败。
- [ ] 动画绑定到明确的 value，不会让无关状态变化意外触发动画。
- [ ] 机器学习问题会先检查输入和可视化结果，再归因于模型。

### 五、继续深入

- [SwiftUI 官方 API 文档](https://developer.apple.com/documentation/swiftui)
- [Develop in Swift Tutorials（当前推荐教程）](https://developer.apple.com/tutorials/develop-in-swift/)
- [SwiftUI App organization](https://developer.apple.com/documentation/swiftui/app-organization)
- [SwiftUI Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [SwiftUI View fundamentals](https://developer.apple.com/documentation/swiftui/view-fundamentals)
- [SwiftUI Layout fundamentals](https://developer.apple.com/documentation/swiftui/layout-fundamentals)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
