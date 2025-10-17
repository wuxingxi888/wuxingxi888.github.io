---
title: Vue3 中 reactive 和 ref 的区别与原理详解
date: 2024-11-18 10:28:59
tags: vue3 前端框架
categories: 前端框架
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

## 前言

在 Vue3 中，响应式系统是其核心特性之一。Vue3 提供了两种创建响应式数据的主要方式：`reactive` 和 `ref`。虽然它们都能实现响应式，但在使用方式、适用场景和底层实现上存在显著差异。本文将深入探讨这两种 API 的区别与原理，帮助开发者更好地理解和使用它们。

如果你对 Vue3 的其他方面也感兴趣，可以看看我们之前的文章，比如 [Vue2 VS Vue3 内容全部重构 从各个维度做对比](./vue2和vue3响应式原理对比.md)。

## 什么是 reactive？

`reactive` 是 Vue3 中用于创建响应式对象的 API。它基于 ES6 的 Proxy 实现，可以拦截对象的各种操作（如获取、设置、删除等）。

### reactive 的特点

-   用于创建一个响应式的对象（包括数组和复杂数据结构）
-   基于 ES6 的 Proxy 实现
-   只能用于对象类型（Object、Array、Map、Set 等），不能用于基本类型
-   直接返回一个响应式对象，无需通过 `.value` 访问

```javascript
import { reactive } from "vue";

const state = reactive({
    count: 0,
    name: "Vue3",
    nested: {
        age: 1,
    },
});

// 直接访问属性
console.log(state.count); // 0
state.count++;
console.log(state.count); // 1
```

## 什么是 ref？

`ref` 是 Vue3 中用于创建响应式数据的另一种 API，它可以用于任何类型的数据，包括基本类型和对象类型。

### ref 的特点

-   用于创建一个响应式的数据，可以是任意类型（包括基本类型和对象类型）
-   对于基本类型，ref 使用对象的属性访问器（getter 和 setter）来实现响应式
-   对于对象类型，ref 内部会调用 reactive 来转换为响应式
-   ref 返回一个响应式对象，该对象有一个 `.value` 属性，通过该属性访问和修改值

```javascript
import { ref } from "vue";

// 基本类型
const count = ref(0);
console.log(count.value); // 0
count.value++;
console.log(count.value); // 1

// 对象类型
const state = ref({
    name: "Vue3",
    version: 3,
});
console.log(state.value.name); // Vue3
state.value.name = "Vue3.0";
```

## 核心区别概览

| 特性        | reactive                           | ref                      |
| ----------- | ---------------------------------- | ------------------------ |
| 数据类型    | 对象类型 (Object, Array, Map, Set) | 任意类型 (包括基本类型)  |
| 访问方式    | 直接访问属性                       | 通过 .value 访问         |
| 响应式原理  | Proxy 代理                         | 对象包装 + getter/setter |
| TS 类型支持 | 保持原类型                         | 需要 .value 类型         |
| 解构响应式  | 会丢失响应式                       | 保持响应式               |

## 底层原理深度解析

### reactive 实现原理

`reactive` 基于 ES6 的 Proxy 实现。Vue3 使用 Proxy 来包装目标对象，通过 Handler（通常为 baseHandlers）来拦截对目标对象的操作。

