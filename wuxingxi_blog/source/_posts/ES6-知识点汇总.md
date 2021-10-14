---
title: ES6 知识点汇总
date: 2020-11-30 12:09:22
tags: es6
categories: es6 
top_img:
cover: "![es6](ES6-知识点汇总/es6.jpeg)"
---



## ES6 知识点汇总

#### 1.let

代码块内有效
不能重复声明
不存在变量提升

#### 2.const

声明一个只读变量，声明之后不允许改变

#### 3.解构赋值

a. 数组模型解构
i. 基本
\1) let [ a , b , c ] = [ 1 , 2 , 3 ]
ii. 可嵌套
\1) let [ a , [ [ b ] , c ] ] = [ 1 , [ [ 2 ] , 3 ] ]
iii. 可忽略
\1) let [ a , , c ] = [ 1 , 2 , 3 ]
iv. 不完全解构
\1) let [ a = 1 , b ] = [ ] // a = 1 , b = undefiend
v. 剩余运算符
\1) let [ a , b , c , d , e ] = ‘hello’ // a = ‘h’ , b = ‘e’ 等等
vi. 解构默认值
\1) let [ a = 2 ] = [ undefiend ] // a = 2
b. 对象模型解构
i. 基本
\1) let { foo , bar } = { foo : ‘aaa’ , bar : ‘bbb’ }
\2) let { baz : foo } = { baz : ‘ddd’ }
ii. 可嵌套可忽略
\1) let obj = { p : [ ‘hello’ , { y : ‘world } ] } let { p : [ x , { y } ] } = obj
\2) let obj = { p : [ ‘hello’ , { y : ‘world } ] } let { p : [ x , { } ] } = obj
iii. 不完全解构
\1) let obj = { p : [ { y : ‘world’ } ] } let { p : [ { y } , x ] } = obj
iv. 剩余运算符
\1) let { a , b , … rest } = { a : 10 , b : 20 , c : 30 , d : 40 }
v. 解构默认值
\1) let { a = 10 , b = 5 } = { a : 3}
\2) let { a : aa = 10 , b : bb = 5 } = { a : 3

#### 4.symbol（表示独一无二的值，最大用法是用来定义对象的唯一属性名）

a.基本用法

let sy = Symbol (‘kk’)
console.log ( sy ) //Symbol ( kk )
type of ( sy ) // ‘ symbol ‘
//相同参数Symbol()返回的值不相等
let sy1 = Symbol (‘kk’)
sy === sy1 //false

b. 作为属性名（Symbol 作为对象的属性名，可以保证属性不重名）

let sy = Symbol(‘key1’)

//写法一
let syObject = {}
syObiect[sy] = ‘kk’
console.log(syObject) // {Symbol(key1):’kk’}

//写法二
let syObject = {

[sy]: ’kk’

}

//写法三
let syObject = {}
Object.defineProperty(syObject,sy,{vaule:’kk’})

//注意
Symbol作为对象属性名时，不能用 . 运算符。要使用[]
let syObject = {}
syObject[sy] = ‘kk’
syObject[sy] //‘kk’
syObject.sy //undefined

#### 5.Map 和 Set

a. key是字符串
var myMap = new Map()
var keyString = ‘a string’
myMap.set(keyString,”和键’a string’ 关联的值”)
myMap.get(keyString) //和键’a string’ 关联的值
myMap.get(‘a,string’) //和键’a string’ 关联的值

b. key是对象
var myMap = new Map()
var keyString = ‘a string’
myMap.set(keyString,”和键’a string’ 关联的值”)
myMap.get(keyString) //和键’a string’ 关联的值
myMap.get({}) //undefiend

c.key是函数
var myMap = new Map()
var keyFun = function(){}
myMap.set(keyFun,’和键keyFun关联的值’)
myMap.get(keyFun) //和键keyFun关联的值
myMap.get(function(){}) //undefiend

d. key是NaN
var myMap = new Map()
myMap.set(NaN,’not a number’)
myMap.get(NaN) //not a number
var otherNaN = Number(‘foo’)
myMap.get(otherNaN) //not a number

##### Map迭代

a. for…of
var myMap = new Map()
myMap.set(0,’zero’)
myMap.set(1,’one’)

for(var [key,vaule] of myMap){
console.log(key + “=” + vaule)
// 0 = zero; 1 = one
}
for (var [key,vaule] of myMap.entries()){
console.log(key + “=” + vaule)
// 0 = zero; 1 = one
}

//entries方法返回一个新的Iterator 对象，它按插入顺序包含了Map对象中每个元素的[key,vaule]数组

b. forEach()
var myMap = new Map()
myMap.set(0,’zero’)
myMap.set(1,’one’)
myMap.forEach(function(vaule,key){
console.log(key+”=”+vaule)
// 0 = zero; 1 = one
})

##### Map对象的操作

a. Map 与 Array 的转换
var kvArry = [[‘key1’,’vaule1’],[‘key2’,’vaule2’]]
//将一个 二维 键值对数组转换成一个 Map 对象
var myMap = new Map(kvArry)
//将一个 Map 对象转换成一个二维键值对数组
var outArry = Array.from(myMap)

b. Map的克隆
var myMap1 = new Map([[‘key1’,’vaule1’],[‘key2’,’vaule2’]])
var myMap2 = new Map(myMap1)

c. Map的合并
var first = new Map([[1,’one’],[2,’two’],[3,’three’],])
var second = new Map([[1.’uno’],[2,’dos’])
//uno，dos， three
var merged = new Map([…first,…second])

##### set对象（set对象允许你储存任何类型的唯一值，无论是原始值还是对象引用）

set中的特殊值(set对象储存的值总是唯一的，所以需要判断两个值是否恒等。有几个特殊值需要特殊对待)

1. +0与-0在储存判断唯一值性的时候是恒等的，所以不重复
2. undefined和undefined是恒等的，所以不重复
3. NaN与NaN是不恒等的，但是在set中只能存一个，不重复

let mySet = new Set()
mySet.add(1); // Set(1) {1}
mySet.add(5); // Set(2) {1, 5}
mySet.add(5); // Set(2) {1, 5} 这里体现了值的唯一性
mySet.add(“some text”);
// Set(3) {1, 5, “some text”} 这里体现了类型的多样性
var o = {a: 1, b: 2};
mySet.add(o);
mySet.add({a: 1, b: 2});
// Set(5) {1, 5, “some text”, {…}, {…}}
// 这里体现了对象之间引用不同不恒等，即使值相同，Set 也能存储

##### 类型转换

//Array转Set
var mySet = new Set([‘vaule1’,’vaule2’,’vuale3’])
var myArray = […mySet]

//String转Set
var mySet = new Set(‘hello’)
// 注：Set 中 toString 方法是不能将 Set 转换成 String

##### Set 对象作用

a. 数组去重
var mySet = new Set([1,2,3,4,4])
[…mySet]
b. 并集
var a = new Set([1,2,3])
var b = new Set([4,3,2])
var union = new Set([]…a,…b) //{1,2,3,4}
c. 交集
var a = new Set([1,2,3])
var b = new Set([4,3,2])
var intersect = new Set([…a].filter(x => b.has(x))) //{2,3}
d. 差集
var a = new Set([1, 2, 3]);
var b = new Set([4, 3, 2]);
var difference = new Set([…a].filter(x => !b.has(x))); // {1}
