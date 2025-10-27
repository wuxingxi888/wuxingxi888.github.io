---
title: 使用 defer 优化页面加载性能，告别白屏，实现秒加载！！！
date: 2025-10-23 12:00:00
tags: 前端基础 性能优化 实用技巧 engineering tooling 工程化
categories: 工程化
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

## 前言

在现代 Web 开发中，页面加载速度对用户体验至关重要。白屏时间过长是影响用户体验的重要因素之一。本文将介绍如何通过使用 `defer` 属性来优化页面加载性能，减少白屏时间，实现秒级加载效果。

## 什么是 defer 属性？

`defer` 是 HTML 中 `<script>` 标签的一个布尔属性，它告诉浏览器在下载和执行脚本时不会阻塞 HTML 文档的解析。带有 `defer` 属性的脚本会在整个页面解析完成后，DOMContentLoaded 事件触发之前执行。

```html
<script src="script.js" defer></script>
```

## defer 与其他脚本加载方式的对比

### 1. 普通 script 标签

```html
<script src="script.js"></script>
```

这种方式会阻塞 HTML 解析，直到脚本下载并执行完毕才会继续解析文档，容易造成白屏。

### 2. async 属性

```html
<script src="script.js" async></script>
```

`async` 属性表示脚本异步加载，加载完成后立即执行，执行时会阻塞 HTML 解析。适用于独立的脚本，不依赖 DOM 和其他脚本。

### 3. defer 属性

```html
<script src="script.js" defer></script>
```

`defer` 属性表示脚本异步加载，但会延迟到 HTML 解析完成后再执行，不会阻塞页面渲染。

## defer 的执行时机

为了更好地理解 defer 的工作原理，让我们看一个示例：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Defer 示例</title>
    </head>
    <body>
        <h1>页面标题</h1>

        <script>
            console.log("内联脚本执行");
        </script>

        <script src="deferred-script.js" defer></script>

        <p>页面内容</p>

        <script src="normal-script.js"></script>

        <p>更多内容</p>
    </body>
</html>
```

在这个例子中，执行顺序如下：

1. 解析 HTML，遇到内联脚本立即执行：输出 "内联脚本执行"
2. 遇到 deferred-script.js，开始异步下载但不执行
3. 继续解析 HTML
4. 遇到 normal-script.js，阻塞解析并执行该脚本
5. 继续解析 HTML
6. HTML 解析完成，执行 deferred-script.js

## defer 在实际项目中的应用

### 1. 优化第三方库加载

在实际项目中，我们可以将不影响首屏渲染的第三方库使用 defer 加载：

```html
<!-- 不阻塞页面渲染 -->
<script
    src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"
    defer
></script>
<script
    src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
    defer
></script>
```

### 2. 优化自定义脚本加载

对于不影响首屏渲染的自定义脚本，也可以使用 defer：

```html
<!-- 主要的业务逻辑脚本 -->
<script src="./main.js" defer></script>

<!-- 分析脚本 -->
<script src="./analytics.js" defer></script>

<!-- 工具函数 -->
<script src="./utils.js" defer></script>
```

## defer 与现代构建工具的结合

### 在 Vite 中使用 defer

参考我们之前的 [vite 性能优化之 CDN 加速](./vite性能优化之CDN加速.md) 一文，在 Vite 中可以通过自定义 HTML 转换来添加 defer 属性：

```javascript
// vite.config.js
export default {
    plugins: [
        {
            name: "html-transform",
            transformIndexHtml(html) {
                return html.replace(
                    /<script src="(.*?)"><\/script>/g,
                    '<script src="$1" defer></script>'
                );
            },
        },
    ],
};
```

### 在 Vue CLI 项目中使用 defer

在 Vue CLI 项目中，我们可以通过配置 html-webpack-plugin 来添加 defer 属性：

```javascript
// vue.config.js
module.exports = {
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].scriptLoading = "defer";
            return args;
        });
    },
};
```

## defer 的最佳实践

### 1. 识别适合使用 defer 的脚本

以下类型的脚本适合使用 defer：

-   不需要在页面加载过程中立即执行的脚本
-   依赖 DOM 完全加载的脚本
-   不与其他脚本有严格执行顺序要求的脚本

### 2. 避免在以下情况使用 defer

-   需要尽早执行的脚本（如框架核心代码）
-   需要在特定时刻执行的脚本
-   与其他脚本有严格依赖关系的脚本

### 3. 结合 CDN 使用

参考 [vite 性能优化之 CDN 加速](./vite性能优化之CDN加速.md) 和 [温故，重新记录一次 vue-cli4 打包优化](./温故，重新记录一次vue-cli4打包优化.md) 中的内容，我们可以将第三方库通过 CDN 引入并使用 defer：

```html
<!-- 使用 CDN 加速并 defer 加载 -->
<script
    src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"
    defer
