---
title: 使用 Docker 运行 MySQL
date: 2024-05-27 12:21:50
tags: dorker mysql
categories: dorker mysql
top_img:
cover: https://s2.loli.net/2024/05/27/I7ePHQvBJNWf3Ug.jpg
---

## *使用 Docker* +Mysql

使用`Docker`来运行`MySQL`。这样在 Windows 与 macOS 上，甚至在 Linux 服务器上，它们的运行环境都是一致的。

1.进入`Docker`官网后，https://www.docker.com/get-started/，直接下载安装。

2.配置中国镜像

```
"registry-mirrors": [
  "https://xelrug2w.mirror.aliyuncs.com"
]
```



![demo](使用-Docker-运行-MySQL/demo.png)

3.*使用 docker compose*

​	接着进入项目根目录中，新建一个文件，叫做`docker-compose.yml`。千万要注意，一定要在项目根目录中，放在其他地方会找不到的。然后将下面的配置复制进去，这就是`MySQL`的一个简单配置了。

```
services:
  mysql:
    image: mysql:8.3.0
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
    environment:
      - MYSQL_ROOT_PASSWORD=clwy1234
      - MYSQL_LOWER_CASE_TABLE_NAMES=0
    ports:
      - "3306:3306"
    volumes:
      - ./data/mysql:/var/lib/mysql

```

然后我们开启另一个命令行窗口，一定要确保命令行所在路径，是在当前项目里的。如果不在当前项目里，就自己先通过`cd`命令进入项目，然后再运行。

```
docker-compose up -d
```

这样，`MySQL`就会自动下载好，并启动起来了。
