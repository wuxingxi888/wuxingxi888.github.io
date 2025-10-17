---
title: Mac电脑安装nvm(node包版本管理工具)
date: 2024-08-20 08:28:47
tags: nvm nodeJs engineering tooling 工程化
categories: 工程化
top_img:
cover: https://s2.loli.net/2024/09/26/aI7nC6Ke8mcbSp3.jpg
---

## 方法一：通过Homebrew安装（推荐）

1. ### 安装 Homebrew： 如果您还没有安装Homebrew，首先需要安装它。打开终端（Terminal.app）并运行以下命令：（官网地址：https://brew.sh/zh-cn/）

  ```shell
  1.官网提供的链接（没有vpn的话执行不成功）
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  2.国内下载地址
  /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
  ```

​	按照步骤安装完成就可以了.

2. #### 使用Homebrew安装 NVM： 安装完 Homebrew 后，接着使用以下命令来安装 NVM：

  打开终端zsh，执行：

  ```shell
  brew install nvm  # 执行完成就代表nvm已经安装了，但是还需要配置环境变量
  ```

3. #### 配置环境变量：

  Homebrew 在安装 NVM 时通常会自动处理环境变量的设置，但为了确保 NVM 可以在新的 shell 会话中正常使用，您可能需要手动添加 NVM 的初始化脚本到您的 shell 配置文件中。对于大多数现代 Mac 系统使用的 zsh，编辑或创建 ~/.zshrc 文件。

#### 配置 NVM 的环境变量通常涉及以下步骤：

1. 先使用Homebrew检查nvm的安装位置：

```shell
brew list nvm
```

我这里显示

```shell
ys@bogon ~ % brew list nvm

/opt/homebrew/Cellar/nvm/0.39.7/etc/bash_completion.d/nvm

/opt/homebrew/Cellar/nvm/0.39.7/libexec/ (2 files)

/opt/homebrew/Cellar/nvm/0.39.7/nvm-exec

/opt/homebrew/Cellar/nvm/0.39.7/nvm.sh
```



2. 打开或创建 shell 配置文件： 对于 macOS Mojave 及以后版本（使用 zsh 作为默认 shell）的用户，您需要编辑或创建 ~/.zshrc 文件
如果文件不存在的话，则需要先创建（文件存在的话就可以忽略这一步）：

```shell
touch ~/.zshrc
```


如果文件已经存在，则输入命令进行编辑：

打开或创建 shell 配置文件： 对于 macOS Mojave 及以后版本（使用 zsh 作为默认 shell）的用户，您需要编辑或创建 ~/.zshrc 文件
如果文件不存在的话，则需要先创建（文件存在的话就可以忽略这一步）：
touch ~/.zshrc

如果文件已经存在，则输入命令进行编辑：

```shell
nano ~/.zshrc
```

3. 添加如下内容到文件末尾以加载 NVM：

```shell
export NVM_DIR="$HOME/.nvm" 
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh" 
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

注意：这里的路径可能需要根据您实际的 Homebrew 安装位置进行调整，确保指向正确的 nvm.sh 和 bash_completion.d/nvm 文件。


4. 保存并关闭文件：
我这里使用的是 nano 编辑器，所以：

- 按 Ctrl+O 来保存（“O” 代表 “Write Out”)。
- 按回车键确认当前文件名和路径。
- 按 Ctrl+X 来退出（“X” 代表 “eXit”)。
- 重新加载 ~/.zshrc 文件来应用更改：

```shell
source ~/.zshrc
```


执行完这一句不报错，说明已经配置成功。



5. 检查 NVM 是否已经成功加载

```shell
ys@bogon ~ % command -v nvm

nvm

ys@bogon ~ % nvm -v

0.39.7
```

证明已经安装成功且环境变量也已经配置成功了。

6. nvm使用：
    此时还没有使用过nvm安装过node,所以打出 nvm list时,显示：

```shell
ys@bogon ~ % nvm list

-> system

iojs -> N/A (default)

node -> stable (-> N/A) (default)

unstable -> N/A (default)
```

  


使用 nvm install node 安装最新版本的node，安装完成后，显示：


说明已经成功使用 NVM 安装了 Node.js v21.7.1 版本。根据 nvm list 的输出结果：

现在默认版本 (-> v21.7.1) 已经设置为最新安装的 Node.js v21.7.1。
您还可以看到其他可用的 LTS（长期支持）版本，但它们当前并未安装。
此外，系统级别的 Node.js 仍然存在，并且被标记为 system。





## 方法二：手动从 GitHub 克隆安装

1. 打开终端并克隆 NVM Git 仓库：

  ```shell
  git clone https://github.com/nvm-sh/nvm.git ~/.nvm
  ```


2. 进入 NVM 目录并运行安装脚本：

  ```shell
  cd ~/.nvm
  ./install.sh
  ```


3. 接下来的步骤与通过 Homebrew 安装类似，即需要配置环境变量并在新的 shell 会话中激活 NVM。
无论哪种方法安装完成后，都可以使用 nvm 命令来安装、切换不同的 Node.js 版本。例如，要设置一个特定版本为默认版本：

  ```shell
  nvm alias default <version>
  ```

其中 <version> 是您想要设为默认的 Node.js 版本号。

### 使用nvm控制node版本的常用命令

1. 安装指定版本的 Node.js：

```shell
nvm install <version> # 安装特定版本，例如 nvm install v14.17.0
```

2. 列出所有可安装的 Node.js 版本

```shell
nvm ls-remote # 列出远程服务器上的所有可用版本
```

3. 列出已安装的 Node.js 版本：

```shell
nvm list # 显示已安装的 Node.js 版本和当前使用的版本
```


4 .切换到已安装的某个版本：

```shell
nvm use <version> # 切换到指定版本，例如 nvm use v12.22.11
```


5. 设置默认版本：

```shell
nvm alias default <version> # 设置默认启动的 Node.js 版本
```


6. 卸载指定版本的 Node.js：

```shell
nvm uninstall <version> # 卸载特定版本
```


7. 查看当前正在使用的 Node.js 版本：

```shell
nvm current # 显示当前激活的 Node.js 版本
```


8. 检查 Node.js 的版本信息：

```shell
node -v # 在已通过nvm切换版本后，直接使用node命令查看当前版本
```



9. 管理 LTS 版本：

```shell
nvm install --lts # 安装最新长期支持版（LTS）
nvm install lts/argon # 安装特定 LTS 系列（如argon为旧版LTS代号）
```

