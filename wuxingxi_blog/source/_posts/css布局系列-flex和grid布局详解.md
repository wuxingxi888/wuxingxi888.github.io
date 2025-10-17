---
title: CSS布局系列：Flex 和 Grid 布局详解
date: 2022-10-17 16:30:00
tags: css 布局 flex grid 前端基础
categories: 前端基础
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/css.jpeg"
---

## 前言

在现代前端开发中，CSS 布局是构建网页界面的基础技能。随着 Web 技术的发展，CSS 布局方式也经历了从传统的浮动布局、定位布局到现代的 Flexbox 和 Grid 布局的演进。这两种现代布局方式极大地简化了复杂布局的实现，提供了更直观、更强大的布局能力。

在之前的[CSS 基础温故](./css基础温故.md)一文中，我们简单介绍了几种常见的布局方式，本文将深入探讨 Flexbox 和 Grid 这两种现代布局方式的各种参数和使用场景。

## Flexbox 布局

Flexbox（弹性盒子布局）是一维布局模型，旨在提供一种更加有效的方式来布局、对齐和分配容器中项目之间的空间，即使它们的大小是未知的或动态的。

### 基本概念

Flexbox 布局由两个主要组件构成：

1. **Flex 容器（Flex Container）**：通过设置`display: flex`或`display: inline-flex`创建
2. **Flex 项目（Flex Items）**：Flex 容器的直接子元素

### Flex 容器属性

#### 1. display

```css
.container {
    display: flex; /* 或 inline-flex */
}
```

#### 2. flex-direction

定义主轴方向（项目的排列方向）：

```css
.container {
    flex-direction: row | row-reverse | column | column-reverse;
}
```

-   `row`（默认值）：主轴为水平方向，起点在左端
-   `row-reverse`：主轴为水平方向，起点在右端
-   `column`：主轴为垂直方向，起点在上沿
-   `column-reverse`：主轴为垂直方向，起点在下沿

#### 3. flex-wrap

定义项目是否换行：

```css
.container {
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```

-   `nowrap`（默认值）：不换行
-   `wrap`：换行，第一行在上方
-   `wrap-reverse`：换行，第一行在下方

#### 4. flex-flow

`flex-direction`和`flex-wrap`的简写形式：

```css
.container {
    flex-flow: <flex-direction> || <flex-wrap>;
}
```

#### 5. justify-content

定义项目在主轴上的对齐方式：

```css
.container {
    justify-content: flex-start | flex-end | center | space-between |
        space-around | space-evenly;
}
```

#### 6. align-items

定义项目在交叉轴上的对齐方式：

```css
.container {
    align-items: stretch | flex-start | flex-end | center | baseline;
}
```

#### 7. align-content

定义多行项目在交叉轴上的对齐方式（只在多行时有效）：

```css
.container {
    align-content: flex-start | flex-end | center | space-between | space-around
        | stretch;
}
```

### Flex 项目属性

#### 1. order

定义项目的排列顺序，数值越小，排列越靠前，默认为 0：

```css
.item {
    order: <integer>;
}
```

#### 2. flex-grow

定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大：

```css
.item {
    flex-grow: <number>; /* 默认 0 */
}
```

#### 3. flex-shrink

定义项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小：

```css
.item {
    flex-shrink: <number>; /* 默认 1 */
}
```

#### 4. flex-basis

定义在分配多余空间之前，项目占据的主轴空间：

```css
.item {
    flex-basis: <length> | auto; /* 默认 auto */
}
```

#### 5. flex

`flex-grow`, `flex-shrink`和`flex-basis`的简写，默认值为`0 1 auto`：

```css
.item {
    flex: none | [ < "flex-grow" > < "flex-shrink" >? || < "flex-basis" >];
}
```

#### 6. align-self

允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性：

```css
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### Flex 布局使用场景

1. **导航栏布局**：

```html
<nav class="navbar">
    <div class="logo">Logo</div>
    <ul class="nav-links">
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
    </ul>
    <div class="nav-button">Sign Up</div>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}

.nav-links {
    display: flex;
    list-style: none;
}

.nav-links li {
    margin: 0 1rem;
}
```

2. **卡片布局**：

```html
<div class="card-container">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>
```

```css
.card-container {
    display: flex;
    gap: 1rem;
}

