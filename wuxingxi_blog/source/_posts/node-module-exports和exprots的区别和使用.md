---
title: noden module.exports和exprots的区别和使用
date: 2020-08-07 12:00:44
tags: nodes
categories: nodes
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/mysql.jpeg"
---

**exports = \**module.exports = {};****

**`所以module.exports`和`exports`的区别就是`var a={}; var b=a;`，a和b的区别**

# module

首先要明确的一点，module是一个**对象** `{Object}`。
当你新建一个文件，比如mo.js，文件内容如下：

```
console.log(module); 
```

然后在CMD里执行这个文件`node mo.js`，就能看到module其实是一个Module实例，你可以这么理解，NodeJS中定义了一个Module类，这个类中有很多属性和方法，exports是其中的一个属性：

```
function Module {  id : 'blabla',  exports : {},  blabla... } 
```

当每个js文件在执行或被require的时候，NodeJS其实创建了一个新的实例`var module = new Module()`，这个实例名叫`module`。
**这也就是为什么你并没有定义`module`这个变量，却能console.log出来而不会报错的原因**。

# module.exports

假设我有一个JS文件内容如下：

```
console.log(module); //你会看到Module中的exports为空对象{}

module.exports = {
  print : function(){console.log(12345)}
}
console.log(module); //你会看到Module中的exports对象已经有了print()方法
```

有了上面的基础，很容易理解`module.export`其实是**给Module实例中的exports对象中添加方法/属性**。

# exports

通常使用exports的时候，是这么用的：

```
exports.print = function(){console.log(12345)}
```

假设我有一个JS文件内容如下：

```
console.log(module); //你会看到Module中的exports为空对象{}

console.log(exports); //你会看到Module中的exports为空对象{}

module.exports = {

  print : function(){console.log(12345)}

}
console.log(module); //你会看到Module中的exports对象有了print()方法

exports.name = '小白妹妹';

console.log(module); //你会看到Module中的exports对象不仅有了print()方法，还有了name属性
```

由此也能看出，传说中的**`exports`其实是`module.exports`的引用**，你可以这么理解，NodeJS在你的代码**之前**悄悄的加了以下代码：

```
var module = new Module();

var exports = module.exports;
```

**这也就是为什么你并没有定义`exports`这个变量，却能console.log出来而不会报错的原因**。

# require

当你从外部调用某个模块，require其实是在require什么？[^2](https://nodejs.org/dist/latest-v4.x/docs/api/modules.html#modules_module_require_id)
require的时候NodeJS会~~到处~~去找有没有这个模块，如果有，return的就是module.exports里的东东。

# DOs & DONTs

- √你可以这样：

  ```
  module.exports.name = '小白妹妹';
  
  exports.age = 10;
  
  module.exports.print = function(){console.log(12345)};
  ```

  如果只是使用.来添加属性和方法，module.exports和exprots混用是完全可以的，这种情况下，感觉exports就是给懒人用的…毕竟能少写几个7个字符呢！

- √也可以这样：

  ```
  module.exports = {
  name = '小白妹妹';
  };
  exports.age = 10;
  module.exports.print = function(){console.log(12345)};
  ```

- ×但不可以这样：

  ```
  module.exports = {
  name = '小白妹妹';
  };
  exports = {age:10}; // exports现在是{age:10}这个对象的引用，不再是module.exports的引用了
  
  console.log(module); //你会看到Module的exports中只有name属性！！！
  ```

- ×也不可以这样：

  ```
  exports.age = 10; 
  console.log(module); //你会看到Module的exports中多了age属性
  
  module.exports = {
  name = '小白妹妹';
  };
  
  console.log(module); //你会看到Module的exports中还是只有name属性！！！
  ```

  # 总结

  还是那一句话，module.exports和exports的区别就是var a={}; var b=a;，a和b的区别

  > - 改变`exports`的指向后所添加的`exports.xxx`都是无效的。因为require返回的只会是`module.exports`

- 不能在使用了`exports.xxx`之后，改变`module.exports`的指向。因为`exports.xxx`添加的属性和方法并不存在于`module.exports`所指向的新对象中。

- 对于要导出的属性，可以简单直接挂到`exports`对象上

- 对于类，为了直接使导出的内容作为类的构造器可以让调用者使用new操作符创建实例对象，应该把构造函数挂到`module.exports`对象上，不要和导出属性值混在一起
