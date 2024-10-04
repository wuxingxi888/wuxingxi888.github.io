---
title: Github图床搭建，结合Picgo与jsdelivr的免费cdn加速
date: 2024-10-04 23:05:22
tags: GitHub jsdelivr
categories: 
top_img:
cover: https://cdn.jsdelivr.net/gh/wuxingxi888/CDN_IMG_BED/jsdelivr_gh.jpeg
---

话不多说 ，直接开整！

jsdelivr加速地址：

```typescript
https://cdn.jsdelivr.net/gh/Github用户名/仓库名@master
https://fastly.jsdelivr.net/gh/Github用户名/仓库名@master
```

注意：这两个地址偶尔不好使，自己看哪个好用用哪个。



1. 创建一个GitHub仓库：

​		进入你的GitHub首页，在右上角你会找到一个➕，在下拉菜单中选取"New repository"选项

​	<img src="Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121181614985-453729137.png" alt="2954941-20240121181614985-453729137"  />









​	按需填写相关信息，创建仓库：

![2954941-20240121182042286-876479529](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121182042286-876479529.png)



2. 获取一个GitHub的token用以picgo的身份验证，在你的GitHub主页，右上角点击你的头像，在展示的抽屉中选择"Settings"

![2954941-20240121182419954-1790036747](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121182419954-1790036747.png)



然后把左侧选项框滑到最下面，选择"Developer settings"，再从左侧点击"Personal access token"下拉展开，选择"Tokens(classic)"，然后再点击右上角的"Generate new token"，选择"Generate new token(classic)"![2954941-20240121182739149-198663654](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121182739149-198663654.png)











按步骤填写信息后，滑倒最下面，创建token，然后复制token值（必须立马复制，否则之后将无法再看到这个token的值）



![2954941-20240121183210414-1266914777](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121183210414-1266914777.png)





![2954941-20240121183342410-1581236573](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121183342410-1581236573.png)



3. 配置Picgo（下载安装很简单，[官网](https://github.com/Molunerfinn/PicGo/releases) 直接下载安装就行），点击左侧的图床设置，选择github，再点击编辑。

![2954941-20240121183441422-439027951](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121183441422-439027951.png)

按要求填写内容，点击确定，即可完成配置，可以开始上传图片：

参考：

```
设定仓库名（参考）：MorningM/img-bed
设定自定义域名（参考）：https://cdn.jsdelivr.net/gh/MorningM/img-bed@master
```

![2954941-20240121183756312-119349484](Github图床搭建，结合Picgo与jsdelivr的免费cdn加速/2954941-20240121183756312-119349484.png)



到此结束，快去试试吧！
