---
title: js之var let及const区别
date: 2021-03-26 14:04:27
tags: javascript
categories: javascript
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---

对于这个问题，我们应该先来了解提升（hoisting）这个概念

```
console.log(a) // undefined
var a = 1
```

从上述代码中我们可以发现，虽然变量还没有被声明，但是我们却可以使用这个未被声明的变量，这种情况就叫做提
升，并且提升的是声明。

我们已经了解了 var 声明的变量会发生提升的情况，其实不仅变量会提升函数也会被提升。

```
console.log(a) // ƒ a() {}
function a() {}
var a = 1
```

对于上述代码，打印结果会是 ƒ a() {} ，即使变量声明在函数之后，这也说明了函数会被提升，并且优先于变量提
升。
说完了这些，想必大家也知道 var 存在的问题了，使用 var 声明的变量会被提升到作用域的顶部，接下来我们再
来看 let 和 const 。

我们先来看一个例子：

```
var a = 1
let b = 1
const c = 1

console.log(window.b) // undefined
console.log(window. c) // undefined

function test(){
	console.log(a)
	let a
}
test()
```

首先在全局作用域下使用 let 和 const 声明变量，变量并不会被挂载到 window 上，这一点就和 var 声明有了区别。
再者当我们在声明 a 之前如果使用了 a ，就会出现报错的情况

你可能会认为这里也出现了提升的情况，但是因为某些原因导致不能访问。
首先报错的原因是因为存在暂时性死区，我们不能在声明前就使用变量，这也是 let 和 const 优于 var 的一点。

然后这里你认为的提升和 var 的提升是有区别的，虽然变量在编译的环节中被告知在这块作用域中可以访问，但是访问是受限制的。

那么到这里，想必大家也都明白 var 、 let 及 const 区别了，不知道你是否会有这么一个疑问，为什么要存在提升这个事情呢，其实提升存在的根本原因就是为了解决函数间互相调用的情况

```
function test1() {
test2()
}
function test2() {
test1()
}
test1()
```

假如不存在提升这个情况，那么就实现不了上述的代码，因为不可能存在 test1 在 test2 前面然后 test2 又在test1 前面。

### const：声明常量时，是只读且不可修改的

```
const a = 3;
console.log(a);//3
a = 5;//Uncaught TypeError: Assignment to constant variable(未捕获的TypeError:常量变量赋值)
console.log(a);
```

下面再来看一个列子：

```
const obj = {};
    obj.a = 3;
    console.log(obj);//{a: 3}
```

看到这里是不是疑惑为什么可以修改了？？？，**const声明的变量只是保证了变量指向的地址不变，如果这个对象是引用类型的话，它的值是可以被修改的。**

那么最后我们总结下这个部分的内容：

**函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部**

**var 存在提升，我们能在声明之前使用。 let 、 const 因为暂时性死区的原因，不能在声明前使用**

**var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会**

**let 声明的变量只在 let 命令所在的代码块内有效。**

**const 声明一个只读的常量，一旦声明，常量的值就不能改变。**
