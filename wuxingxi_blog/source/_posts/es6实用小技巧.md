---
title: es6实用小技巧
date: 2021-10-18 11:42:45
tags: es6 前端基础
categories: 前端基础
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/es6.jpeg"
---

#### 元素交换（利用数组结构）

```javascript
let a = 'world', b = 'hello'
[a, b] = [b, a]
console.log(a) // -> hello
console.log(b) // -> world
```

#### 单条语句

```javascript
// 寻找数组中的最大值
const max = (arr) => Math.max(...arr);
max([123, 321, 32]) // outputs: 321
// 计算数组的总和
const sum = (arr) => arr.reduce((a, b) => (a + b), 0)
sum([1, 2, 3, 4]) // output: 10
```

#### 数组拼接

```javascript
const one = ['a', 'b', 'c']
const two = ['d', 'e', 'f']
const three = ['g', 'h', 'i']

const result = [...one, ...two, ...three] // 数组合并
const result = [...new Set([...one, ...two, ...three])]; // 合并去重
```

#### 参数命名（使用解构让函数声明和调用更加可读）

```javascript
// 我们尝尝使用的写法
const getStuffNotBad = (id, force, verbose) => {
  ...do 
}
// 当我们调用函数时， 明天再看，尼玛 150是啥，true是啥
getStuffNotBad(150, true, true)

// 看完本文你啥都可以忘记, 希望够记住下面的就可以了
const getStuffAwesome = ({id, name, force, verbose}) => {
  ...do 
  }
// 完美
getStuffAwesome({ id: 150, force: true, verbose: true })
```

#### Async/Await结合数组解构

```javascript
const [user, account] = await Promise.all([
  fetch('/user'),
  fetch('/account')
])
```

#### 获取Object中指定键值

```javascript
const obj = {
    a:1,
    b:2,
    c:3,
    d:4
};

// 获取obj中a与b的值
const {a,b} = obj;

// 也可以给他们取别名
const {a:A, b:B} = obj;

```

#### 排除Object中不需要的键值

```
const obj = {
    a:1,
    b:2,
    c:3,
    d:4
}

// 我们想要获取除了a之外的所有属性
const {a, ...other} = obj

```

#### 对象快速求和

```javascript
const objs = [
{name:'lilei', score: 98},
{name:'hanmeimei', score: 95},
{name:'polo', score: 85},
...
]

const scoreTotal = objs.reduce( (total, obj) => {
    return obj.score + total;
}, 0 }/*第二个参数是total的初始值*/)

```

#### 数组过滤

```javascript
var newarr = [
  { num: 1, val: 'ceshi', flag: 'aa' },
  { num: 2, val: 'ceshi2', flag: 'aa2'  }
]
console.log(newarr.filter(item => item.num===2 ))
//  [{"num":2,"val":"ceshi2","flag":"aa2"}]

```

#### 字符串模版

```javascript
const name = '小明';
const score = 59;
const result = `${name}${score > 60?'的考试成绩及格':'的考试成绩不及格'}`;
```

#### 关于if 语句优化

```javascript
修改前：
  if(
      type == 1 ||
      type == 2 ||
      type == 3 ||
      type == 4 ||
  ){
     //...
  }

修改后：
  const condition = [1,2,3,4];

  if( condition.includes(type) ){
     //...
  }

```

#### 关于列表搜索优化

```JavaScript
修改前：
	const a = [1,2,3,4,5];
	const result = a.filter( 
    item =>{
      return item === 3
    }
  )

修改后：
// find方法中找到符合条件的项，就不会继续遍历数组。
  const a = [1,2,3,4,5];
  const result = a.find( 
    item =>{
      return item === 3
    }
  )

```

#### 关于获取对象属性值

```javascript
修改前：
	const name = obj && obj.name;

修改后：
	// ES6中的可选链操作符会使用
	const name = obj?.name;

```

#### 关于添加对象属性

```javascript
修改前：
	let obj = {};
  let index = 1;
  let key = `topic${index}`;
  obj[key] = '话题内容';
  
修改后：
 // ES6中的对象属性名是可以用表达式
  let obj = {};
  let index = 1;
  obj[`topic${index}`] = '话题内容';


```

#### 非空判断

```javascript
修改前：
if(value !== null && value !== undefined && value !== ''){
    //...
}

修改后：
 // ES6中新出的空值合并运算符
if(value??'' !== ''){
  //...
}

```

