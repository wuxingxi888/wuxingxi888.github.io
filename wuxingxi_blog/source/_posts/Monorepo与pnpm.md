---
title: Monorepo与pnpm
date: 2023-08-13 08:59:45
tags: pnpm Monorepo engineering tooling 工程化
categories: 工程化
top_img:
cover: https://s2.loli.net/2024/09/11/Af2v9R8nbDp6G7z.jpg
---

## 一、什么是[pnpm](https://zhida.zhihu.com/search?q=pnpm&zhida_source=entity&is_preview=1)

pnpm又称 performant npm，翻译过来就是高性能的npm。

## 1.节省磁盘空间提高安装效率

pnpm通过使用**硬链接**和**符号链接**（又称[软链接](https://zhida.zhihu.com/search?q=软链接&zhida_source=entity&is_preview=1)）的方式来避免重复安装以及提高安装效率。 **[硬链接](https://zhida.zhihu.com/search?q=硬链接&zhida_source=entity&is_preview=1)**：和原文件共用一个磁盘地址，相当于别名的作用，如果更改其中一个内容，另一个也会跟着改变 **符号链接（软链接）**：是一个新的文件，指向原文件路径地址，类似于快捷方式 官网原话：

> 当使用 npm 时，如果你有 100 个项目，并且所有项目都有一个相同的[依赖包](https://zhida.zhihu.com/search?q=依赖包&zhida_source=entity&is_preview=1)，那么，你在硬盘上就需要保存 100 份该相同依赖包的副本。然而，如果是使用 pnpm，依赖包将被存放在一个统一的位置，因此： 1.如果你对同一依赖包需要使用不同的版本，则仅有 版本之间不同的文件会被存储起来。例如，如果某个依赖包包含 100 个文件，其发布了一个新 版本，并且新版本中只有一个文件有修改，则pnpm update 只需要添加一个新文件到存储中，而不会因为一个文件的修改而保存依赖包的所有文件。 2.所有文件都保存在硬盘上的统一的位置。当安装[软件包](https://zhida.zhihu.com/search?q=软件包&zhida_source=entity&is_preview=1)时，其包含的所有文件都会硬链接自此位置，而不会占用额外的硬盘空间。这让你可以在项目之间方便地共享相同版本的依赖包。 最终结果就是以项目和依赖包的比例来看，你节省了大量的硬盘空间，并且安装速度也大大提高了！

## 2.创建非扁平的node_modules目录结构



![img](https://pic2.zhimg.com/80/v2-62826b8e02448ccb75dac3fda8b545b3_720w.webp)



## 3.Monorepo 简介及其与包[管理工具](https://zhida.zhihu.com/search?q=管理工具&zhida_source=entity&is_preview=1)（npm、yarn、pnpm）之间的关系

## Monorepo模式：

**Monorepo** 是一种项目开发与管理的[策略模式](https://zhida.zhihu.com/search?q=策略模式&zhida_source=entity&is_preview=1)，它代表"[单一代码仓库](https://zhida.zhihu.com/search?q=单一代码仓库&zhida_source=entity&is_preview=1)"（Monolithic Repository）。在 **Monorepo** 模式中，所有相关的项目和组件都被存储在一个统一的代码仓库中，而不是分散在多个独立的代码仓库中，这些项目之间还可能会有依赖关系。

## 包管理工具：

**npm、yarn、pnpm** 等是用来管理项目依赖、发布包、安装依赖的工具，它们都提供了对工作区（workspace）的支持，允许在单个代码库中管理多个项目或包。这种工作区支持在单个代码库中同时开发、测试和管理多个相关的项目，而无需使用多个独立的代码仓库。

## 关系：

这些包管理工具与 monorepo 的关系在于它们可以为 monorepo 提供依赖安装与依赖管理的支持，借助自身对 workspace 的支持，允许在 monorepo 中的不同子项目之间共享依赖项，并提供一种管理这些[共享依赖项](https://zhida.zhihu.com/search?q=共享依赖项&zhida_source=entity&is_preview=1)的方式，这可以简化依赖项管理和构建过程，并提高开发效率。

## 4.Monorepo （单仓多模块）开发模式

- [回归单体管理](https://zhida.zhihu.com/search?q=回归单体管理&zhida_source=entity&is_preview=1)：Monorepo 是一种试图回归单体管理优势的方法，但保留了多仓库开发的某些优点。它允许在一个代码库中管理多个项目、组件或服务，提供更好的[代码共享](https://zhida.zhihu.com/search?q=代码共享&zhida_source=entity&is_preview=1)和重用性。
- 现代工具支持：现代的版本控制系统和工具链使得 Monorepo 开发模式更为可行，例如像 Pnpm、Yarn 、Lerna 和 Turborepo 等工具，它们提供了更好的管理、构建和部署多个项目的能力。
- 优点： 保留 [multirepo](https://zhida.zhihu.com/search?q=multirepo&zhida_source=entity&is_preview=1) 的主要优势 代码复用 模块独立管理 分工明确，业务场景独立 代码耦合度降低 管理所有项目的版本控制更加容易和一致，降低了不同项目之间的版本冲突。 可以统一项目的构建和部署流程，降低了配置和维护多个项目所需的工作量。
- 缺点： Monorepo 可能随着时间推移变得庞大和复杂，导致构建时间增长和管理困难，[git clone](https://zhida.zhihu.com/search?q=git+clone&zhida_source=entity&is_preview=1)、pull 的成本增加。 权限管理问题：项目粒度的权限管理较为困难，容易产生非owner管理者的改动风险。

## 5.如何解决monorepo无法进行细粒度权限管理的缺点

**1. 使用[代码所有权文件](https://zhida.zhihu.com/search?q=代码所有权文件&zhida_source=entity&is_preview=1)** 使用如 CODEOWNERS 文件（GitHub 等平台支持）来指定某个目录或文件的所有者。当这些文件或目录被修改时，只有指定的所有者才能批准更改。这种方法能够实现对项目或模块级别的权限粒度控制。
**2. 利用[CI/CD流程](https://zhida.zhihu.com/search?q=CI%2FCD流程&zhida_source=entity&is_preview=1)** 在持续集成/持续部署（CI/CD）流程中设置权限和访问控制。例如，可以配置流程，只允许具有特定权限的用户触发构建或部署到生产环境。这种方式可以在流程层面上控制谁可以对代码库进行重要操作。
**3. 分支策略** 通过严格的分支管理策略，如Git Flow，控制不同级别的开发人员可以访问和修改的分支。比如只允许项目负责人合并代码到主分支，而其他开发人员只能在特定的功能分支上工作。
**4. 使用Git钩子** 配置Git钩子（Hooks），在代码提交或合并前执行脚本来检查提交者的权限。例如，可以设定pre-commit钩子，确保提交的代码符合访问权限要求。
**5. 利用子模块** 虽然这种做法在传统Monorepo中较少使用，但通过Git子模块（submodules）可以实现对特定部分的仓库独立控制，从而在需要时提供更细粒度的权限管理。
**6. 第三方工具和扩展** 考虑使用一些第三方工具和扩展来管理权限。例如，GitLab和Bitbucket等平台提供了更细粒度的权限控制设置，允许在项目或组织级别进行详细的访问控制。

## 6.为什么[组件库](https://zhida.zhihu.com/search?q=组件库&zhida_source=entity&is_preview=1)项目会选用 Monorepo 模式

对于组件库项目，很自然的会涉及到划分以下模块

- components 包，作为组件库的主要代码，实现各个 UI 组件的核心逻辑。
- shared 包，主要存放各种杂七杂八的工具方法。
- theme 包，实现组件库的主题样式定制方案。
- [cli](https://zhida.zhihu.com/search?q=cli&zhida_source=entity&is_preview=1) 包，实现组件库模板脚手架的命令行工具。
- docs 包，组件库的示例 demo 与使用文档。
- playground 包，组件库的在线编辑、演示应用。

[细化拆分](https://zhida.zhihu.com/search?q=细化拆分&zhida_source=entity&is_preview=1)不同模块的好处非常明显，一句话总结就是：模块划分的越清晰，复用时的灵活性、可操作性就越强，每个独立模块产物的体积也会越轻量。
