---
title: JavaScript CommonJS 和 ES Module 理解与应用
date: 2023-04-30 23:40:00
tags: javascript 前端基础 commonjs es6 模块化
categories: 前端基础
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---

## 前言

在现代 JavaScript 开发中，模块化是组织代码的重要方式。随着 JavaScript 生态的发展，出现了多种模块系统，其中 CommonJS 和 ES Module 是最为重要的两种。CommonJS 主要用于 Node.js 环境，而 ES Module 是 ECMAScript 官方标准的模块系统，逐渐在浏览器和 Node.js 中得到广泛支持。本文将深入探讨这两种模块系统的区别、使用场景以及它们解决了哪些问题。

## 什么是 CommonJS

CommonJS 是 Node.js 中默认的模块系统，它是一种同步的模块加载机制。在 CommonJS 中，每个文件都是一个模块，具有独立的作用域。通过 `require()` 函数导入模块，通过 `module.exports` 或 `exports` 导出模块。

### CommonJS 基本语法

```javascript
// math.js - 导出模块
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

// 方式1：使用 module.exports
module.exports = {
    add,
    subtract,
};

// 方式2：直接添加到 exports 对象
// exports.add = add;
// exports.subtract = subtract;
```

```javascript
// app.js - 导入模块
const math = require("./math");
console.log(math.add(2, 3)); // 5

// 或者使用解构赋值
const { add, subtract } = require("./math");
console.log(add(2, 3)); // 5
```

## 什么是 ES Module

ES Module（ESM）是 ECMAScript 6 引入的官方模块系统，它是一种异步的模块加载机制。ES Module 使用 `import` 和 `export` 关键字来导入和导出模块。

### ES Module 基本语法

```javascript
// math.js - 导出模块
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

// 默认导出
export default function multiply(a, b) {
    return a * b;
}
```

```javascript
// app.js - 导入模块
import multiply, { add, subtract } from "./math.js";
console.log(add(2, 3)); // 5
console.log(multiply(2, 3)); // 6

// 或者导入所有内容
import * as math from "./math.js";
console.log(math.add(2, 3)); // 5
```

## CommonJS 和 ES Module 的主要区别

### 1. 加载方式

**CommonJS** 是同步加载模块的，这意味着模块在代码执行时立即加载和执行：

```javascript
// CommonJS - 同步加载
const fs = require("fs");
const lodash = require("lodash");
console.log("模块已加载");
```

**ES Module** 是异步加载模块的，支持静态分析和 tree-shaking：

```javascript
// ES Module - 异步加载
import fs from "fs";
import lodash from "lodash";
console.log("模块已加载");
```

### 2. 导入导出语法

**CommonJS** 使用 `require()` 和 `module.exports`：

```javascript
// 导出
module.exports = {
    name: "Module Name",
    method: function () {},
};

// 导入
const myModule = require("./myModule");
```

**ES Module** 使用 `import` 和 `export`：

```javascript
// 导出
export const name = "Module Name";
export function method() {}

// 或者默认导出
export default class MyClass {}

// 导入
import { name, method } from "./myModule";
import MyClass from "./myModule";
```

### 3. 值的拷贝 vs 引用

**CommonJS** 导出的是值的拷贝：

```javascript
// counter.js
let count = 0;
function increment() {
    count++;
}
module.exports = {
    count,
    increment,
};

// main.js
const counter = require("./counter");
counter.increment();
console.log(counter.count); // 0 - 仍然是原始值的拷贝
```

**ES Module** 导出的是值的引用：

```javascript
// counter.js
export let count = 0;
export function increment() {
    count++;
}

// main.js
import { count, increment } from "./counter";
increment();
console.log(count); // 1 - 是原始值的引用
```

### 4. this 指向

**CommonJS** 中，顶层的 `this` 指向 `module.exports`：

```javascript
// CommonJS 模块
console.log(this === module.exports); // true
```

**ES Module** 中，顶层的 `this` 是 `undefined`：

```javascript
// ES Module
console.log(this); // undefined
```

### 5. 循环依赖处理

**CommonJS** 的循环依赖处理：

```javascript
// a.js
console.log("a 开始");
exports.done = false;
const b = require("./b.js");
console.log("在 a 中，b.done = %j", b.done);
exports.done = true;
console.log("a 结束");

// b.js
console.log("b 开始");
exports.done = false;
const a = require("./a.js");
console.log("在 b 中，a.done = %j", a.done);
exports.done = true;
console.log("b 结束");

// main.js
console.log("main 开始");
const a = require("./a.js");
const b = require("./b.js");
console.log("在 main 中，a.done=%j，b.done=%j", a.done, b.done);
```

输出结果：