```javascript
// Vue3 reactive 核心实现原理
function reactive(target) {
    // 只能代理对象类型
    if (!isObject(target)) {
        return target;
    }

    // 避免重复代理
    if (target[ReactiveFlags.RAW]) {
        return target;
    }

    return createReactiveObject(
        target,
        mutableHandlers,
        mutableCollectionHandlers
    );
}

function createReactiveObject(target, baseHandlers, collectionHandlers) {
    // 选择处理器：集合类型使用特殊处理器
    const handlers =
        target instanceof Map || target instanceof Set
            ? collectionHandlers
            : baseHandlers;

    return new Proxy(target, handlers);
}

// 基础处理器
const mutableHandlers = {
    get(target, key, receiver) {
        // 追踪依赖
        track(target, key);

        const res = Reflect.get(target, key, receiver);

        // 深层响应式：如果是对象，递归代理
        if (isObject(res)) {
            return reactive(res);
        }

        return res;
    },

    set(target, key, value, receiver) {
        const oldValue = target[key];
        const result = Reflect.set(target, key, value, receiver);

        // 只有值变化时才触发更新
        if (hasChanged(value, oldValue)) {
            trigger(target, key);
        }

        return result;
    },

    deleteProperty(target, key) {
        const hadKey = hasOwn(target, key);
        const result = Reflect.deleteProperty(target, key);

        if (hadKey && result) {
            trigger(target, key);
        }

        return result;
    },
};
```

当读取属性时，会触发 getter，进行依赖收集（track）；当设置属性时，会触发 setter，进行触发更新（trigger）。同时，对于嵌套对象，会在 getter 中递归地调用 reactive，使得整个对象都是响应式的。

#### 实际使用示例

```javascript
// 实际使用示例（基于你的项目经验）
export const useVideoStore = () => {
    const videoState = reactive({
        currentVideo: null,
        playlist: [],
        playerConfig: {
            autoplay: true,
            volume: 0.8,
            playbackRate: 1.0,
        },
        // 深层嵌套对象也能保持响应式
        analytics: {
            watchTime: 0,
            interactions: [],
        },
    });

    // 直接修改，无需 .value
    const updateVideo = (video) => {
        videoState.currentVideo = video;
        videoState.analytics.watchTime = 0;
    };

    const addToPlaylist = (video) => {
        videoState.playlist.push(video); // 数组操作也是响应式的
    };

    return { videoState, updateVideo, addToPlaylist };
};
```

### ref 实现原理

`ref` 通过一个包装对象来存储值。如果传入的是基本类型，则直接存储；如果是对象类型，则用 reactive 转换后存储。

```javascript
// Vue3 ref 核心实现原理
class RefImpl {
    constructor(value) {
        this._value = value;
        this._rawValue = value; // 保存原始值
        this.dep = undefined;
        this.__v_isRef = true;

        // 如果是对象，用 reactive 包装
        this._value = isObject(value) ? reactive(value) : value;
    }

    get value() {
        // 依赖收集
        trackRefValue(this);
        return this._value;
    }

    set value(newVal) {
        // 使用原始值比较，避免 reactive 代理对象比较问题
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = isObject(newVal) ? reactive(newVal) : newVal;
            // 触发更新
            triggerRefValue(this);
        }
    }
}

function ref(value) {
    return new RefImpl(value);
}

// 依赖收集和触发更新
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep || (ref.dep = createDep()));
    }
}

function triggerRefValue(ref) {
    if (ref.dep) {
        triggerEffects(ref.dep);
    }
}
```

在访问 ref 的值时，通过 `.value` 属性来获取，此时会触发 getter，进行依赖收集；当修改 `.value` 时，会触发 setter，进行触发更新。

#### 实际使用示例

```javascript
// 实际使用示例（基于你的项目经验）
export const usePlayerController = () => {
    // 基本类型使用 ref
    const currentTime = ref(0);
    const duration = ref(0);
    const isPlaying = ref(false);
    const volume = ref(0.8);

    // 对象类型也可以用 ref，内部会被 reactive 包装
    const playerState = ref({
        status: "idle",
        buffered: 0,
        error: null,
    });

    const play = () => {
        isPlaying.value = true;
        playerState.value.status = "playing";
    };

    const pause = () => {
        isPlaying.value = false;
        playerState.value.status = "paused";
    };

    const seek = (time) => {
        currentTime.value = time;
        // 调用原生播放器 API
        videoElement.currentTime = time;
    };

    // 计算属性基于 ref
    const progress = computed(() => {
        if (duration.value === 0) return 0;
        return (currentTime.value / duration.value) * 100;
    });

    return {
        // 在模板中需要 .value，但在 setup 返回时会自动解包
        currentTime,
        duration,
        isPlaying,
        volume,
        playerState,
        progress,
        play,
        pause,
        seek,
    };
};
```

