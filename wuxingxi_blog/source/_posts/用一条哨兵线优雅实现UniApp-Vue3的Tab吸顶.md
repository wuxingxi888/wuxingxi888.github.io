---
title: 用一条哨兵线优雅实现 UniApp/Vue3 的 Tab 吸顶（告别 scroll 监听）
date: 2025-12-28 20:58:00
tags: uniapp vue3 IntersectionObserver 吸顶 前端框架
top_img:
categories: 前端框架
cover: https://cdn.jsdelivr.net/gh/wuxingxi888/CDN_IMG_BED/uniapp_banner.webp
---

## 前言：吸顶交互为什么总是写得又复杂又不稳？

在移动端（尤其是 UniApp 多端）做 Tab 吸顶，经常会遇到这些痛点：

-   状态判断难：什么时候进入吸顶？什么时候退出？临界点经常抖动或算不准
-   临界值难算：导航栏高度、状态栏安全区、不同机型差异，导致 `scrollTop` 阈值到处写魔法数
-   性能与维护差：`onPageScroll / scroll` 高频触发，回调里反复计算元素位置，逻辑越写越“重”

更好的思路是：不用监听滚动，不用自己算临界点，让浏览器/小程序引擎帮我们判断“某个元素是否越过了一条线”。

## 核心思路：一条 1px 的“哨兵线”

在 Tab（或需要吸顶的内容）附近放一个几乎不可见的节点（例如 1px 高），把它当成“哨兵”。

然后做两件事：

-   用 `IntersectionObserver` 监听哨兵是否还“在观察区域内”，从而判断是否吸顶
-   通过 `rootMargin`（UniApp 对应 `relativeToViewport/relativeTo` 的 `top` 参数）把“顶部触发线”下移到 `offsetTop`（通常是导航栏 + 安全区高度）

你可以把它理解成这样（示意）：

```
[系统状态栏/安全区]
[自定义导航栏]  <-- 总高度 = offsetTop
----------------------------  <-- 触发线（虚拟：由 observer 的 top 偏移定义）
[哨兵线 sentinel 1px]
[Tab 本体]
[内容列表...]
```

当页面滚动导致哨兵线越过这条“虚拟触发线”，我们就认为 Tab 需要吸顶。

## 原理拆解：IntersectionObserver 在这里解决了什么？

-   `IntersectionObserver` 的本质：异步观察“目标元素”与“参考区域（viewport 或容器）”是否相交
-   我们要的信号：哨兵元素一旦不相交（例如 `intersectionRatio === 0`），就说明它已经滚过了触发线，从而触发 `showSticky = true`

相比 `scroll` 事件，这种做法：

-   性能更优：避免高频回调 + 手动计算
-   语义更清晰：吸顶判断变成“哨兵是否可见”
-   更好维护：触发线统一由 `offsetTop` 控制

## 封装实现：useStickySentinel（Vue3 + TypeScript + UniApp）

下面是一个可复用的组合式函数：

-   你只需要提供：
    -   哨兵节点选择器 `sentinelSelector`
    -   顶部偏移 `offsetTop`（支持 Ref/Computed/函数）
    -   可选参照容器 `relativeToSelector`（用于容器滚动场景）

