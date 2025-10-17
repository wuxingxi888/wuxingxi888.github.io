---
title: Vue2 VS Vue3
date: 2024-10-17 17:00:00
tags: vue 前端框架
categories: 前端框架
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

## 前言

Vue.js 作为一款流行的前端框架，经历了从 Vue2 到 Vue3 的重大升级。Vue3 不仅仅是一个版本更新，更是一次全面的重构，带来了性能、开发体验和功能上的巨大提升。本文将从多个维度深入对比 Vue2 和 Vue3，帮助开发者更好地理解两者之间的差异和 Vue3 的优势。

## 1. 响应式原理对比

### Vue2 的响应式系统

Vue2 使用 `Object.defineProperty` 来实现响应式数据绑定。这个 API 可以劫持对象属性的 getter 和 setter，从而在数据变化时通知视图更新。

```javascript
function defineReactive(obj, key, val) {
    // 递归处理嵌套对象
    observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            console.log(`获取属性 ${key}: ${val}`);
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            console.log(`设置属性 ${key}: ${newVal}`);
            val = newVal;
            // 通知视图更新
            notify();
        },
    });
}

function observe(obj) {
    if (typeof obj !== "object" || obj === null) {
        return;
    }

    Object.keys(obj).forEach((key) => {
        defineReactive(obj, key, obj[key]);
    });
}
```

#### Vue2 响应式系统的局限性

1. **无法检测数组索引的变化**：

    ```javascript
    var vm = new Vue({
        data: {
            items: ["a", "b", "c"],
        },
    });

    // Vue 无法检测到这种变化
    vm.items[1] = "x";

    // Vue 无法检测到这种变化
    vm.items.length = 0;
    ```

2. **无法检测对象属性的添加或删除**：

    ```javascript
    var vm = new Vue({
        data: {
            a: 1,
        },
    });

    // Vue 无法检测到 b 属性的添加
    vm.b = 2;

    // Vue 无法检测到 a 属性的删除
    delete vm.a;
    ```

为了解决这些问题，Vue2 重写了数组的一些方法（push、pop、shift、unshift、splice、sort、reverse），并提供了 `Vue.set` (或 `vm.$set`) 和 `Vue.delete` (或 `vm.$delete`) 方法。

### Vue3 的响应式系统

Vue3 完全重写了响应式系统，采用 ES2015 的 `Proxy` 来替代 `Object.defineProperty`。Proxy 可以拦截对象的更多操作，提供了更强大的功能。

```javascript
function reactive(target) {
    if (typeof target !== "object" || target === null) {
        return target;
    }

    const handler = {
        get(target, key, receiver) {
            console.log(`获取属性 ${key.toString()}`);
            const result = Reflect.get(target, key, receiver);
            // 递归处理嵌套对象
            return typeof result === "object" ? reactive(result) : result;
        },
        set(target, key, value, receiver) {
            console.log(`设置属性 ${key.toString()}: ${value}`);
            const result = Reflect.set(target, key, value, receiver);
            // 通知视图更新
            trigger(target, key);
            return result;
        },
        deleteProperty(target, key) {
            console.log(`删除属性 ${key.toString()}`);
            const result = Reflect.deleteProperty(target, key);
            // 通知视图更新
            trigger(target, key);
            return result;
        },
    };

    return new Proxy(target, handler);
}
```

#### Vue3 响应式系统的改进

1. **可以检测数组索引的变化**：

    ```javascript
    import { reactive } from "vue";

    const state = reactive({
        items: ["a", "b", "c"],
    });

    // Vue3 可以检测到这种变化
    state.items[1] = "x";

    // Vue3 也可以检测到这种变化
    state.items.length = 0;
    ```

2. **可以检测对象属性的添加或删除**：

    ```javascript
    import { reactive } from "vue";

    const state = reactive({
        a: 1,
    });

    // Vue3 可以检测到属性的添加
    state.b = 2;

    // Vue3 可以检测到属性的删除
    delete state.a;
    ```

### 响应式系统优化总结

