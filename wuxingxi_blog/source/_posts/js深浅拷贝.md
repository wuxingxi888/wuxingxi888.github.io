---
title: js深浅拷贝
date: 2021-03-24 12:13:10
tags: javascript
categories: javascript
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---

# js深浅拷贝解析

### 一. 赋值

**原理**: 当原对象/数组自身赋值给新对象/数组时, 只是将自身在堆内存中引用地址赋值给新对象/数组 , 当原对象/数组或新对象/数组改变自身一级乃至多级属性时,会相互影响并改变对方的属性

赋值是将某一**数值或对象**赋给某个**变量**的过程，分为：

#### 1、基本数据类型

( **Number**数值、**String**字符串、**Boolean**布尔值、**Null**空值、 **Undefined**未定义、**Symbol**（ES6）(原始数据类型,`Symbol()`函数会返回**symbol**类型的值，该类型具有静态属性和静态方法) ) ：

赋值，赋值之后两个变量互不影响 , 基本数据类型是指存放在**栈**中的**简单数据段，数据大小确定，内存空间大小可以分配，\**它们是直接按值存放的，所以可以直接**按值访问**

```
//对基本类型进行赋值操作，两个变量互不影响。
let a = "saucxs";
let b = a;
console.log(b);  // saucxs

//改变a的值,并不会影响b的值
a = "change";
console.log(a);   // change
console.log(b);    // saucxs

//改变b的值,并不会影响a的值
b = "kevin";
console.log(a);   // change
console.log(b);    // kevin
复制代码
复制代码
```

#### 2、引用数据类型

( **Object**对象、**Array**数组、**RegExp**对象(正则表达式)、**Date**时间对象、**Function**函数)：**赋值在堆里的地址**，两个变量具有相同的引用，指针指向同一个对象，相互之间有影响

引用类型是存放在**堆内存中的对象**，**变量**其实是保存的在栈内存中的一个指针（**保存的是堆内存中的引用地址**），这个指针指向**堆内存**。

引用类型数据在栈内存中保存的实际上是对象在堆内存中的引用地址。通过这个引用地址可以快速查找到保存中堆内存中的对象

```
//对引用类型进行赋值操作，两个变量指向同一个对象，改变变量 a 之后会影响变量 b，哪怕改变的只是对象 a 中的基本类型数据。
let a = {
    name: "saucxs",
    book: {
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = a;
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "45"}
// } 

//改变变量 a 之后会影响变量 b
a.name = "change";
a.book.price = "55";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// } 
console.log(b);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// }）

//改变变量 b 之后会影响变量 a
b.name = "kevin";
b.book.price = "20";
console.log(a);
// {
//  name: "kevin",
//  book: {title: "You Don't Know JS", price: "20"}
// } 
console.log(b);
// {
//  name: "kevin",
//  book: {title: "You Don't Know JS", price: "20"}
// }）
复制代码
复制代码
```

#### 3.赋值原理图

**原理**: 当原对象/数组自身赋值给新对象/数组时, 只是将自身在堆内存中引用地址赋值给新对象/数组 , 当原对象/数组或新对象/数组改变自身一级乃至多级属性时,会相互影响并改变对方的属性

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

### 二. 浅拷贝

**浅拷贝**: 只是拷贝了基本类型的数据，对于引用的类型数据，复制后也是会发生引用，这种拷贝就叫做浅拷贝

只针对**object**和**Array**这样的复杂的对象 **只拷贝一层**,也就是只拷贝**一级属性**中**基本类型的数据**

**原理**: **浅拷贝**会在堆里面重新开辟一个内存中间, 会将**原对象/数组**拷贝一份在自己的内存空间中, 只能将**一级属性**拷贝过来,如果**原对象/数组**中有**二级属性或者多级属性**(即原对象中含有**对象/数组**), 只能拷贝**二级属性及多级属性**在**堆内存中的地址**. **原对象/数组**跟**拷贝对象/数组**更改**自身一级属性**时,**互不影响对方**. 当**原对象/数组**跟**拷贝对象/数组**更改**自身二级及多级属性**时,**会相互影响并改变对方的属性**

#### 1. Object.assign() 方法

当对象中只有一级属性，没有二级属性的时候，此方法为**深拷贝**，但是对象中有对象的时候，此方法，在二级属性以后就是**浅拷贝**。

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。是ES6的新函数

**语法**: Object.assign(target, …sources)

**参数** ：target：目标对象。 sources：任意多个源对象。 返回值：目标对象会被返回。

