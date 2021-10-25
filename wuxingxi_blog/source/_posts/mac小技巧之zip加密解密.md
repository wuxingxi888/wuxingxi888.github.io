---
title: mac小技巧之zip加密解密
date: 2021-10-14 11:21:31
tags: Mac linux
categories: 
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/Linux.jpeg"
---

{% note simple %}
1.加密：
{% endnote %}

```
1.进入文件目录

> cd xxx(文件目录)
只压缩单个文件

zip -e xxx.zip yyy
压缩文件夹

zip -e -r xxx.zip yyy

根据提示输入密码和确认密码即可

完整的命令行及注释

zip -q -r -e -m -o xxx.zip yyy
-q 表示不显示压缩进度状态

-r 表示子目录子文件全部压缩为zip //这部比较重要，不然的话只有something这个文件夹被压缩，里面的没有被压缩进去

-e 表示你的压缩文件需要加密，终端会提示你输入密码的

-m 表示压缩完删除原文件

-o 表示设置所有被压缩文件的最后修改时间为当前压缩时间

当跨目录的时候是这么操作的

zip -q -r -e -m -o ‘\user\someone\syyy\xxx.zip’ ‘\users\yyy’
```

{% note simple %}
1.解密：
{% endnote %}

```
unzip FileName.zip
```

