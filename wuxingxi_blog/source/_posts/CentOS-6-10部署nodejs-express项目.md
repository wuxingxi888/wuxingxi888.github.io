---
title: CentOS 6.10部署nodejs express项目
date: 2020-08-20 12:04:47
tags: centos express
categories: centos express
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/centos.jpeg"
---



#### CentOS：

 最近用 node写的服务端基本完工，公司让我部署到线上 ….. 对于没有玩过Linux的我 ，真的是一脸懵逼 无从下手，但是难不到有心人的。办法总比困难多 ，话不多说 开整…..

1. 服务器系统版本：centos 6.10
2. window系统可用xshell工具登陆root用户 ，mac系统可用过命令ssh root@服务器ip 登陆 （本人用的finalshell 还是比较好用 哈哈）

#### 安装nodejs nom/cnpm

##### 方式一：

```
yum install -y nodejs  //安装nodejs
npm install -g cnpm --registry=https://registry.npm.taobao.org //安装cnpm 淘宝镜像
cnpm install -g n 
n stable // 更新node版本 （慢的一批 不推荐）
```

方式二：

```
wget https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-x64.tar.xz //下载node安装包 具体版本官网找连接替换
tar xvf node-v6.9.5-linux-x64.tar.xz //解压node压缩包文件

创建软链接，就可以在任意目录下使用node和npm命令
ln -s /root/node-v6.9.5-linux-x64/bin/node /usr/local/bin/node
ln -s /root/node-v6.9.5-linux-x64/bin/npm /usr/local/bin/npm

查看node  npm版本
node -v
npm -v

至此，Node.js环境已安装完毕。软件默认安装在/root/node-v6.9.5-linux-x64/目录下。
```

#### 安装mysql

1. 卸载mysql （大多数centos 6 都自带mysql5.1）

2. 查看mysql 命令 rpm -qa|grep mysql

   ```
   [root@lxxxx ~]# rpm -qa|grep mysql
   mysql-libs-5.1.73-7.el6.i686
   ```

3. 卸载mysql 命令 rpm -e –nodeps xxxx 如：

   ```
   rpm -e --nodeps mysql-libs
   ```

4. 下载自己需要的mysql 版本

   ```
   wget -c  http://dev.mysql.com/get/mysql57-community-release-el6-10.noarch.rpm
   yum localinstall mysql57-community-release-el6-10.noarch.rpm //安装rpm包
   
   yum repolist enabled |grep mysql //查看可用的安装包
   yum install gcc* //安装前装gcc所有包，防止报错
   
   service mysqld start //启动mysql
   service mysqld status //查看状态
   chkconfig mysqld on // 加入开机启动
   service mysqld restart //重启数据库
   grep 'temporary password' /var/log/mysqld.log //查看初始密码 root@localhost：xxxxxx 
   mysql -u root -p  //输入查询到的密码 进入数据库
   alter user 'root'@'localhost' identified by '123456'; //修改root账号的密码为123456
   flush privileges;// 刷新权限
   
   修改密码复杂度权限：
   set global validate_password_policy=0; //修改validate_password_policy参数的值
   set global validate_password_length=1; //validate_password_length(密码长度)参数默认为8，我们修改为1
   
    授权远程访问（navicat）：
   grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option; 
   ```

#### 安装nginx

1. 安装

   ```
   yum install -y nginx //安装
   service nginx start //启动
   service nginx stop //停止
   nginx -s stop //快速停止nginx。
   service nginx restart  //重启
   bainginx -s reload  //修改配置后 重新加载生效。
   nginx -s reopen //重新打开日志文件。
   nginx -t -c /path/to/nginx.conf //测试nginx配置文件是否正确。
   ```

2. 配置nginx

   ```
   Nginx配置文件(/etc/nginx/nginx.conf)
   
   upstream app_nodejs {
   		server 127.0.0.1:3000
   	}
   	
   server{
   	listen 80 default; //监听端口
   	server_name www.xxx.com ;//访问的域名
   	if ($host ~ "\d+\.\d+\.\d+\.\d") {  #如果访问的是ip，则直接返回404，此处只允许通过域名访问
       			return 404;
   		}
   	location / {
   	proxy_pass http://app_nodejs;
   	}
   }
   ```

#### 安装pm2

```
npm install -g pm2 //安装pm2
```

安装完成执行命令：pm2 list 会出现：-bash: pm2: command not found 说明没有配制到全局 所以我们需要创建一个linux下的软连接

创建软连接：
找到全局环境的path路径 输入命令：echo $PATH 会出现：

```
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
```

你可以选择任何一个以：隔开的路径做为系统环境路径，我通常会选/usr/local/bin

pm2安装路径如下：

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

创建软连接命令：ln -s /usr/local/nodejs/bin/pm2 /usr/local/bin/

OK，搞定 验证一下：

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

#### 启动项目

```
到项目目录下：
pm2 start xxx.json  //xxx.js是pm2的配置文件 
```

##### 加油！！ 越努力越幸运！！！
