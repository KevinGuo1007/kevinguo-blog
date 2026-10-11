---
title: Git复习笔记
description: 快速复习常用的Git相关命令
slug: git-review-notes
date: "2026-07-13"
updated: 2026-09-23
tags:
  - git
  - notes
  - methodology
featured: false
draft: false
---

## branch 分支

### 查看分支

```bash
# 查看当前所有本地分支
git branch

# 查看每个分支最后一次提交
git branch -v

# 查看当前所有分支，含远程
git branch -a

# 查看哪些分支已经合并到当前分支
git branch --merged

# 查看当前未合并的分支
git branch --no-merged
```

### 暂存与提交

```bash
# 将指定文件的修改加入暂存区
git add <file>

# 将当前目录下所有修改加入暂存区，包括新增、修改、删除
git add .

# 提交暂存区中的修改，并写入提交信息
git commit -m "message"

# 修改最近一次提交。常用于补文件、改提交信息
## 注意：会改写最近一次 commit
git commit --amend

# 直接修改最近一次提交的提交信息
git commit --amend -m "new-message"
```

### 创建切换分支

```bash
# 创建新分支，不切换
git branch <name>

# 创建新分支，切换
git switch -c <name>

# 切换到指定分支
git switch <name>
```

> "Git 2.23 brings a new pair of experimental commands to the suite of existing ones: `git switch`and `git restore`. These two are meant to eventually provide a better interface for the well-known `git checkout`. The new commands intend to each have a clear separation, neatly divvying up what the many responsibilities of `git checkout`."

### 合并分支

```bash
# 将指定<name>分支合并到当前分支
## 当前分支没有新提交，可以直接把指针“快进”过去，不产生额外合并提交，历史是线性的，看不出曾经存在过 feature 分支。
git merge <name>

## 当两个分支都有新提交时，Git 会找到共同祖先，进行一次三方合并，并自动生成一个合并提交。会完整保留分支历史。
git merge <name>

# 将指定<name>分支合并到当前分支，保留分支历史。
git merge --no-ff <branch>
## 可替换 --ff-only，merge 默认状态为fast-forward

# 将当前分支 变基 到<name>分支上
## 把当前分支的提交“搬”到目标分支的最新提交之后，使历史变成一条直线，没有分叉，也不会产生合并提交。
git rebase <name>

# 将<name2>分支 变基 到<name1>分支上
git rebase <name1> <name2>

# 把 feature 分支上独有提交移植到 master（跳过 develop，feature 是从 develop 分支上开出的分支）
git rebase --onto master develop feature

```

::note
[**fast-forward 快速合并**]{.mb-2 .block}

当 **当前分支的顶端** 是 **目标分支** 的直接祖先（即目标分支完全领先，没有分叉）时，Git 默认只需把当前分支的指针向前移动，就能包含目标分支的所有提交。这种操作**不会产生新的合并提交**，历史保持线性，这就是快进合并。
::

### 远程仓库操作

```bash
# 查看当前仓库配置的远程地址
git remote -v

# 从远程仓库拉取最新分支和提交信息，但不自动合并到当前分支
git fetch

# 拉取远程更新，并合并到当前分支。相当于 fetch + merge
git pull

# 拉取远程更新，并把本地提交 变基 到远程最新提交之后，保持历史更线性
git pull --rebase

# 将当前分支的本地提交推送到远程对应分支
git push

# 第一次推送新分支，并设置上游分支
git push -u origin <branch>

# 将本地分支推送到远程
git push origin <branch>
```

### 删除分支

```bash
# 安全删除<name>分支
## 会先检查该分支是否已完全合并到其上游分支（若未设置上游则检查 `HEAD`），若未合并则拒绝删除，以避免丢失未合并的改动。
git branch -d <name>

# 强制删除<name>分支
git branch -D <name>

```

### 重命名分支

```bash
# 重命名当前分支
git branch -m <new-name>

# 重命名指定分支
git branch -m <old-name> <new-name>

```

## 怎么正确 git commit

| 类型       | 建议含义                           | 示例                                            |
| ---------- | ---------------------------------- | ----------------------------------------------- |
| `feat`     | 增加用户或业务能够感知的新功能     | `feat(tarot): add reversed card option`         |
| `fix`      | 修复程序错误                       | `fix(auth): handle expired access token`        |
| `refactor` | 重构代码，但不增加功能也不修复 bug | `refactor(paipan): extract calculation service` |
| `docs`     | 只修改文档                         | `docs(readme): add deployment instructions`     |
| `style`    | 只修改代码格式，不改变程序行为     | `style: format backend source files`            |
| `test`     | 新增或修改测试                     | `test(auth): add login failure cases`           |
| `chore`    | 日常杂项、项目维护                 | `chore: update gitignore rules`                 |
| `perf`     | 性能优化                           | `perf(cases): cache case search results`        |
| `ci`       | CI/CD 配置改动                     | `ci: test all submodules in GitHub Actions`     |
| `build`    | 构建工具或依赖改动                 | `build(frontend): upgrade vite dependency`      |
| `revert`   | 撤销之前的提交                     | `revert: remove tarot animation changes`        |

Conventional Commits 规定，如果修改导致旧接口、旧配置或旧调用方式不能继续使用，可以在类型或 scope 后添加 `!`：

```text
feat(api)!: replace token login endpoint
```

参考：

- [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

---

## 补充

### Detached

::note
[**正常状态 vs. Detached HEAD**]{.mb-2 .block}


- **正常状态**：HEAD 指向分支（如 `main`），分支再指向某个 commit。  
  此时你做的提交会沿着分支向前移动。
- **Detached HEAD**：HEAD 直接指向某个历史 commit，没有任何分支“保护”它。  
  你可以在这个点查看代码、做实验性提交，但 Git 不会帮你记住这些提交属于哪个分支。
::
