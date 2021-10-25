---
title: js循环的几种方式
date: 2021-05-12 14:08:16
tags: JavaScript
categories: JavaScript
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/es6.jpeg"
---

#### 1.普通的for

```
var arr = [1, 2, 3]
for(let i = 0; i < arr.length; i++) { // 这里的i是代表数组的下标
    console.log(i); // 0, 1, 2
};
最简单的一种，正常用的话也不会出现什么问题，想中断也可以中断，性能上也还可以 
```

#### 2.for…of…遍历(这种遍历支持ES6

```
var arr = [1, 2, 3]
for(var item of arr) { // item代表数组里面的元素
    console.log(item); // 1, 2, 3
};　
与forEach()不同的是，它可以正确响应break、continue和return语句
性能要好于forin，但仍然比不上普通for循环
这个方法避开了for-in循环的所有缺陷
```

#### 3. forEach()

```
var arr = [1, 2, 3];
arr.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
    console.log(item); // 1, 2, 3
    console.log(index); // 0, 1, 2
    console.log(arr); // [1, 2, 3]
});
常用的return false是可以终止代码继续往下执行的，但是在forEach遍历中，并没有终止循环，所以在用forEach的时候，要考虑使用场景了。
```

#### 4.some()

```
var arr = [1, 2, 3];
arr.some((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
    console.log(item); // 1, 2, 3
    console.log(index); // 0, 1, 2
    console.log(arr); // [1, 2, 3]  
})
some作为一个用来检测数组是否满足一些条件的函数存在，同样是可以用作遍历的函数签名同forEach，有区别的是当任一callback返回值匹配为true则会直接返回true，如果所有的callback匹配均为false，则返回false。
some() 方法会依次执行数组的每个元素：
如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
如果没有满足条件的元素，则返回false。
```

#### 5.every()

```
var arr = [1, 2, 3];
arr.every((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
    return item > 0; // true
    return index == 0; // false
})
every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。
every() 方法使用指定函数检测数组中的所有元素：
如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。
```

#### 6.for…in…遍历.

```
var arr = [1, 2, 3]
for(var item in arr) { // item遍历数组时为数组的下标，遍历对象时为对象的key值
    console.log(item); // 0, 1, 2
};
for...in更多是用来遍历对象，很少用来遍历数组， 不过 item 对应与数组的 key值，建议不要用该方法来遍历数组，因为它的效率是最低的。
```

#### 7. filter()

```
var arr = [1, 2, 3];
arr.filter(item => { // item为数组当前的元素
    return item > 1; // [2, 3]
})
filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
```

#### 8.map()

```
var arr = [1, 2, 3];
arr.map(item => { // item为数组的元素
    console.log(item); // 1, 2, 3
    return item * 2; // 返回一个处理过的新数组[2, 4, 6]
})
map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
map() 方法按照原始数组元素顺序依次处理元素。
这种方式也是用的比较广泛的，虽然用起来比较优雅，但实际效率还比不上foreach
```
