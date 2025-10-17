---
title: JavaScript async/await 理解与应用
date: 2025-3-17 15:20:00
tags: javascript 前端基础 async await 异步编程
categories: 前端基础
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---

## 前言

在上一篇文章中，我们详细介绍了 [Promise 的原理和应用](./js之promise理解.md)。Promise 的出现大大改善了 JavaScript 异步编程的体验，但仍然存在一些不足。ES2017 引入的 async/await 语法进一步简化了异步代码的编写，使异步代码看起来更像是同步代码。本文将深入探讨 async/await 的原理、与 Promise 的区别、使用场景以及它解决了哪些问题。

## 什么是 async/await

async/await 是 JavaScript 中处理异步操作的一种语法糖，建立在 Promise 的基础之上。它可以让异步代码看起来像同步代码，提高代码的可读性和可维护性。

-   **async**：用于声明一个函数是异步的，async 函数会返回一个 Promise 对象
-   **await**：用于等待一个 Promise 对象的解决，只能在 async 函数内部使用

## async/await 的基本语法

```javascript
// 声明一个 async 函数
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("获取数据失败:", error);
        throw error;
    }
}

// 调用 async 函数
fetchData().then((data) => {
    console.log(data);
});
```

## async/await 的本质

正如题目所言，async/await 本质上还是返回 Promise。当我们声明一个 async 函数时，该函数会自动返回一个 Promise 对象：

```javascript
async function asyncFunc() {
    return "hello";
}

// 等价于
function asyncFunc() {
    return Promise.resolve("hello");
}

// 调用方式相同
asyncFunc().then((result) => {
    console.log(result); // 'hello'
});
```

await 关键字会等待 Promise 对象解决，并返回其结果值：

```javascript
async function example() {
    const promise = new Promise((resolve) => {
        setTimeout(() => resolve("resolved!"), 1000);
    });

    const result = await promise; // 等待 promise 解决
    console.log(result); // 'resolved!'
    return result;
}
```

## async/await 与 Promise 的区别

### 1. 语法简洁性

使用 Promise：

```javascript
function fetchUserData() {
    return fetch("/api/user")
        .then((response) => response.json())
        .then((user) => {
            return fetch(`/api/posts/${user.id}`)
                .then((response) => response.json())
                .then((posts) => {
                    return { user, posts };
                });
        })
        .catch((error) => {
            console.error("Error:", error);
            throw error;
        });
}
```

使用 async/await：

```javascript
async function fetchUserData() {
    try {
        const response = await fetch("/api/user");
        const user = await response.json();
        const postsResponse = await fetch(`/api/posts/${user.id}`);
        const posts = await postsResponse.json();
        return { user, posts };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
```

### 2. 错误处理方式

Promise 使用 `.catch()` 或在 `.then()` 中的第二个参数处理错误：

```javascript
fetch("/api/data")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
```

async/await 使用 try/catch 语句处理错误，更符合同步代码的错误处理习惯：

```javascript
async function fetchData() {
    try {
        const response = await fetch("/api/data");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}
```

### 3. 条件逻辑处理

在 Promise 中处理条件逻辑比较复杂：

```javascript
function conditionalFetch(useCache) {
    if (useCache) {
        return getFromCache().then((data) => {
            if (data) {
                return data;
            }
            return fetch("/api/data").then((res) => res.json());
        });
    } else {
        return fetch("/api/data").then((res) => res.json());
    }
}
```

使用 async/await 处理条件逻辑更加直观：

```javascript
async function conditionalFetch(useCache) {
    if (useCache) {
        const cachedData = await getFromCache();
        if (cachedData) {
            return cachedData;
        }
    }

    const response = await fetch("/api/data");
    return response.json();
}
```

## async/await 的使用场景

### 1. 串行异步操作

当需要按顺序执行多个异步操作时，async/await 使代码更加清晰：

```javascript
async function processUserData() {
    try {
        // 步骤1：获取用户信息
        const userResponse = await fetch("/api/user");
        const user = await userResponse.json();

        // 步骤2：获取用户订单
        const ordersResponse = await fetch(`/api/orders/${user.id}`);
        const orders = await ordersResponse.json();

        // 步骤3：获取订单详情
        const orderDetails = [];
        for (const order of orders) {
            const detailResponse = await fetch(
                `/api/order-details/${order.id}`
            );
            const detail = await detailResponse.json();
            orderDetails.push(detail);
        }

        return { user, orders, orderDetails };
    } catch (error) {
        console.error("处理用户数据失败:", error);
        throw error;
    }
}
```