| 特性            | Vue2                  | Vue3   | 优化点                           |
| --------------- | --------------------- | ------ | -------------------------------- |
| 实现方式        | Object.defineProperty | Proxy  | Proxy 功能更强大，能拦截更多操作 |
| 数组索引检测    | 不支持                | 支持   | 解决了 Vue2 的数组变化检测问题   |
| 对象属性增删    | 不支持                | 支持   | 无需使用 $set/$delete            |
| 性能            | 递归遍历所有属性      | 懒劫持 | 初始化更快，内存占用更少         |
| TypeScript 支持 | 有限                  | 完善   | 更好的类型推导                   |

## 2. 虚拟 DOM 和 Diff 算法对比

### Vue2 的虚拟 DOM 和 Diff 算法

Vue2 使用基于 Snabbdom 的虚拟 DOM 实现，采用双端 Diff 算法。该算法通过同时从新旧子节点的两端开始比较，尽可能减少 DOM 操作。

#### Vue2 Diff 算法的特点：

1. **双端比较**：同时从新旧子节点的两端开始比较
2. **四种比较方式**：
    - 新前与旧前
    - 新后与旧后
    - 新后与旧前（需要移动节点）
    - 新前与旧后（需要移动节点）
3. **时间复杂度**：O(n)

### Vue3 的虚拟 DOM 和 Diff 算法

Vue3 对虚拟 DOM 进行了重写，主要优化包括：

#### 静态提升（Static Hoisting）

Vue3 会自动提升模板中的静态节点，避免在重新渲染时重新创建：

```javascript
// Vue2 中每次渲染都会创建完整的 vnode
function render() {
    return h("div", [h("p", "静态文本"), h("p", this.dynamicValue)]);
}

// Vue3 中静态节点会被提升
const _hoisted_1 = h("p", "静态文本");

function render() {
    return h("div", [_hoisted_1, h("p", this.dynamicValue)]);
}
```

#### 预字符串化（Pre-stringification）

对于连续的静态节点，Vue3 会预编译成字符串，进一步提升性能：

```javascript
// 多个连续的静态节点会被预编译成字符串
const _hoisted_1 = /*#__PURE__*/ _createStaticVNode(
    "<p>静态文本1</p><p>静态文本2</p><p>静态文本3</p>",
    3
);
```

#### Block Tree 优化

Vue3 引入了 Block Tree 概念，只对动态节点进行追踪：

```javascript
// Vue3 会生成带有动态节点信息的 block
function render(_ctx, _cache) {
    return (
        _openBlock(),
        _createElementBlock("div", null, [
            _hoisted_1,
            _createElementVNode(
                "p",
                null,
                _toDisplayString(_ctx.dynamicValue),
                1 /* TEXT */
            ),
        ])
    );
}
```

#### Patch Flag 优化

Vue3 为动态节点添加了 Patch Flag，标记节点的动态类型：

```javascript
// Patch Flag 标记节点的动态类型
createElementVNode(
    "p",
    null,
    _toDisplayString(_ctx.dynamicValue),
    1 /* TEXT */
);
```

### 虚拟 DOM 和 Diff 算法优化总结

| 特性         | Vue2         | Vue3       | 优化点                       |
| ------------ | ------------ | ---------- | ---------------------------- |
| 静态节点处理 | 每次重新创建 | 静态提升   | 减少内存占用和创建开销       |
| 连续静态节点 | 逐个创建     | 预字符串化 | 大幅提升渲染性能             |
| 动态节点追踪 | 全量比较     | Block Tree | 只比较动态节点，减少比较次数 |
| 更新标记     | 无           | Patch Flag | 精确更新，避免不必要的比较   |

## 3. 生命周期对比

### Vue2 生命周期

Vue2 的生命周期可以分为四个阶段：

1. **创建阶段**：

    - `beforeCreate`：实例创建前调用
    - `created`：实例创建后调用

2. **挂载阶段**：

    - `beforeMount`：挂载开始前调用
    - `mounted`：挂载完成后调用

3. **更新阶段**：

    - `beforeUpdate`：数据更新前调用
    - `updated`：数据更新后调用

4. **销毁阶段**：
    - `beforeDestroy`：实例销毁前调用
    - `destroyed`：实例销毁后调用