```
//下面代码改变对象 a 之后，对象 b 的基本属性保持不变。但是当改变对象 a 中的对象 `book` 时，对象 b 相应的位置也发生了变化。
let a = {
    name: "saucxs",   //一级属性
    book: {      //二级属性
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = Object.assign({}, a);
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "45"}
// } 

//改变对象a的的数据,对象 b 的基本属性保持不变。但是当改变对象 a 中的对象 `book` 时，对象 b 相应的book也发生了变化。
a.name = "change";
a.book.price = "55";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// } 
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "55"}
// }

//同样改变对象b的的数据,对象 a 的基本属性保持不变。但是当改变对象 b 中的对象 `book` 时，对象 a 相应的book也发生了变化。
b.name = "kevin";
b.book.price = "40";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "40"}
// } 
console.log(b);
// {
//  name: "kevin",
//  book: {title: "You Don't Know JS", price: "40"}
// }）
复制代码
复制代码
```

#### 2. 展开语法 (扩展运算符)

**语法**: …对象/数组名 es6新语法

**注意**：用扩展运算符对数组或者对象进行拷贝时，**只能扩展和深拷贝第一层的值**，对于第二层极其以后的值，扩展运算符将不能对其进行打散扩展，也不能对其进行深拷贝，即**拷贝后和拷贝前第二层中的对象或者数组仍然引用的是同一个地址**，其中一方改变，另一方也跟着改变。

```
let a = {
    name: "saucxs",   //一级属性
    book: {      //二级属性
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = {...a};    //将a对象的数据展开赋值给b对象
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "45"}
// } 

//改变对象a的的数据,对象 b 的基本属性保持不变。但是当改变对象 a 中的对象 `book` 时，对象 b 相应的book也发生了变化。
a.name = "change";
a.book.price = "55";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// } 
console.log(b);
// {
//  name: "saucxs",  
//  book: {title: "You Don't Know JS", price: "55"}
// }

//同样改变对象b的的数据,对象 a 的基本属性保持不变。但是当改变对象 b 中的对象 `book` 时，对象 a 相应的book也发生了变化。
b.name = "kevin";
b.book.price = "40";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "40"}
// } 
console.log(b);
// {
//  name: "kevin",
//  book: {title: "You Don't Know JS", price: "40"}
// }）
复制代码
复制代码
```

#### 3. Array.prototype.slice方法

slice不会改变原数组，`slice()` 方法返回一个新的数组对象

**slice**: 截取数组指定元素 slice (/slaɪs/)
​ arr.slice(start,end) 返回数组 范围 start <= 范围 < end​ 将 数组中 start 下标 (索引)的元素 一直查询到 end 下标(索引)的元素，并返回 截取的新数组

```
let a = [0, "1", [2, 3]];    //0 , "1"   是一级属性    [2,3] 是二级属性
let b = a.slice(1); //截取旧数组从下标1开始到最后
console.log(b); // ["1", [2, 3]]

//改变 a[1] 之后 b[0] 的值并没有发生变化，但改变 a[2][0] 之后，相应的 b[1][0] 的值也发生变化。
a[1] = "99";  
a[2][0] = 4;
console.log(a);  // [0, "99", [4, 3]]
console.log(b);  //  ["1", [4, 3]]

//改变 b[0] 之后 a[1] 的值并没有发生变化，但改变 b[1][1] 之后，相应的 a[2][1] 的值也发生变化。
b[0] = "3";
b[1][1] = 6;
console.log(a);  // [0, "99", [4, 6]]
console.log(b);  //  ["3", [4, 6]]
复制代码
复制代码
```

#### 4.Array.prototype.concat()方法

**concat()**: 用于连接整个数组，将连接后的数组返回，不会影响当前数组并且可以连接字符串 concat([kɑːnkæt])

```
let b=[]
let a = [0, "1", [2, 3]];  //0 , "1"   是一级属性    [2,3] 是二级属性
 b = b.concat(a);   //将两个数组拼接返回新的数组,将新数组赋值给b
console.log(b);   // [0, "1", [2, 3]]

//改变 a[1] 之后 b[1] 的值并没有发生变化，但改变 a[2][0] 之后，相应的 b[2][0] 的值也发生变化。
a[1] = "99";  
a[2][0] = 4;
console.log(a);  // [0, "99", [4, 3]]
console.log(b);  //  [0, "1", [4, 3]]

//改变 b[0] 之后 a[0] 的值并没有发生变化，但改变 b[2][1] 之后，相应的 a[2][1] 的值也发生变化。
b[0] = "3";
b[2][1] = 6;
console.log(a); // [0, "1", [4, 6]]
console.log(b); //  ["3", "1", [4, 6]]
复制代码
复制代码
```

#### 5.各种for循环…以及更多

**代表** : forEach() ES6方法

**语法**: 数组名.forEach((item,index) => { return item });

