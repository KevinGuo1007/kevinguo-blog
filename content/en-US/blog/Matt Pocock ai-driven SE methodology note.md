---
title: Matt Pocock AI 驱动的软件工程方法论笔记
description: 整理 Matt Pocock 的 AI Agent 软件工程方法论、常用 Skills、仓库初始化方式与相关概念
slug: matt-pocock-ai-driven-software-engineering
translationKey: matt-pocock-ai-driven-software-engineering
date: 2026-09-15
updated: 2026-09-23
tags:
  - ai
  - software-engineering
  - methodology
featured: false
draft: false
---

**software engineering with using ai agent**
**软件工程基本功在 AI 时代比以往任何时候都更重要。**

生词：

- rigid 严格的
- heuristic 启发式
- agnostic 不可知论的
- agnosticism 不可知论
- weird constraints
- critical flaw 重大缺陷
- ubiquitous language 通用语言

<!-- ![Pasted image 20260915142700](/images/blog/matt-pocock-ai-driven-se/pasted-image-20260915142700.png) -->

**安装配置**

```shell
npx skills@latest add mattpocock/skills
```

常用 skill 选择：

- `/setup-matt-pocock-skills` 项目初始化工具。为当前仓库配置 Issue Tracker、工单标签以及 `CONTEXT.md`、ADR 等领域文档的存放方式
- `/ask-matt` Skill 导航器。你描述当前处境，它帮你判断应该使用哪个 Skill 或哪套工作流
- `/grill-with-docs` 有可写的工作目录/仓库，一边“拷问”需求，一边沉淀文档
- `/grill-me` 没有工作目录，只是在聊天中梳理想法
- `/grilling` 通用的深度访谈引擎
- `/domain-modeling` 建立和打磨项目的领域模型。它会统一术语、用极端场景检验概念，并把结果写入 `CONTEXT.md` 和 ADR，减少人和 Agent 对业务语言的误解。
- `/to-spec` 把当前已经讨论清楚的内容整理为正式规格说明，并发布到项目的 Issue Tracker
- `/to-tickets` 把规格、计划或对话拆成可执行工单。工单采用“示踪弹”思路：尽量形成小而完整的纵向功能切片，并明确任务之间的阻塞关系
- `/implement` 实施阶段的总指挥。根据 Spec 或 Tickets 开发功能，在预先约定的接口和边界使用 TDD，最后调用代码审查流程，并在确认后提交代码
- `/tdd` 执行测试驱动开发：先写会失败的测试，再写最少代码使其通过，最后重构
- `/codebase-design` 提供代码架构设计的共同语言。核心是设计“深模块”：用较小、稳定的接口隐藏较多复杂行为，同时把模块放在清晰、容易测试的系统边界上
- `/code-review` 从某个 Git 基准点审查代码改动，分成两个独立视角：
  Standards：是否符合项目规范，是否存在典型代码坏味道。
  Spec：是否真正实现了原始需求或工单。
  仓库设计中，这两个检查由并行子 Agent 分别完成，避免互相影响判断。
- `/diagnosing-bugs` 面向疑难 Bug 和性能退化的纪律化诊断流程：先建立稳定复现 → 缩小问题 → 提出假设 → 添加观测或埋点 → 修复 → 增加回归测试
- `/improve-codebase-architecture` 扫描整个代码库，寻找可以把模块“做深”、减少复杂度泄漏的架构改进机会
- `/handoff` 把当前长对话压缩成一份交接文档，记录目标、现状、重要决定、已完成工作和下一步，让另一个 Agent 或新会话可以快速接手
- `/prototype` 为回答设计问题而制作一次性原型

**仓库初始化**

```shell
/setup-matt-pocock-skills
```

作用：

- 这个项目在哪里管理需求和 tickets？
- 项目使用什么 triage 状态语言？
- Agent 应该从哪里读取领域知识和架构决策？

产物：

```text
project/
├── AGENTS.md 或 CLAUDE.md
├── CONTEXT.md                       按需创建
├── docs/
│   ├── agents/
│   │   ├── issue-tracker.md
│   │   ├── domain.md
│   │   └── triage-labels.md         安装 triage 时才有
│   └── adr/
│       └── 0001-\*.md                有重要决策时才创建
└── src/
```

其中：

- docs/agents/issue-tracker.md 是“工作发布到哪里”的操作约定。
- docs/agents/domain.md 是 Agent 阅读领域文档的规则。
- docs/agents/triage-labels.md 是通用状态和实际 tracker 标签之间的映射。
- CONTEXT.md 是领域词汇表。
- docs/adr/ 保存少量重要、难以逆转的决策。

配置内容：

**Issue Tracker**

决定 spec 和 ticket 保存在哪里：

- GitHub Issues
- GitLab Issues
- 本地 Markdown：.scratch/\<feature\>/
- Linear、Jira 或其他自定义工作流

[软件基本功没死，它在 AI 时代变得更值钱了 - 陆三金的文章 - 知乎](https://zhuanlan.zhihu.com/p/2032512098626954988)
