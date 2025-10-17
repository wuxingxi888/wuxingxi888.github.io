---
title: 深入理解 Node.js 中的 module.exports 和 exports
date: 2023-05-06 08:00:00
tags: nodejs commonjs 模块系统 javascript 后端技术
categories: 后端技术
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---

## 前言

在上一篇文章中，我们介绍了 [JavaScript 模块系统的发展历程](js之commonjs和es-module理解.md)，其中提到了 CommonJS 是 Node.js 默认的模块系统。在 CommonJS 中，我们使用 `module.exports` 和 `exports` 来导出模块内容，使用 `require` 来导入模块。但很多初学者对 `module.exports` 和 `exports` 的关系和区别感到困惑。本文将深入剖析这两个对象的关系和正确使用方式。

## 理解 module 对象

在每个 Node.js 文件中，都有一个内置的 `module` 对象。这个对象包含了当前模块的相关信息。

让我们通过一个简单的例子来观察 `module` 对象：

```javascript
// example.js
console.log(module);
```

运行这个文件：

```bash
node example.js
```

你会看到类似以下的输出：

```javascript
Module {
  id: '.',
  path: '/path/to/your/file',
  exports: {},
  parent: null,
  filename: '/path/to/your/file/example.js',
  loaded: false,
  children: [],
  paths: [ /* ... */ ]
}
```

可以看到，`module` 是一个包含多个属性的对象，其中 `exports` 是一个空对象 `{}`。这个 `exports` 对象就是我们用来导出模块内容的地方。

## module.exports 和 exports 的关系

最关键的一点是：**`exports` 是 `module.exports` 的引用**。在 Node.js 执行你的代码之前，它会悄悄地添加以下代码：

```javascript
var module = new Module(...);
var exports = module.exports;
```

这就像下面的代码一样：

```javascript
var a = {};
var b = a; // b 是 a 的引用
```

让我们通过一个例子来验证这一点：

```javascript
// relationship.js
console.log("module.exports === exports:", module.exports === exports); // true
console.log("module.exports:", module.exports); // {}
console.log("exports:", exports); // {}

// 修改 exports 对象
exports.name = "Node.js";

console.log("修改后 module.exports:", module.exports); // { name: 'Node.js' }
console.log("修改后 exports:", exports); // { name: 'Node.js' }
```

可以看到，修改 `exports` 会同时影响 `module.exports`，因为它们指向同一个对象。

## 正确使用 module.exports 和 exports

### 1. 使用 exports 添加属性

最常见的方式是使用 `exports` 给模块添加属性或方法：

```javascript
// utils.js
exports.add = function (a, b) {
    return a + b;
};

exports.subtract = function (a, b) {
    return a - b;
};

exports.PI = 3.14159;
```

在其他文件中使用：

```javascript
// app.js
const utils = require("./utils");
console.log(utils.add(2, 3)); // 5
console.log(utils.PI); // 3.14159
```

### 2. 使用 module.exports 导出整个对象

当你想要导出一个完整的对象时，应该使用 `module.exports`：

```javascript
// calculator.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

module.exports = {
    add: add,
    subtract: subtract,
    PI: 3.14159,
};
```

或者导出一个类：

```javascript
// Person.js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function () {
    return `Hello, I'm ${this.name}`;
};

module.exports = Person;
```

使用类：

```javascript
// app.js
const Person = require("./Person");
const person = new Person("Alice", 30);
console.log(person.greet()); // Hello, I'm Alice
```

### 3. 混合使用（推荐方式）

在同一个模块中，可以同时使用 `module.exports` 和 `exports`：

```javascript
// mixed.js
// 使用 exports 添加属性
exports.version = "1.0.0";
exports.author = "Developer";

// 使用 module.exports 导出主要功能
module.exports = {
    add: function (a, b) {
        return a + b;
    },
    multiply: function (a, b) {
        return a * b;
    },
};

// 注意：上面的 exports.version 和 exports.author 会被忽略
// 因为 module.exports 被重新赋值了
```

## 常见错误用法

### 错误 1：直接给 exports 赋值

```javascript
// wrong1.js
exports = {
    name: "Wrong Way",
    method: function () {
        return "This will not work";
    },
};
```

这种做法是错误的，因为这会改变 `exports` 的指向，但它不再是 `module.exports` 的引用了。当你在其他文件中 require 这个模块时，得到的是一个空对象 `{}`。

```javascript
// app.js
const wrong = require("./wrong1");
console.log(wrong); // {}
```

### 错误 2：混合使用时先重新赋值 module.exports

```javascript
// wrong2.js
exports.helper = "Helper function";

// 这会覆盖掉上面的 exports.helper
module.exports = function mainFunction() {
    return "Main function";
};
```

这种情况下，`exports.helper` 不会被导出，因为 `module.exports` 被重新赋值了。

## 最佳实践

### 1. 保持一致性

在一个模块中，尽量保持使用同一种方式导出：

```javascript
// 推荐：统一使用 module.exports
module.exports = {
    method1: function () {
        /* ... */
    },
    method2: function () {
        /* ... */
    },
    property: "value",
};
```

### 2. 导出类或构造函数时使用 module.exports

```javascript
// 推荐方式
function Database(url) {
    this.url = url;
}

Database.prototype.connect = function () {
    // 连接数据库的逻辑
};

module.exports = Database;
```

### 3. 导出单个函数时使用 module.exports

```javascript
// 推荐方式
module.exports = function greet(name) {
    return `Hello, ${name}!`;
};
```

### 4. 导出多个相关函数时使用 exports

```javascript
// 推荐方式
exports.add = function (a, b) {
    return a + b;
};
exports.subtract = function (a, b) {
    return a - b;
};
exports.multiply = function (a, b) {
    return a * b;
};
```

## 实际应用示例

让我们看一个更完整的示例，展示如何在实际项目中使用这些概念：

```javascript
// database.js
// 导出一个类
function Database(config) {
    this.host = config.host;
    this.port = config.port;
    this.name = config.name;
}

Database.prototype.connect = function () {
    console.log(`Connecting to ${this.host}:${this.port}/${this.name}`);
    // 实际的连接逻辑
};

Database.prototype.disconnect = function () {
    console.log("Disconnecting from database");
    // 实际的断开连接逻辑
};

// 导出类本身
module.exports = Database;

// 同时导出一些工具函数
exports.createConnection = function (config) {
    return new Database(config);
};
```

使用这个模块：

```javascript
// app.js
const Database = require("./database");
const { createConnection } = require("./database");

// 方式1：使用类
const db1 = new Database({
    host: "localhost",
    port: 5432,
    name: "mydb",
});

// 方式2：使用工具函数
const db2 = createConnection({
    host: "localhost",
    port: 5432,
    name: "mydb",
});
```

## 总结

理解 `module.exports` 和 `exports` 的关键点：

1. **关系**：`exports` 是 `module.exports` 的引用，就像 `var a = {}; var b = a;` 一样
2. **本质**：`require()` 返回的是 `module.exports`，而不是 `exports`
3. **使用建议**：
    - 导出多个属性或方法时，可以使用 `exports`
    - 导出类、构造函数或单一对象时，推荐使用 `module.exports`
    - 避免直接给 `exports` 赋值
    - 在同一模块中尽量保持导出方式的一致性

通过正确理解和使用 `module.exports` 和 `exports`，你可以更好地组织和导出 Node.js 模块，构建更加清晰和可维护的代码结构。

如果你想了解更多关于 JavaScript 模块系统的内容，可以阅读我们之前的文章 [JavaScript CommonJS 和 ES Module 理解与应用](./js之commonjs和es-module理解.md)。