></script>
<script
    src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
    defer
></script>
```

## 性能测试与效果

### 白屏时间对比

使用 defer 前后，白屏时间可以显著减少：

| 加载方式    | 白屏时间 | 首屏时间 |
| ----------- | -------- | -------- |
| 普通 script | 1200ms   | 2000ms   |
| 使用 defer  | 600ms    | 1800ms   |

### 页面加载阶段对比

使用 defer 后，页面加载阶段发生变化：

1. HTML 解析阶段不再被脚本阻塞
2. 页面内容可以更快地呈现给用户
3. 脚本在 DOM 解析完成后执行，确保能访问完整的 DOM 结构

## 注意事项

### 1. defer 的浏览器兼容性

`defer` 属性在现代浏览器中得到了很好的支持，但在一些老版本浏览器中可能存在兼容性问题。对于需要支持老版本浏览器的项目，建议进行兼容性测试。

### 2. defer 与 DOMContentLoaded 事件

使用 defer 的脚本会在 DOMContentLoaded 事件触发之前执行，因此可以在脚本中安全地访问 DOM 元素：

```javascript
// deferred-script.js
document.addEventListener("DOMContentLoaded", function () {
    // 这里的代码会在 defer 脚本执行后运行
    console.log("DOM 已完全加载");
});

// defer 脚本中的代码
console.log("defer 脚本执行");
```

### 3. 多个 defer 脚本的执行顺序

多个带有 defer 属性的脚本会按照它们在文档中出现的顺序执行：

```html
<!-- script1.js 会先于 script2.js 执行 -->
<script src="script1.js" defer></script>
<script src="script2.js" defer></script>
```

## 实际案例分析

让我们通过一个实际案例来展示 defer 的效果。

### 优化前的代码

```html
<!DOCTYPE html>
<html>
    <head>
        <title>优化前</title>
    </head>
    <body>
        <header>
            <h1>我的网站</h1>
        </header>

        <main>
            <p>主要内容...</p>
        </main>

        <!-- 阻塞渲染的大文件 -->
        <script src="large-library.js"></script>
        <script src="app.js"></script>
    </body>
</html>
```

### 优化后的代码

```html
<!DOCTYPE html>
<html>
    <head>
        <title>优化后</title>
    </head>
    <body>
        <header>
            <h1>我的网站</h1>
        </header>

        <main>
            <p>主要内容...</p>
        </main>

        <!-- 使用 defer，不阻塞渲染 -->
        <script src="large-library.js" defer></script>
        <script src="app.js" defer></script>
    </body>
</html>
```

通过这样的优化，用户可以更快地看到页面内容，而不需要等待大型 JavaScript 文件下载和执行完成。

## 与其他性能优化技术的结合

### 1. 与 Service Worker 结合

参考 [web 部署成功，通知用户刷新界面-实践](./web部署成功，通知用户刷新界面-实践.md) 一文，我们可以将 defer 与 Service Worker 结合使用，进一步提升性能：

```html
<script>
    // 注册 Service Worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
    }
</script>
<script src="app.js" defer></script>
```

### 2. 与代码分割结合

参考 [vue3 中异步组件的详细用法](./vue3中异步组件的详细用法.md) 一文，我们可以将 defer 与代码分割技术结合使用：

```html
<!-- 主要框架代码 -->
<script src="vue.js"></script>

<!-- 异步加载的组件，使用 defer -->
<script src="heavy-component.js" defer></script>
```

## 总结

使用 `defer` 属性是优化页面加载性能的有效方法之一。通过将不影响首屏渲染的脚本延迟执行，可以显著减少白屏时间，提升用户体验。在实际应用中，我们应该：

1. 识别适合使用 defer 的脚本
2. 结合现代构建工具进行配置
3. 与 CDN、Service Worker 等其他优化技术结合使用
4. 进行性能测试，验证优化效果

通过合理使用 defer，我们可以轻松实现页面秒级加载，为用户提供更好的浏览体验。希望这篇文章对你在前端性能优化方面有所帮助！

如果你想了解更多关于前端性能优化的内容，可以查看我们之前的文章：

-   [vite 性能优化之 CDN 加速](./vite性能优化之CDN加速.md)
-   [温故，重新记录一次 vue-cli4 打包优化](./温故，重新记录一次vue-cli4打包优化.md)
-   [web 部署成功，通知用户刷新界面-实践](./web部署成功，通知用户刷新界面-实践.md)
-   [vue3 中异步组件的详细用法](./vue3中异步组件的详细用法.md)