**参数** : item:数组的每一个元素 index:数组的每个元素下标

```
let b=[]
let a = [0, "1", [2, 3]];   //0 , "1"   是一级属性    [2,3] 是二级属性
a.forEach((item,index) => {      //forEcah语法遍历a数组,将每个元素复制一份给b数组
    return  b[index]=item
});
console.log(b);   // [0, "1", [2, 3]]

//改变 a[1] 之后 b[1] 的值并没有发生变化，但改变 a[2][0] 之后，相应的 b[2][0] 的值也发生变化。
a[1] = "99";  
a[2][0] = 4;
console.log(a);  // [0, "99", [4, 3]]
console.log(b);  //  [0, "1", [4, 3]]

//改变 b[0] 之后 a[0] 的值并没有发生变化，但改变 b[2][1] 之后，相应的 a[2][1] 的值也发生变化。
b[0] = "3";
b[2][1] = 6;
console.log(a); // [0, "99", [4, 6]]
console.log(b); //  ["3", "1", [4, 6]]
复制代码
复制代码
```

#### 6.浅拷贝原理图

**原理**: **浅拷贝**会在堆里面重新开辟一个内存中间, 会将**原对象/数组**拷贝一份在自己的内存空间中, 只能将**一级属性**拷贝过来,如果**原对象/数组**中有**二级属性或者多级属性**(即原对象中含有**对象/数组**), 只能拷贝**二级属性及多级属性**在**堆内存中的地址**. **原对象/数组**跟**拷贝对象/数组**更改**自身一级属性**时,**互不影响对方**. 当**原对象/数组**跟**拷贝对象/数组**更改**自身二级及多级属性**时,**会相互影响并改变对方的属性**

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

### 三.深拷贝

**深拷贝**: 要求要复制一个复杂的对象，将原对象的各个属性逐个复制出去，而且将原对象各个属性所包含的对象也依次采用深复制的方法递归复制到新对象上

只针对**object**和**Array**这样的复杂的对象 **拷贝多层**,也就是能将**二级及多级属性**中**所有数据**拷贝 ,

**原理**: **深拷贝**会在堆里面重新开辟一个内存中间,会将**原对象/数组**中**所有的属性(一级乃至多级属性)\**完整的拷贝一份在自己的内存空间中,**原对象/数组**跟**拷贝对象/数组**更改自身属性时,**互不影响也不会改变对方的属性**

#### 1. JSON.parse(JSON.stringify(object)) 方法

**JSON.stringify ( )** : 将对象,数组等所有数据转化为字符串

**JSON.parse ( )** : 将对象,数组等所有数据从字符串转化为对象,数组等原来的数据类型

**注意** : 拷贝的数据里面不能有函数，因为JSON.stringify()，JSON.parse()处理不了函数。

```
let a = {
    name: "saucxs",    //一级属性
    book: {             //二级属性
        title: "You Don't Know JS",
        price: "45"
    }
}
let b = JSON.parse(JSON.stringify(a));  
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "45"}
// } 

//改变对象a的的数据,对象 b 的所有数据保持不变。
a.name = "change";
a.book.price = "55";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// } 
console.log(b);
// {
//  name: "saucxs",
//  book: {title: "You Don't Know JS", price: "45"}
// }

//同样改变对象b的的数据,对象 a 的所有保持不变
b.name = "kevin";
b.book.price = "40";
console.log(a);
// {
//  name: "change",
//  book: {title: "You Don't Know JS", price: "55"}
// } 
console.log(b);
// {
//  name: "kevin",
//  book: {title: "You Don't Know JS", price: "40"}
// }）
复制代码
复制代码
```

##### (1). 对数组深拷贝。

```
let a = [0, "1", [2, 3]];
let b = JSON.parse(JSON.stringify( a.slice(1) ));
console.log(b);// ["1", [2, 3]]

//改变数组a的的数据,数组 b 的所有数据保持不变。
a[1] = "99";
a[2][0] = 4;
console.log(a);// [0, "99", [4, 3]]
console.log(b);//  ["1", [2, 3]]

//改变数组b的的数据,数组 a 的所有数据保持不变。
b[0] = "3";
b[1][1] = 6;
console.log(a); // [0, "99", [4, 3]]
console.log(b); //  ["3", [2, 6]]
复制代码
复制代码
```

##### (2). 该方法有以下几个问题

**A . 会忽略 `undefined` 会忽略 `symbol` 不能序列化函数 (对象/数组中不能有函数)**

**遇到 `undefined`、`symbol` 和函数这三种情况，会直接忽略。**

