---
title: CentOS 6.10部署vue项目
date: 2020-08-17 12:07:31
tags: centos vue
categories: centos vue
top_img:
cover: "![centos](CentOS-6-10部署vue项目/centos.jpeg)"
---

#### 打包 上传

```
1. 在本地使用以下命令，打包
npm run build 
2. 打包之后本地会出现dist文件夹。将dist文件夹以及package.json 文件上传到centos服务器上，此处随便什么位置，新建个文件夹就能放。
```

#### 增加app.js文件

```
//定义目录
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
//vue目录
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
//定义启动的端口号
app.listen(8080);
```

#### 安装模块

```
#安装依赖包,如果系统中没有安装node，npm命令会找不到
npm install 
#启动vue项目（pm2命令也需要单独安装，安装之后再执行下面命令）
pm2 start app.js
```
