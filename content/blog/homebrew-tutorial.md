---
title: '教程｜macOS 下超好用的包管理工具 homebrew'
description: '一篇LaTex的vscode环境配置指南'
slug: homebrew-tutorial
date: "2025-10-18"
tags: ['macos', 'tutorial', 'tool']
featured: false
draft: false
---


我们在安装软件的时候都会遇到不少很让人头疼的问题，软件资源难找、软件安装过程繁琐、安装后的环境配置麻烦、卸载操作不便，尤其是macOS下的很多软件难以在 App store 当中找到，此外作为一名合格的程序员，大部份人都很不喜欢 click click 地来进行操作，因此我们就需要一个包管理器来帮助我们进行软件包的安装、配置、卸载和升级，只需要通过简单的命令即可完成对软件的一系列操作。

homebrew是一个免费开源的软件包管理工具，主要在Apple的操作系统macOS和Linux上进行使用，该软件最初是由Max Howell编写完成的，而后homebrew在 [Ruby on Rails](https://en.wikipedia.org/wiki/Ruby_on_Rails) 社区中因其优秀的拓展性收到了极大的欢迎和赞誉。在homebrew中其用啤酒为主题对其feature来进行命名，例如安装的软件的不同版本会对应一个 kegs(酒桶) 、第三方的软件包仓库称之为 taps(啤酒龙头) 、二进制软件包称之为bottles(瓶子)。homebrew被大家所推荐的主要原因就是它的易用性，以及它的 CLI(Command Line Interface) 的集成性。homebrew是一个开源组织的成员，其完全由开源组织的志愿者运营。

![](https://raw.githubusercontent.com/KevinGuo1007/kevinguoinkimg/main/img/20251018141937741.png)

## 安装 homebrew

1. 打开命令行输入以下命令：

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. 验证 brew 成功安装：

   ```bash
   $ brew -v
   Homebrew 4.6.17
   ```

## 使用方法

具体的 brew 使用方法推荐去阅读官方的 [manpage](https://docs.brew.sh/Manpage) 来进行学习，以下只列举部分常用的使用方法：

1. 安装 package：

   ```bash
   brew install <formula>
   brew install --cask <formula>
   ```

   其中 `<formula>` 为从上游源码构建并安装一个软件包的“配方”(package definition)，`formula` 通常是一个 Ruby 脚本，包含源代码 URL、依赖、构建步骤、安装步骤与测试等。`brew install`默认安装的是 CLI 软件，若需要安装 GUI 软件请加上后缀 `--cask`。

2. 删除 package：

   ```bash
   brew uninstall <formula>
   ```

   卸载 formula 仅移除当前被 unlink 的版本，旧版本残留在 Cellar，运行以下命令来清理旧版本：

   ```bash
   brew cleanup
   ```

3. 查看当前已安装 package：

   ```bash
   brew list
   brew list --formula		# 仅列出 formula
   brew list --cask		# 仅列出 cask
   brew list --version		# 查看已安装每个包的版本
   ```

4. 搜索 package

   ```bash
   # 搜索 formula 或 cask 的 package
   brew search <text> # 传入text按子串搜索，用/包裹text则按正则表达式搜索
   ```

   

---

## 相关连接：

1. [Homebrew](https://brew.sh/zh-cn/)
2. [Homebrew Manpage](https://docs.brew.sh/Manpage)