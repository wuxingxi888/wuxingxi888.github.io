---
title: 支付宝小程序弹层滚动锁定的 CSS 自救方案
date: 2025-11-15 10:30:00
tags: 支付宝小程序 弹层滚动 CSS 移动开发
categories: 移动开发
top_img: https://cdn.jsdelivr.net/gh/wuxingxi888/CDN_IMG_BED/xiaochengxu.png
cover: https://cdn.jsdelivr.net/gh/wuxingxi888/CDN_IMG_BED/xiaochengxu.png
---

## 背景

支付宝小程序提供了 `my.setPageScrollable(false)` 来阻止底层页面滚动，但由于系统实现层面的差异，安卓与 iOS 对于滚动禁止的层级控制存在区别：

-   **安卓端**：采用 Webview 级滚动限制（全页面锁定），生效时界面及所有弹层均不可滚动，导致弹层内的 `scroll-view` 也无法滚动；
-   **iOS 端**：采用组件级滚动限制（局部锁定），当弹层激活时会智能区分层级，仅限制底层页面滚动而保持弹层可滚动。

这种平台差异会导致安卓端弹层内容无法滚动，而 iOS 端正常，体验不一致。为了保证遮罩弹层的沉浸体验，需要一套跨端一致的“纯 CSS”兜底方案。

## my.setPageScrollable 介绍

`my.setPageScrollable` 是支付宝小程序提供的全局滚动控制 API，可在当前页面维度禁止或恢复底层滚动。当传入 `false` 时页面不再跟随手势上下滚动，传入 `true` 则恢复默认行为。更多参数说明、平台差异和返回值请参考 [官方文档](https://opendocs.alipay.com/mini/api?pathHash=5b4d0c83#%E6%BB%9A%E5%8A%A8)。

## 最小 Demo

```html
<template>
    <view class="filter-modal" v-if="visible">
        <view class="mask" @tap="$emit('close')"></view>
        <view class="panel">
            <scroll-view class="menu can-scroll">
                <view class="item" v-for="item in 20" :key="item"
                    >菜单{{ item }}</view
                >
            </scroll-view>
            <scroll-view class="list can-scroll">
                <view class="item" v-for="item in 30" :key="item"
                    >选项{{ item }}</view
                >
            </scroll-view>
        </view>
    </view>
</template>
```

```css
.filter-modal,
.filter-modal .mask,
.filter-modal .panel {
    touch-action: none; /* 阻止触摸穿透 */
}

.filter-modal {
    position: fixed;
    inset: 0;
    z-index: 999;

    .mask {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .panel {
        position: absolute;
        left: 0;
        right: 0;
        top: 200rpx;
        height: 400rpx;
        display: flex;
        background: #fff;
        border-radius: 0 0 24rpx 24rpx;
    }
}

.scroll-view.can-scroll {
    overscroll-behavior: none; /* 禁止滚动传播 */
}
```

## 关键 CSS

-   `touch-action: none`：让遮罩与弹层吞掉所有原生手势，避免滚动、缩放、双击等事件传到页面主体。需要自定义点击、滚动等逻辑。
-   `overscroll-behavior: none`：限制滚动惯性到容器内部，不再把“回弹”交给外层页面；在 Android 上尤其能防止继续拖拽带动 page。

## 组合步骤

1. **固定容器**：遮罩与弹层全局 `touch-action: none`，彻底阻断穿透。
2. **内部滚动**：根据内容高度动态决定是否追加 `can-scroll`，防止空容器被禁用触摸后看起来“卡死”。
3. **锁住回弹**：允许滚动的 `scroll-view` 同时加 `overscroll-behavior: none`，在 Android WebView 里也不会拖动到底层。
4. **体验还原**：关闭弹层后移除相关类名即可，无需依赖 `my.setPageScrollable` 来恢复页面滚动。

## 结论

通过 `touch-action + overscroll-behavior` 的组合，可以在支付宝小程序中跨 iOS / Android 实现一致的弹层滚动锁定效果，完全避开 `my.setPageScrollable` 的兼容性分歧，让弹窗层始终沉浸、可靠。