.card {
    flex: 1;
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 4px;
}
```

## Grid 布局

CSS Grid 布局是二维布局系统，可以同时控制行和列，用于创建复杂的网页布局。

### 基本概念

Grid 布局同样由两个主要组件构成：

1. **Grid 容器（Grid Container）**：通过设置`display: grid`或`display: inline-grid`创建
2. **Grid 项目（Grid Items）**：Grid 容器的直接子元素

### Grid 容器属性

#### 1. display

```css
.container {
    display: grid | inline-grid;
}
```

#### 2. grid-template-columns 和 grid-template-rows

定义网格的列和行：

```css
.container {
    grid-template-columns: <track-size> ... | <line-name> <track-size> ...;
    grid-template-rows: <track-size> ... | <line-name> <track-size> ...;
}
```

示例：

```css
.container {
    display: grid;
    grid-template-columns: 100px 1fr 2fr;
    grid-template-rows: 50px 100px;
}
```

#### 3. grid-template-areas

通过指定区域来定义网格模板：

```css
.container {
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
}
```

#### 4. grid-template

`grid-template-rows`、`grid-template-columns`和`grid-template-areas`的简写：

```css
.container {
    grid-template: none | <grid-template-rows> / <grid-template-columns>;
}
```

#### 5. grid-column-gap 和 grid-row-gap

定义网格线的大小：

```css
.container {
    grid-column-gap: <line-size>;
    grid-row-gap: <line-size>;
}
```

#### 6. grid-gap

`grid-row-gap`和`grid-column-gap`的简写：

```css
.container {
    grid-gap: <grid-row-gap> <grid-column-gap>;
}
```

#### 7. justify-items

设置网格元素在单元格内沿列轴方向的对齐方式：

```css
.container {
    justify-items: start | end | center | stretch;
}
```

#### 8. align-items

设置网格元素在单元格内沿行轴方向的对齐方式：

```css
.container {
    align-items: start | end | center | stretch;
}
```

#### 9. justify-content

设置整个网格在容器内沿列轴方向的对齐方式：

```css
.container {
    justify-content: start | end | center | stretch | space-around |
        space-between | space-evenly;
}
```

#### 10. align-content

设置整个网格在容器内沿行轴方向的对齐方式：

```css
.container {
    align-content: start | end | center | stretch | space-around | space-between
        | space-evenly;
}
```

#### 11. grid-auto-columns 和 grid-auto-rows

指定自动生成的隐式网格轨道的大小：

```css
.container {
    grid-auto-columns: <track-size>;
    grid-auto-rows: <track-size>;
}
```

#### 12. grid-auto-flow

控制自动放置算法如何工作：

```css
.container {
    grid-auto-flow: row | column | row dense | column dense;
}
```

### Grid 项目属性

#### 1. grid-column-start、grid-column-end、grid-row-start、grid-row-end

通过网格线来确定项目的位置：

```css
.item {
    grid-column-start: <number> | <name>;
    grid-column-end: <number> | <name>;
    grid-row-start: <number> | <name>;
    grid-row-end: <number> | <name>;
}
```

#### 2. grid-column 和 grid-row

`grid-column-start`、`grid-column-end`和`grid-row-start`、`grid-row-end`的简写：

```css
.item {
    grid-column: <start-line> / <end-line> | <start-line> / span <value>;
    grid-row: <start-line> / <end-line> | <start-line> / span <value>;
}
```

#### 3. grid-area

`grid-row-start`、`grid-column-start`、`grid-row-end`和`grid-column-end`的简写：

```css
.item {
    grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

#### 4. justify-self

设置单个网格元素在单元格内沿列轴方向的对齐方式：

```css
.item {
    justify-self: start | end | center | stretch;
}
```

#### 5. align-self

设置单个网格元素在单元格内沿行轴方向的对齐方式：

```css
.item {
    align-self: start | end | center | stretch;
}
```

### Grid 布局使用场景

1. **整体页面布局**：

```html
<div class="page">
    <header>Header</header>
    <aside>Sidebar</aside>
    <main>Main Content</main>
    <footer>Footer</footer>
</div>
```

```css
.page {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    height: 100vh;
    gap: 10px;
}

header {
    grid-area: header;
}

aside {
    grid-area: sidebar;
}

main {
    grid-area: main;
}

footer {
    grid-area: footer;
}
```

2. **图片画廊布局**：

```html
<div class="gallery">
    <img src="image1.jpg" alt="Image 1" />
    <img src="image2.jpg" alt="Image 2" />
    <img src="image3.jpg" alt="Image 3" />
    <img src="image4.jpg" alt="Image 4" />
</div>
```

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.gallery img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
```

## Flex 和 Grid 的对比

| 特性     | Flexbox                        | Grid                               |
| -------- | ------------------------------ | ---------------------------------- |
| 维度     | 一维（行或列）                 | 二维（行和列）                     |
| 适用场景 | 一维布局（导航栏、卡片排列等） | 二维布局（整体页面布局、复杂网格） |
| 对齐能力 | 主轴和交叉轴对齐               | 行、列和单元格对齐                 |
| 响应式   | 适合简单响应式布局             | 强大的响应式网格系统               |
| 学习曲线 | 相对简单                       | 稍复杂但功能更强大                 |

## 实用工具推荐

### Grid 布局在线工具

-   [CSS Grid Generator](https://cssgrid-generator.netlify.app/) - 可视化生成 Grid 布局代码

### Flexbox 布局在线工具

-   [Flexbox Playground](https://codepen.io/enxaneta/full/adLPwv) - Flexbox 属性可视化调试工具
-   [Flexbox Froggy](https://flexboxfroggy.com/) - 通过游戏学习 Flexbox 的互动教程
-   [Flexbox Defense](http://www.flexboxdefense.com/) - 另一个通过游戏学习 Flexbox 的工具

## 总结

Flexbox 和 Grid 是现代 CSS 布局的两大利器：

1. **Flexbox**适用于一维布局，特别适合处理项目在主轴上的分布和对齐，如导航栏、工具栏、卡片排列等。

2. **Grid**适用于二维布局，能够同时控制行和列，适合构建整体页面布局、复杂网格系统等。

在实际开发中，可以根据具体需求选择合适的布局方式，甚至可以结合使用两者，发挥各自的优势。掌握这两种布局方式对于现代前端开发来说是必不可少的技能。

如果你想回顾其他 CSS 布局方式，可以查看我们之前的文章[CSS 基础温故](./css基础温故.md)。