```ts
import type { ComputedRef, Ref } from "vue";
import {
    computed,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";

export interface UseStickySentinelOptions {
    /**
     * 哨兵节点选择器（建议使用 id 选择器，例如：#home-category-nav-sentinel）
     */
    sentinelSelector: string;

    /**
     * 吸顶线距离顶部的偏移（单位：px）。
     * 当哨兵滚出该参照区域时，视为“已超过吸顶线”，showSticky = true。
     */
    offsetTop: Ref<number> | ComputedRef<number> | (() => number);

    /**
     * 可选：参照节点选择器（用于容器滚动场景）。
     * 不传则以页面可视区域作为参照（relativeToViewport）。
     */
    relativeToSelector?: string;
}

export function useStickySentinel(options: UseStickySentinelOptions) {
    const showSticky = ref(false);

    let intersectionObserver: UniApp.IntersectionObserver | null = null;

    const offsetTopPx = computed(() => {
        return typeof options.offsetTop === "function"
            ? options.offsetTop()
            : options.offsetTop.value;
    });

    function setupStickyObserver() {
        const instance = getCurrentInstance();

        // 优先使用组件实例作为 observer 上下文；某些端/场景下 proxy 可能为空，兜底使用当前 page 实例
        const page = (
            typeof getCurrentPages === "function"
                ? getCurrentPages().slice(-1)[0]
                : null
        ) as any;
        const ctx = (instance?.proxy ?? page) as any;

        if (!ctx) return;

        intersectionObserver?.disconnect();
        intersectionObserver = uni.createIntersectionObserver(ctx);

        const topMargin = -offsetTopPx.value;

        const chain = options.relativeToSelector
            ? intersectionObserver.relativeTo(options.relativeToSelector, {
                  top: topMargin,
              })
            : intersectionObserver.relativeToViewport({ top: topMargin });

        chain.observe(options.sentinelSelector, (res) => {
            showSticky.value = (res?.intersectionRatio ?? 0) === 0;
        });
    }

    onMounted(async () => {
        await nextTick();
        setupStickyObserver();
    });

    watch(
        () => offsetTopPx.value,
        () => {
            // 顶部安全区/导航栏高度变化时，重新建立监听，确保触发时机准确
            setupStickyObserver();
        }
    );

    onBeforeUnmount(() => {
        // 页面/组件销毁时停止监听，避免内存泄漏
        intersectionObserver?.disconnect();
        intersectionObserver = null;
    });

    return {
        showSticky,
        setupStickyObserver,
    };
}
```

### 关键点解释（为什么它“稳”）

1. `offsetTop` 支持 Ref/Computed/函数

-   导航栏高度、安全区高度往往是动态的（例如异步计算、机型差异、横竖屏切换）
-   统一在 `offsetTopPx` 里转成数字，调用方只管把“真实高度”喂进来即可

2. 用 `topMargin = -offsetTop` 定义“虚拟触发线”

-   `relativeToViewport({ top: -offsetTop })` 的效果是：把观察区域顶部向下“推”了 `offsetTop` 像素
-   当哨兵滚过这条线，它就会被判定为不相交，从而触发 `showSticky = true`

3. 兼容 observer 上下文

-   UniApp 的 `createIntersectionObserver` 需要正确的上下文对象
-   先用组件实例 `instance.proxy`，再兜底用当前 `page`，能减少不同端/不同写法下的兼容坑

4. `watch(offsetTopPx)` 变化后重建 observer

-   `offsetTop` 变化意味着触发线变化
-   重建比“试图在原 observer 上修修补补”更稳、更直观

5. 销毁时 `disconnect`

-   页面/组件销毁不清理 observer，可能出现内存泄漏或回调继续触发的问题

## 怎么用：页面里接入吸顶

### 1）模板里放一个哨兵节点（建议用 id）

```html
<view id="home-category-nav-sentinel" style="height: 1px;"></view>

<view :class="{ 'tab--sticky': showSticky }" :style="{ top: offsetTop + 'px' }">
    <!-- Tabs... -->
</view>
```

### 2）脚本里调用

```ts
const offsetTop = computed(() => {
    // 这里放你的“导航栏 + 安全区”高度计算
    return navBarHeight.value;
});

const { showSticky } = useStickySentinel({
    sentinelSelector: "#home-category-nav-sentinel",
    offsetTop,
});
```

### 3）容器滚动（比如 scroll-view）

如果不是页面滚动，而是某个容器滚动，就传 `relativeToSelector`：

```ts
const { showSticky } = useStickySentinel({
    sentinelSelector: "#home-category-nav-sentinel",
    offsetTop,
    relativeToSelector: "#your-scroll-container",
});
```

## 常见坑与实战建议

-   哨兵节点未渲染就开始 observe
    -   建议：`onMounted + nextTick` 后再 `setupStickyObserver`
-   `offsetTop` 变化后触发点不准
    -   建议：保留 `watch(offsetTopPx)` 的重建逻辑（尤其是自定义导航栏高度异步计算场景）
-   重复创建 observer 导致多重监听
    -   建议：每次重建前先 `disconnect()`（本实现已处理）
-   不同端回调字段差异
    -   建议：用 `intersectionRatio === 0` 做判断相对更稳（本实现已采用）

## 总结

通过“哨兵线 + IntersectionObserver”，我们把吸顶实现从：

-   高频滚动监听 + 手动计算位置

变成：

-   监听哨兵可见性 + 一个统一的 offsetTop 触发线

这套方案的核心优势是：逻辑更清晰、性能更友好、在多端场景下更可控。