```
let obj = {
    name: 'saucxs',
    a: undefined,
    b: Symbol('saucxs'),
    c: function() {}
}
console.log(obj);
// {
//  name: "saucxs", 
//  a: undefined, 
//  b: Symbol(saucxs), 
//  c: ƒ ()
// }
let b = JSON.parse(JSON.stringify(obj));
console.log(b);  // {name: "saucxs"}    只能打印出name
复制代码
复制代码
```

**B. 不能解决循环引用的对象**

**循环引用会报错**

```
let obj = {
    a: 1,
    b: {
        c: 2,
        d: 3
    }
}
obj.a = obj.b;
obj.b.c = obj.a;

let b = JSON.parse(JSON.stringify(obj));// Uncaught TypeError: Converting circular structure to JSON
复制代码
复制代码
```

**C . 不能正确处理`new Date()`**

**`new Date` 情况下，转换结果不正确**

```
//new Date 情况下，转换结果不正确
new Date(); // Mon Dec 24 2018 10:59:14 GMT+0800 (China Standard Time)
JSON.stringify(new Date());  // ""2018-12-24T02:59:25.776Z""
JSON.parse(JSON.stringify(new Date()));// "2018-12-24T02:59:41.523Z"

//解决方法转成字符串或者时间戳就好了。
let date = (new Date()).valueOf();// 1545620645915
JSON.stringify(date);// "1545620673267"
JSON.parse(JSON.stringify(date));// 1545620658688
复制代码
复制代码
```

**D. 不能处理正则**

**正则情况下只会拷贝一个空对象**

```
let obj = {
    name: "saucxs",
    a: /'123'/
}
console.log(obj);// {name: "saucxs", a: /'123'/}
let b = JSON.parse(JSON.stringify(obj));
console.log(b);  // {name: "saucxs", a: {}}   // 属性a中的正则无法拷贝,会拷贝出空对象
复制代码
复制代码
```

#### 2.使用递归的方式实现深拷贝

```
//使用递归的方式实现数组、对象的深拷贝function deepClone(obj){
function deepClone(obj){
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj)?[]:{};
    //进行深拷贝的不能为空，并且是对象或者是
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}    
let a=[1,2,3,4],
    b=deepClone(a); //调用deepClone方法并传入实参,并将返回值赋值给b
console.log(b); //[1,2,3,4]

//改变a数组下标为0的属性值,b数组下标为0的属性值并不会改变
a[0]=2;   
console.log(a);  //[2,2,3,4]
console.log(b); //[1,2,3,4]
复制代码
复制代码
```

#### 3、jQuery的extend方法

**语法** : $.extend( [deep ], target, object1 [, objectN ] )

**参数**: **deep** : 表示是否深拷贝，为true为深拷贝，为false，则为浅拷贝

**target** : 类型 目标对象，其他对象的成员属性将被附加到该对象上。

**object1 , objectN**可选。 Object类型 第一个以及第N个被合并的对象。

```
let a=[0,1,[2,3],4],
    b=$.extend(true,[],a);
console.log(b); //[0,1,[2,3],4]

//更改a数组中的一级属性和二级属性,b数组的属性并没有发生任何改变
a[0]=1;
a[2][0]=1;
console.log(a);   //[1,1,[1,3],4]
console.log(b); // [0,1,[2,3],4]
复制代码
复制代码
```

#### 4、lodash函数库

```
lodash很热门的函数库，提供了 lodash.cloneDeep()实现深拷贝
复制代码
复制代码
```

#### 5.深拷贝原理图

**原理**: **深拷贝**会在堆里面重新开辟一个内存中间,会将**原对象/数组**中**所有的属性(一级乃至多级属性)\**完整的拷贝一份在自己的内存空间中,**原对象/数组**跟**拷贝对象/数组**更改自身属性时,**互不影响也不会改变对方的属性**

![img](data:image/gif;base64,R0lGODdhAQABAPAAAMPDwwAAACwAAAAAAQABAAACAkQBADs=)

### 总结表格

|        | 和原数据是否指向同一对象 | 第一层数据为基本数据类型 | 原数据中包含子对象       |
| ------ | ------------------------ | ------------------------ | ------------------------ |
| 赋值   | 是                       | 改变会使原数据一起改变   | 改变会使原数据一起改变   |
| 浅拷贝 | 否                       | 改变不会使原数据一起改变 | 改变会使原数据一起改变   |
| 深拷贝 | 否                       | 改变不会使原数据一起改变 | 改变不会使原数据一起改变 |

### 重点

通常在开发中并不希望改变变量 a 之后会影响到变量 b，这时就需要用到浅拷贝和深拷贝。

当对象中只有一级属性，没有二级属性的时候，此方法为**深拷贝**，但是对象中有对象的时候，此方法，在二级属性以后就是**浅拷贝**。