```
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true，b.done=true
```

**ES Module** 的循环依赖处理：

```javascript
// a.js
import { done as bDone } from "./b.js";
console.log("a 开始");
export let done = false;
console.log("在 a 中，b.done = %j", bDone);
done = true;
console.log("a 结束");

// b.js
import { done as aDone } from "./a.js";
console.log("b 开始");
export let done = false;
console.log("在 b 中，a.done = %j", aDone);
done = true;
console.log("b 结束");
```

由于 ES Module 的静态特性，这种循环依赖会导致错误。

## 使用场景

### CommonJS 适用场景

1. **Node.js 服务端开发**：

```javascript
// Node.js 服务端代码
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
```

2. **动态模块加载**：

```javascript
// 根据条件动态加载模块
function loadModule(moduleName) {
    if (process.env.NODE_ENV === "development") {
        return require(`./dev/${moduleName}`);
    } else {
        return require(`./prod/${moduleName}`);
    }
}
```

### ES Module 适用场景

1. **现代浏览器开发**：

```javascript
// 浏览器中的模块
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
```

2. **需要 Tree-shaking 的库开发**：

```javascript
// utils.js
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export function unusedFunction() {
    // 这个函数如果没有被导入使用，会在构建时被移除
    return "unused";
}
```

```javascript
// main.js - 只导入需要的函数
import { add } from "./utils.js";
console.log(add(1, 2)); // multiply 和 unusedFunction 会被 tree-shaking 移除
```

## 解决的问题

### 1. 代码组织和复用

在没有模块系统之前，JavaScript 代码组织困难，容易产生全局变量污染：

```javascript
// 没有模块系统时的代码组织
var myApp = {
    utils: {
        add: function (a, b) {
            return a + b;
        },
        subtract: function (a, b) {
            return a - b;
        },
    },
    components: {
        button: function (text) {
            return "<button>" + text + "</button>";
        },
    },
};
```

使用模块系统后，代码更加清晰和可维护：

```javascript
// utils.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

// components/button.js
export default function button(text) {
    return `<button>${text}</button>`;
}

// main.js
import { add, subtract } from "./utils.js";
import button from "./components/button.js";
```

### 2. 命名空间冲突

模块系统解决了全局命名空间污染问题：

```javascript
// 以前可能出现的冲突
// file1.js
var config = { apiUrl: "http://api1.com" };

// file2.js
var config = { apiUrl: "http://api2.com" }; // 覆盖了 file1 的 config
```

使用模块系统后，每个模块都有独立的作用域：

```javascript
// config1.js
export default { apiUrl: 'http://api1.com' };

// config2.js
export default { apiUrl: 'http://api2.com' };

// main.js
import config1 from './config1.js';
import config2 from './config2.js';
// 两者互不干扰
```

### 3. 依赖管理

模块系统提供了清晰的依赖关系：

```javascript
// user-service.js
import { apiClient } from "./api-client.js";
import { logger } from "./logger.js";

export class UserService {
    async getUser(id) {
        try {
            const user = await apiClient.get(`/users/${id}`);
            logger.info(`获取用户 ${id} 成功`);
            return user;
        } catch (error) {
            logger.error(`获取用户 ${id} 失败`, error);
            throw error;
        }
    }
}
```

## 在实际项目中的应用

### Node.js 中使用 ES Module

从 Node.js 12 开始，可以通过以下方式使用 ES Module：

1. 在 package.json 中添加 `"type": "module"`：

```json
{
    "name": "my-app",
    "type": "module",
    "main": "index.js"
}
```

2. 或者使用 .mjs 文件扩展名：

```javascript
// app.mjs
import fs from "fs";
import { add } from "./math.mjs";

console.log(add(2, 3));
```

### 构建工具中的模块转换

现代构建工具如 Webpack、Rollup 等可以处理不同模块系统之间的转换：

```javascript
// webpack.config.js
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
```

## 总结

CommonJS 和 ES Module 各有优势，适用于不同的场景：

1. **CommonJS**：

    - 适用于 Node.js 服务端开发
    - 支持动态加载模块
    - 语法简单直观
    - 值拷贝，避免意外修改

2. **ES Module**：
    - 是 ECMAScript 官方标准
    - 支持静态分析和 tree-shaking
    - 支持异步加载
    - 值引用，便于状态共享
    - 更好的循环依赖处理

在实际开发中，我们应该根据项目需求和运行环境选择合适的模块系统。随着 JavaScript 生态的发展，ES Module 正在成为主流，但在 Node.js 环境中，CommonJS 仍然有其不可替代的价值。

理解这两种模块系统的差异和适用场景，有助于我们更好地组织代码结构，提高代码的可维护性和可复用性。
