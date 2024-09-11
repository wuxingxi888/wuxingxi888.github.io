---
title: 在抖音小程序中实现类似 Pinia 的全局响应式数据状态管理
date: 2024-03-20 19:09:11
tags: 抖音 小程序
categories: 小程序
top_img:
cover: "https://s2.loli.net/2024/03/20/WIJg8BhufdlQrKy.jpg"
---



## 在微信小程序中实现类似 Pinia 的全局响应式数据状态管理

抖音小程序作为一种轻量级的应用程序开发框架，具有自身的特点和限制。其中，全局状态管理是开发者常常需要面对的问题之一。在这篇博客中，我们将介绍如何在抖音小程序中实现类似 Vue.js 生态系统中的 Pinia 的全局响应式数据状态管理。

## 简介

Pinia 是一个为 Vue.js 设计的全新状态管理库，通过利用 Vue 3 提供的响应式 API，提供了简洁而强大的全局状态管理解决方案。虽然抖音小程序并不直接支持 Vue.js，但我们可以借鉴 Pinia 的设计思想，在抖音小程序中实现类似的全局状态管理系统。

## 实现步骤

### 1. 创建全局状态管理器

首先，我们创建一个 `store` 文件夹，新建` index.js`文件，  定义一个名为 `Store` 的类作为全局状态管理器。在该类中，我们可以定义状态、mutations、actions 等相关方法。

```javascript
class Store {
  constructor() {
    // 从本地存储中获取之前保存的状态，如果没有则使用默认值
    this.state = {};
    this.getters = {};
    this._mutations = {};
    this._actions = {};
    this._subscribers = [];
  }

  // 注册 mutation
  registerMutation(name, handler) {
    this._mutations[name] = handler;
  }

  // 注册 action
  registerAction(name, handler) {
    this._actions[name] = handler.bind(this);
  }

  // 提交 mutation
  commit(name, payload) {
    if (this._mutations[name]) {
      this._mutations[name](this.state, payload);
      this._notifySubscribers();
    }
  }

  // 触发 action
  dispatch(name, payload) {
    if (this._actions[name]) {
      return this._actions[name](payload);
    }
  }

  // 订阅状态变化
  subscribe(callback) {
    this._subscribers.push(callback);
  }

  // 通知所有订阅者状态变化
  _notifySubscribers() {
    this._subscribers.forEach((callback) => {
      callback(this.state);
    });
  }
}

// 创建一个全局唯一的状态管理器实例
const store = new Store();

export default store;

```

### 2. 注册状态、mutations 和 actions

在 `store` 文件夹中新建modules文件夹并且创建`app.js`，我们注册全局状态、mutations 和 actions，以便在整个小程序中使用。

```javascript
import store from '../index.js';

// 注册状态
store.state = {
  count: 0,
};

// 注册 mutation
store.registerMutation('increment', (state, payload) => {
  state.count += payload;
});

// 注册 action
store.registerAction('incrementAsync', async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  store.commit('increment', payload);
});

export default store;

```

### 3. 页面中使用全局状态管理器

在需要使用全局状态的页面中，我们可以导入全局状态管理器，并订阅状态变化，以实现页面的响应式更新。

```
import store from '../store/moudles/app.js';

Page({
  data: {
    count: 0,
  },

  onLoad() {
    // 页面加载时订阅状态变化
    store.subscribe(this.handleStateChange.bind(this));
    // 初始化页面数据
    this.setData({
      count: store.state.count,
    });
  },

  // 处理状态变化的回调函数
  handleStateChange(state) {
    this.setData({
      count: state.count,
    });
  },

  // 响应用户点击事件，触发 mutation
  handleClick() {
    store.commit('increment', 1);
  },

  // 响应用户点击事件，触发 action
  handleAsyncClick() {
    store.dispatch('incrementAsync', 1);
  },
});

```

## 结合本地存储

为了在小程序关闭后能够保存状态，并在重新打开时恢复状态，我们可以结合抖音小程序的本地存储功能。在全局状态管理器中，每次状态变化后将状态保存到本地存储中，在小程序启动时从本地存储中恢复状态(修改文章第二步代码，如下：)。

```
import store from '../index.js';

// 注册状态
store.state = {
  count: tt.getStorageSync('count'),
};

// 注册 mutation
store.registerMutation('increment', (state, payload) => {
  state.count += payload;
  tt.setStorageSync("count", state.count);
});

// 注册 action
store.registerAction('incrementAsync', async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  store.commit('increment', payload);
});

export default store;
```

## 总结

通过以上步骤，我们成功实现了一个简单而强大的全局响应式数据状态管理系统，在抖音小程序中实现了类似 Pinia 的功能。这样的状态管理系统不仅提供了方便的状态管理解决方案，还能够增强小程序的可维护性和可扩展性，为小程序开发带来更好的开发体验。

在实际项目中，你可以根据具体需求进一步扩展和优化这个状态管理系统，例如添加更多的状态、封装更多的 mutations 和 actions，以满足项目的需求。

希望本文能够对你理解抖音小程序中的全局状态管理以及类似 Pinia 的设计思想有所帮助，也欢迎大家在实际项目中尝试并探索更多的可能性。