## 简单实现示例

下面我们通过代码来更深入地理解 `reactive` 和 `ref` 的实现：

```javascript
// 模拟 reactive 的简单实现
function reactive(target) {
    if (typeof target !== "object" || target === null) {
        return target;
    }

    const handler = {
        get(obj, key, receiver) {
            const res = Reflect.get(obj, key, receiver);
            // 依赖收集
            track(obj, key);
            // 如果获取的是对象，则递归代理
            if (typeof res === "object" && res !== null) {
                return reactive(res);
            }
            return res;
        },
        set(obj, key, value, receiver) {
            const oldValue = obj[key];
            const result = Reflect.set(obj, key, value, receiver);
            // 如果值发生变化，则触发更新
            if (oldValue !== value) {
                trigger(obj, key);
            }
            return result;
        },
    };

    return new Proxy(target, handler);
}

// 模拟 ref 的简单实现
function ref(value) {
    return new RefImpl(value);
}

class RefImpl {
    constructor(value) {
        this._value = convert(value);
    }

    get value() {
        // 依赖收集
        track(this, "value");
        return this._value;
    }

    set value(newVal) {
        if (newVal !== this._value) {
            this._value = convert(newVal);
            // 触发更新
            trigger(this, "value");
        }
    }
}

function convert(value) {
    if (typeof value === "object" && value !== null) {
        return reactive(value);
    }
    return value;
}

// 依赖收集和触发更新的简单模拟
const targetMap = new WeakMap();
let activeEffect = null;

function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            depsMap = new Map();
            targetMap.set(target, depsMap);
        }
        let dep = depsMap.get(key);
        if (!dep) {
            dep = new Set();
            depsMap.set(key, dep);
        }
        dep.add(activeEffect);
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach((effect) => effect());
    }
}

// 使用示例
const state = reactive({ count: 0 });
const countRef = ref(0);

// 模拟 effect 函数
function effect(fn) {
    activeEffect = fn;
    fn();
    activeEffect = null;
}

// 测试 reactive
effect(() => {
    console.log("reactive count:", state.count);
});

// 测试 ref
effect(() => {
    console.log("ref count:", countRef.value);
});

state.count++; // 触发 reactive 的 effect
countRef.value++; // 触发 ref 的 effect
```

在上面的代码中，我们简单模拟了 `reactive` 和 `ref` 的实现。需要注意的是，Vue3 中的实际实现更加复杂，包括处理数组、Map、Set 等数据结构，以及优化性能等。

## 面试回答要点

1. `reactive` 基于 Proxy，`ref` 基于 getter/setter 和 reactive
2. `reactive` 用于对象，`ref` 用于任何类型
3. `ref` 通过 `.value` 访问，`reactive` 直接访问
4. 两者都进行了依赖收集和触发更新
5. `reactive` 不能直接用于基本类型，`ref` 可以
6. `reactive` 对象解构会失去响应性，`ref` 可以保持响应性

## 总结

`reactive` 和 `ref` 是 Vue3 响应式系统的核心 API，它们各有特点和适用场景：

-   当需要创建一个响应式的对象（Object、Array 等）时，使用 `reactive`
-   当需要创建一个响应式的任意类型值时，使用 `ref`
-   在模板中，`reactive` 对象可以直接访问属性，而 `ref` 需要通过 `.value` 访问（但在 setup 返回时会自动解包）
-   在组合函数中，推荐使用 `ref`，因为它可以保持响应性即使在解构后

希望这些解释和代码能帮助你更好地理解 Vue3 中 `reactive` 和 `ref` 的区别与原理。