```javascript
export default {
    beforeCreate() {
        console.log("beforeCreate");
    },
    created() {
        console.log("created");
    },
    beforeMount() {
        console.log("beforeMount");
    },
    mounted() {
        console.log("mounted");
    },
    beforeUpdate() {
        console.log("beforeUpdate");
    },
    updated() {
        console.log("updated");
    },
    beforeDestroy() {
        console.log("beforeDestroy");
    },
    destroyed() {
        console.log("destroyed");
    },
};
```

### Vue3 生命周期

Vue3 在保持与 Vue2 相似生命周期的同时，也引入了 Composition API，带来了新的生命周期钩子：

#### 选项式 API 生命周期（与 Vue2 类似）

```javascript
export default {
    beforeCreate() {
        console.log("beforeCreate");
    },
    created() {
        console.log("created");
    },
    beforeMount() {
        console.log("beforeMount");
    },
    mounted() {
        console.log("mounted");
    },
    beforeUpdate() {
        console.log("beforeUpdate");
    },
    updated() {
        console.log("updated");
    },
    beforeUnmount() {
        console.log("beforeUnmount"); // 注意：destroy 改为 unmount
    },
    unmounted() {
        console.log("unmounted"); // 注意：destroyed 改为 unmounted
    },
};
```

#### 组合式 API 生命周期

在 Vue3 的 Composition API 中，生命周期钩子有了新的命名方式，它们都带有 `on` 前缀：

```javascript
import {
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
} from "vue";

export default {
    setup() {
        // 注意：没有 beforeCreate 和 created
        // setup 函数本身就在 beforeCreate 和 created 之间执行

        onBeforeMount(() => {
            console.log("onBeforeMount");
        });

        onMounted(() => {
            console.log("onMounted");
        });

        onBeforeUpdate(() => {
            console.log("onBeforeUpdate");
        });

        onUpdated(() => {
            console.log("onUpdated");
        });

        onBeforeUnmount(() => {
            console.log("onBeforeUnmount");
        });

        onUnmounted(() => {
            console.log("onUnmounted");
        });

        return {};
    },
};
```

### 生命周期优化总结

| Vue2 选项式 API | Vue3 选项式 API | Vue3 组合式 API | 优化点                               |
| --------------- | --------------- | --------------- | ------------------------------------ |
| beforeCreate    | beforeCreate    | setup()         | setup 替代了 beforeCreate 和 created |
| created         | created         | setup()         | 统一在 setup 中处理初始化逻辑        |
| beforeMount     | beforeMount     | onBeforeMount   | 命名更统一                           |
| mounted         | mounted         | onMounted       | 命名更统一                           |
| beforeUpdate    | beforeUpdate    | onBeforeUpdate  | 命名更统一                           |
| updated         | updated         | onUpdated       | 命名更统一                           |
| beforeDestroy   | beforeUnmount   | onBeforeUnmount | 术语更准确                           |
| destroyed       | unmounted       | onUnmounted     | 术语更准确                           |

## 4. Options API 与 Composition API 对比

### Options API（选项式 API）

Options API 是 Vue2 和 Vue3 都支持的传统 API 风格，将组件的逻辑按选项（data、methods、computed 等）分类组织。

```javascript
export default {
    data() {
        return {
            count: 0,
            userList: [],
        };
    },
    computed: {
        doubleCount() {
            return this.count * 2;
        },
    },
    methods: {
        increment() {
            this.count++;
        },
        async fetchUsers() {
            // 获取用户列表
            this.userList = await api.getUsers();
        },
    },
    watch: {
        count(newVal, oldVal) {
            console.log(`count changed from ${oldVal} to ${newVal}`);
        },
    },
    mounted() {
        this.fetchUsers();
    },
};
```

### Composition API（组合式 API）

Composition API 是 Vue3 引入的新特性，允许开发者基于逻辑关注点组织代码。

