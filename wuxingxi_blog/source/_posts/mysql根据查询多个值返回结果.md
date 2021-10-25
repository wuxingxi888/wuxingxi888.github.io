---
title: mysql根据查询多个值返回结果
date: 2020-07-31 11:58:46
tags: mysql
categories: mysql
top_img: 
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/mysql.jpeg"
---

##### 背景

需要根据查找id为数组元素的所有数据。

```
正常情况需要查询的语句：
select *from temp where id in ('1','2','3','4','5')
```

在实际过程中发现一直查不出数据，实际上能够查出数据，弄得一直很郁闷，找不出原因。
通过各终尝试，最后在项目中通过断点找出原因。

```
在进行查询时in中自动添加了单引号，如：
select *from temp where id in ('1,2,3,4,5')
这个sql肯定就不会查出数据。
```

刚开始想到的解决方法是，通过

```
id=id.replace(",", "','")；
```

进行替换，达到想要的查询语句。问题还是没有就解决。通过断点发现sql变为：

```
select *from temp where id in ('1\','2\','3\','4\',\'5')
```

此方法行不通，最会找到下边的解决方案解决问题。

解决方案：
此时 FIND_IN_SET 就能解决我们这个棘手的问题了。

```
select *from temp where FIND_IN_SET（id，'1,2,3,4,5')
```

**find_in_set()和in的区别：**

弄个测试表来说明两者的区别

```
CREATE TABLE `tb_test` (
  `id` int(8) NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `list` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
);

INSERT INTO `tb_test` VALUES (1, 'name', 'daodao,xiaohu,xiaoqin');
INSERT INTO `tb_test` VALUES (2, 'name2', 'xiaohu,daodao,xiaoqin');
INSERT INTO `tb_test` VALUES (3, 'name3', 'xiaoqin,daodao,xiaohu');
```

原来以为mysql可以进行这样的查询：

```
SELECT id,name,list from tb_test WHERE 'daodao' IN(list); -- (一) 
```

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

实际上这样是不行的，这样只有当list字段的值等于’daodao’时（和IN前面的字符串完全匹配），查询才有效，否则都得不到结果，即使’daodao’真的在list中。

再来看看这个：

```
SELECT id,name,list from tb_test WHERE 'daodao' IN ('libk', 'zyfon', 'daodao'); -- (二)
```

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

这样是可以的。

这两条到底有什么区别呢？为什么第一条不能取得正确的结果，而第二条却能取得结果。原因其实是（一）中 (list) list是变量， 而（二）中 (‘libk’, ‘zyfon’, ‘daodao’)是常量。
所以如果要让（一）能正确工作，需要用find_in_set():

```
SELECT id,name,list from tb_test WHERE FIND_IN_SET('daodao',list); -- (一)的改进版
```

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

**总结：**
所以如果list是常量，则可以直接用IN， 否则要用find_in_set()函数。