### 2. 并行异步操作

虽然 async/await 默认是串行执行，但我们可以通过 `Promise.all()` 实现并行执行：

```javascript
async function fetchMultipleData() {
    try {
        // 并行获取多个数据
        const [users, posts, comments] = await Promise.all([
            fetch("/api/users").then((res) => res.json()),
            fetch("/api/posts").then((res) => res.json()),
            fetch("/api/comments").then((res) => res.json()),
        ]);

        return { users, posts, comments };
    } catch (error) {
        console.error("获取数据失败:", error);
        throw error;
    }
}
```

### 3. 循环中的异步操作

在循环中处理异步操作时，async/await 提供了更直观的方式：

```javascript
async function processItems(items) {
    const results = [];

    // 串行处理
    for (const item of items) {
        try {
            const result = await processItem(item);
            results.push(result);
        } catch (error) {
            console.error(`处理项目 ${item.id} 失败:`, error);
            results.push(null);
        }
    }

    return results;
}

async function processItemsParallel(items) {
    // 并行处理
    const promises = items.map((item) => processItem(item));
    const results = await Promise.allSettled(promises);

    return results.map((result) =>
        result.status === "fulfilled" ? result.value : null
    );
}
```

## async/await 解决了哪些问题

### 1. 回调地狱问题

async/await 进一步改善了 Promise 解决的回调地狱问题，使代码更加线性化：

```javascript
// 使用 async/await
async function complexOperation() {
    try {
        const step1Result = await step1();
        const step2Result = await step2(step1Result);
        const step3Result = await step3(step2Result);
        const step4Result = await step4(step3Result);

        return step4Result;
    } catch (error) {
        console.error("操作失败:", error);
        throw error;
    }
}
```

### 2. 更好的调试体验

使用 async/await 的代码在调试时更容易理解，因为代码执行顺序与编写顺序一致：

```javascript
async function debugExample() {
    console.log("步骤1");
    const data = await fetchData();
    console.log("步骤2", data);
    const processed = await processData(data);
    console.log("步骤3", processed);
    return processed;
}
```

### 3. 统一的错误处理

async/await 允许使用 try/catch 统一处理同步和异步错误：

```javascript
async function unifiedErrorHandling() {
    try {
        // 同步代码错误
        const data = JSON.parse(invalidJsonString);

        // 异步操作错误
        const response = await fetch("/api/data");
        const result = await response.json();

        return result;
    } catch (error) {
        // 统一处理所有错误
        console.error("操作失败:", error);
        throw error;
    }
}
```

## async/await 的注意事项

### 1. await 只能在 async 函数中使用

```javascript
// 错误示例
function badExample() {
  const data = await fetch('/api/data'); // SyntaxError
  return data;
}

// 正确示例
async function goodExample() {
  const data = await fetch('/api/data');
  return data;
}
```

### 2. 注意并行与串行的性能差异

```javascript
// 串行执行，较慢
async function serialExecution() {
    const result1 = await fetch("/api/data1");
    const result2 = await fetch("/api/data2");
    const result3 = await fetch("/api/data3");
    return [result1, result2, result3];
}

// 并行执行，更快
async function parallelExecution() {
    const [result1, result2, result3] = await Promise.all([
        fetch("/api/data1"),
        fetch("/api/data2"),
        fetch("/api/data3"),
    ]);
    return [result1, result2, result3];
}
```

## 总结

async/await 作为 Promise 的语法糖，进一步简化了 JavaScript 异步编程。它本质上仍然基于 Promise，但提供了更直观、更易读的语法。相比 Promise，async/await 在以下方面具有优势：

1. **语法更简洁**：避免了链式调用，使代码更接近同步代码的写法
2. **错误处理更直观**：可以使用熟悉的 try/catch 语法
3. **调试更方便**：代码执行顺序与编写顺序一致
4. **条件逻辑更清晰**：处理复杂的条件分支更加容易

然而，需要注意的是 async/await 默认是串行执行的，在需要并行执行异步操作时，仍需结合 `Promise.all()` 等方法使用。

通过合理使用 async/await，我们可以编写出更加清晰、易维护的异步代码，提高开发效率和代码质量。在实际开发中，应该根据具体场景选择合适的异步处理方式，充分发挥 async/await 和 Promise 各自的优势。

如果你对 Promise 还不够熟悉，建议先阅读我之前的文章 [JavaScript Promise 理解与应用](./js之promise理解.md)，这将有助于更好地理解 async/await 的原理和应用。