```javascript
import { ref, computed, watch, onMounted } from "vue";

export default {
    setup() {
        // 数据
        const count = ref(0);
        const userList = ref([]);

        // 计算属性
        const doubleCount = computed(() => count.value * 2);

        // 方法
        const increment = () => {
            count.value++;
        };

        const fetchUsers = async () => {
            // 获取用户列表
            userList.value = await api.getUsers();
        };

        // 监听器
        watch(count, (newVal, oldVal) => {
            console.log(`count changed from ${oldVal} to ${newVal}`);
        });

        // 生命周期
        onMounted(() => {
            fetchUsers();
        });

        // 暴露给模板
        return {
            count,
            userList,
            doubleCount,
            increment,
        };
    },
};
```

### `<script setup>` 语法糖

Vue3.2 引入了 `<script setup>` 语法糖，进一步简化了 Composition API 的使用：

```vue
<script setup>
import { ref, computed, watch, onMounted } from "vue";

// 数据
const count = ref(0);
const userList = ref([]);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const increment = () => {
    count.value++;
};

const fetchUsers = async () => {
    // 获取用户列表
    userList.value = await api.getUsers();
};

// 监听器
watch(count, (newVal, oldVal) => {
    console.log(`count changed from ${oldVal} to ${newVal}`);
});

// 生命周期
onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <div>
        <p>Count: {{ count }}</p>
        <p>Double Count: {{ doubleCount }}</p>
        <button @click="increment">Increment</button>
        <ul>
            <li v-for="user in userList" :key="user.id">
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>
```

### Options API 与 Composition API 对比总结

| 特性            | Options API | Composition API | 优化点                           |
| --------------- | ----------- | --------------- | -------------------------------- |
| 代码组织方式    | 按选项分类  | 按逻辑功能组织  | 更好地组织复杂组件逻辑           |
| 逻辑复用        | Mixins      | Composable 函数 | 避免 mixins 的命名冲突问题       |
| TypeScript 支持 | 有限        | 完善            | 更好的类型推导                   |
| 学习曲线        | 简单        | 需要适应        | 对新手更友好，对复杂应用更有优势 |
| 代码压缩        | 一般        | 更好            | 更小的打包体积                   |

## 5. 思考：Composition API 封装与 Vue2 中的模块封装

### 问题提出

在 Vue2 中，我们可以通过封装具体的类、方法和模块来实现逻辑复用，为什么还需要 Composition API 呢？

### Vue2 中的模块封装示例

在 Vue2 中，我们确实可以通过封装模块来实现逻辑复用：

```javascript
// userModule.js
export class UserModule {
    constructor(vm) {
        this.vm = vm;
    }

    async fetchUsers() {
        this.vm.loading = true;
        try {
            this.vm.userList = await api.getUsers();
        } finally {
            this.vm.loading = false;
        }
    }

    addUser(user) {
        this.vm.userList.push(user);
    }
}

// 在组件中使用
export default {
    data() {
        return {
            userList: [],
            loading: false,
        };
    },
    created() {
        this.userModule = new UserModule(this);
    },
    methods: {
        async fetchUsers() {
            await this.userModule.fetchUsers();
        },
    },
};
```

### Composition API 的优势

尽管 Vue2 中可以使用类和模块封装，但 Composition API 仍有以下优势：

#### 1. 响应式集成

Composition API 与 Vue 的响应式系统深度集成：

```javascript
// composition api 版本
export function useUser() {
    const userList = ref([]);
    const loading = ref(false);

    const fetchUsers = async () => {
        loading.value = true;
        try {
            userList.value = await api.getUsers();
        } finally {
            loading.value = false;
        }
    };

    return {
        userList,
        loading,
        fetchUsers,
    };
}

// 在组件中使用
export default {
    setup() {
        const { userList, loading, fetchUsers } = useUser();

        onMounted(() => {
            fetchUsers();
        });

        return {
            userList,
            loading,
            fetchUsers,
        };
    },
};
```

#### 2. 更好的类型推导

Composition API 提供了更好的 TypeScript 支持：

```typescript
// composition api 版本（TypeScript）
export function useUser() {
    const userList = ref<User[]>([]);
    const loading = ref<boolean>(false);

    const fetchUsers = async () => {
        loading.value = true;
        try {
            userList.value = await api.getUsers();
        } finally {
            loading.value = false;
        }
    };

    return {
        userList,
        loading,
        fetchUsers,
    };
}
```

