---
title: js 基本类型和引用类型区别
date: 2021-03-26 14:00:37
tags: javascript
categories: javascript
top_img:
cover: "![javascript](js-基本类型和引用类型区别/javascript.jpeg)"
---

## 一、JavaScript全部数据类型

- 内置类型
- - 空值 null
  - 未定义 undefined
  - 布尔值 boolean
  - 数字 number
  - 字符串 string
  - 对象 object
  - 符号 symbol
  - 长整型 bigInt
- 1.基本数据类型

> undefined null number boolean string symbol(ES新增) bigint(ES10新增)

基本数据类型是按值访问的，就是说我们可以操作保存在变量中的实际的值

- 1.1基本数据类型的值是不可变的
- 1.2基本数据类型不可以添加属性和方法
- 1.3基本数据类型的赋值是简单赋值
- 1.4基本数据类型的比较是值的比较
- 1.5基本数据类型是存放在栈区的
- 2.引用类型

> JS中除了上面的基本类型之外就是引用类型了，也可以说是object 对象，比如：object array function data等

- 2.1引用类型的值是可以改变
- 2.2引用类型可以添加属性和方法
- 2.3引用类型的赋值是对象引用
- 2.4引用类型的标胶是引用的比较
- 2.5引用类型是同时存在栈区和堆区的

## 二、基本数据类型和引用数据类型的区别

- 1.声明变量时不同的内存分配

`原始值：`存储在栈(stack)中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。是因为这些原始类型占据的空间是固定的，所以可以将它们存储在较小的内存区域—栈中，这样存储便于迅速查询变量的值

`引用值：`存储在堆(heap)中的对象。也就是说，存储在变量处的值是一个指针(point)，指向存储对象的内存地址。是因为引用值的大小会改变，所以不能把它放在栈中，否则会降低变量查询的速度。相反，放在变量的栈空间中的值是该对象存储在堆中的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响。

- 2.不同的内存分配机制也带来了不同的访问机制

在js中是不允许直接访问保存在堆内存中的对象的，所以在访问一个对象时，首先得到的是这个对象在堆内存中的地址，然后再按照这个地址去获得这个对象中的值，这就是传说中的按引用访问。而原始类型的值是可以直接访问到的。

- 3.复制变量时的不同

`原始值：`在将一个保存着原始值的变量复制给另一个变量时，会将原始值的副本赋值给新变量，此后这两个变量是完全独立的，它们只是拥有相同的value而已

`引用值：`在将一个保存着对象内存地址的变量复制给另一个变量时，会把这个内存地址赋值给新变量，也就是说这两个变量都指向了堆内存中同一个对象，他们中任何一个做出的改变都会反映在另一个身上。(需要理解的一点是：复制对象时并不会在堆内存中新生成一个一模一样的对象，只是多了一个保存指向这个对象指针的变量罢了)

- 4.参数传递的不同(把实参复制给形参的过程)

首先我们应该明确的一点是：ESCMAScript中所有函数的参数都是按值来传递的。 但是为什么涉及到原始类型与引用类型的值时仍然有区别呢？这就是因为内存分配时的差别。

`原始值：`只是把变量里的值传递给参数，之后参数和这个变量互不影响

`引用值：`对象变量里面的值是这个对象在堆内存中的内存地址，这一点很重要！因此它传递的值也就是这个内存地址，这也就是为什么函数内部对这个参数的修改会体现在外部的原因，因为它们都指向同一个对象。

### Symbol

Symbol 指的是独一无二的值。每个通过 Symbol() 生成的值都是唯一的。

symbol 是一种基本数据类型（primitive data type） 。Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法：“new Symbol()”。

每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。

```
let var_symbol = Symbol();
let other_symbol = Symbol();
console.log(var_symbol === other_symbol);
// false
console.log(typeof var_symbol);
// symbol
console.log(var_symbol.constructor === Symbol)
// true
```

那么，如何使用 Symbol 创建两个可以相等的变量呢？

```
alet var_symbol = Symbol.for('symbol');
let other_symbol = Symbol.for('symbol');
console.log(var_symbol === other_symbol)
// true
```

Symbol.for(key) 方法会根据给定的键 key(字符串)，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。
————————————————————————————————————————————
和 Symbol() 不同的是，用 Symbol.for() 方法创建的的 symbol 会被放入一个全局 symbol 注册表中。Symbol.for() 并不是每次都会创建一个新的 symbol，它会首先检查给定的 key 是否已经在注册表中了。假如是，则会直接返回上次存储的那个。否则，它会再新建一个。

### BigInt

BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数。而在其他编程语言中，可以存在不同的数字类型，例如:整数、浮点数、双精度数或大斐波数。

JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制。一是数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示的，这使得 JavaScript 不适合进行科学和金融方面的精确计算。二是大于或等于2的1024次方的数值，JavaScript 无法表示，会返回Infinity。

```
// 超过 53 个二进制位的数值，无法保持精度
Math.pow(2, 53) === Math.pow(2, 53) + 1 // true

// 超过 2 的 1024 次方的数值，无法表示
Math.pow(2, 1024) // Infinity
```

ES2020 引入了一种新的数据类型 BigInt，来解决这个问题。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

为了与 Number 类型进行区分，BigInt 类型的数据必须添加后缀n。

```
12 	// 普通Number
12n // BigInt

// BigInt 的运算
1n + 2n // 3n

// 与Number 类型进行运算
1 + 1n // Uncaught TypeError

BigInt 与普通整数是两种值，它们之间并不相等。

12n === 12 // false
```

由于 BigInt 与 Number 完全属于两种类型,并且不会进行隐式转换，所以没有办法进行混合运算。想要运算的话，必须将两种数据类型转换为同一张后，方可进行计算：

```
BigInt(number) // 将一个 Number 转换为 BigInt
Number(bigint) // 将一个 BigInt 转换为 Number
```

typeof 运算符对于 BigInt 类型的数据返回 bigint。

```
typeof 12n // 'bigint'
```

由于 BigInt 并不是一个构造函数，所以，不能使用 new BigInt() 的方式来构建实例

```
new BigInt() 
// Uncaught TypeError: BigInt is not a constructor at new BigInt
```

另外，当你创建一个 BigInt 的时候，参数必须为整数，否则或报错

```
BigInt(1.2) 
// Uncaught RangeError: The number 1.2 cannot be converted to a BigInt because it is not an integer
```