#### 3. 更自然的逻辑组合

Composition API 允许更自然地组合不同功能：

```javascript
export default {
    setup() {
        // 用户相关逻辑
        const { userList, loading: userLoading, fetchUsers } = useUser();

        // 分页相关逻辑
        const { page, pageSize, total, setPage } = usePagination();

        // 搜索相关逻辑
        const { searchKeyword, search } = useSearch();

        // 组合使用
        const fetchUsersWithPagination = async () => {
            await fetchUsers({
                page: page.value,
                pageSize: pageSize.value,
                keyword: searchKeyword.value,
            });
        };

        return {
            userList,
            userLoading,
            page,
            pageSize,
            total,
            searchKeyword,
            fetchUsersWithPagination,
            setPage,
            search,
        };
    },
};
```

#### 4. 与模板的无缝集成

Composition API 返回的数据可以直接在模板中使用，无需额外处理：

```vue
<script setup>
const { userList, loading, fetchUsers } = useUser();
</script>

<template>
    <div>
        <div v-if="loading">Loading...</div>
        <ul v-else>
            <li v-for="user in userList" :key="user.id">
                {{ user.name }}
            </li>
        </ul>
        <button @click="fetchUsers">Refresh</button>
    </div>
</template>
```

### 类似对比示例：状态管理

#### Vue2 中的状态管理

```javascript
// store.js
class Store {
    constructor() {
        this.state = {
            count: 0,
        };
    }

    increment() {
        this.state.count++;
    }

    decrement() {
        this.state.count--;
    }
}

// 在组件中使用
export default {
    data() {
        return {
            localCount: this.$store.state.count,
        };
    },
    watch: {
        "$store.state.count"(newVal) {
            this.localCount = newVal;
        },
    },
    methods: {
        increment() {
            this.$store.increment();
        },
    },
};
```

#### Vue3 Composition API 状态管理

```javascript
// useCounter.js
import { ref } from 'vue'

const count = ref(0)

export function useCounter() {
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  return {
    count,
    increment,
    decrement
  }
}

// 在组件中使用
<script setup>
import { useCounter } from './useCounter'

const { count, increment, decrement } = useCounter()
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

### 封装方式对比总结

| 特性        | Vue2 模块封装  | Composition API  | 优化点                |
| ----------- | -------------- | ---------------- | --------------------- |
| 响应式集成  | 需要手动处理   | 原生支持         | 简化响应式数据处理    |
| 代码组织    | 按功能划分文件 | 按逻辑关注点组织 | 更符合逻辑思维        |
| 复用性      | 需要实例化     | 直接导入使用     | 更简洁的复用方式      |
| 类型支持    | 有限           | 完善             | 更好的开发体验        |
| 与 Vue 集成 | 松耦合         | 紧耦合           | 更自然的 Vue 开发体验 |

## 总结

通过对 Vue2 和 Vue3 在多个维度的对比，我们可以看到 Vue3 在各个方面都有显著的改进：

1. **响应式系统**：从 Object.defineProperty 升级到 Proxy，解决了 Vue2 的诸多限制
2. **虚拟 DOM 和 Diff 算法**：引入静态提升、预字符串化、Block Tree 等优化，大幅提升渲染性能
3. **生命周期**：保持兼容性的同时，通过 Composition API 提供了更灵活的组织方式
4. **API 设计**：Composition API 提供了更好的逻辑组织和复用能力，解决了 Options API 在大型项目中的局限性

虽然 Vue2 中也可以通过模块封装实现逻辑复用，但 Composition API 与 Vue 的响应式系统深度集成，提供了更好的开发体验和更强的功能。对于新项目，建议使用 Vue3 和 Composition API；对于已有 Vue2 项目，可以根据实际情况考虑是否升级。

如果你想了解更多 Vue 相关的知识，可以查看我们之前的文章，比如[Vue 路由传参的几种方式](./vue路由传参的几种方式.md)或者[为什么 vue template 中不用加.value?](./为什么vue-template中不用加-value.md)。
