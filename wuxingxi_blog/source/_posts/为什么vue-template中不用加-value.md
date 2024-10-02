---
title: 为什么vue template中不用加.value?
date: 2024-10-02 00:16:04
tags: vue3
categories: vue
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

vue3 中定义的 ref 类型变量，在 setup 中使用这些变量是需要带上.value 才可以访问的，但是在 template 中却可以直接使用。why？你可能会说 vue 自动进行 ref 解包了，那具体是如何实现的的？

### proxyRefs

vue3 中有个方法 proxyRefs，这属于底层方法，在官方文档中并没有阐述，但是 vue 里是可以导出这个方法！

例如：

```vue
<script setup lang="ts">
import { onMounted, ref, proxyRefs } from "vue";

const user = {
  name: "James",
  age: ref(18),
};

const _user = proxyRefs(user);

onMounted(() => {
  console.log(_user.name);
  console.log(_user.age);
  console.log(user.age);
});
</script>
```

上面代码定义了一个普通对象 user，其中 age 属性的值是 ref 类型。当访问 age 值当时候，需要通过 user.age.value，而使用了 proxyRefs，则可以直接通过 user.age 来访问。

这也就是 template 中为什么不用加.value 的原因，vue3 源码中使用 proxyRefs 方法将 setup 返回的对象进行处理。

### 实现 proxyRefs

#### 单列测试

```typescript
it("proxyRefs", () => {
    const user = {
        name: "jack",
        age: ref(10),
    }

    const proxyUser = proxyRefs(user)；

    expect（user.age.value）.toBe（10）；
    expect(proxyUser.age).toBe(10);

    proxyUser.age = 20;
    expect(proxyUser age).toBe(20);
    expect （user.age.value）.toBe（20）；

    proxyUser.age = ref（30）；
    expect(proxyUser.age).toBe(30);
    expect(user.age.value).toBe(30);
 ｝）；
```

定义一个 age 属性值为 ref 类型的普通对象 user。 proxyRefs 方法需要满足：

1.proxyUsen 直接访问 age 是可以直接获取到 10。

2.当修改 proxyUser 的 age 值切这个值不是 ref 类型时，proxyUser 和原数据 user 都会被修改。

3.age 值被修改为 ref 类型时，proxyUser 和 user 也会都更新

#### 实现

既然是访问和修改对象内部的属性值，就可以使用 Proxy 来处理 get 和 set。先来实现 get。

```typescript
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {},
  });
}
```

需要实现的是 proxyUser.age 能直接获取到数据，那原数据 target［key］是 ref 类型，只需要将 ref.value 转成 value。使用 unref 即可实现。

```typescript
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unref(Reflect.get(target, key));
    },
  });
}
```

实现 set

```typescript
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unref(Reflect.get(target, key));
    },
    set(target, key, value) {},
  });
}
```

从单侧中可以看出，我们是测试了两种情况，一种是修改 proxyUsen 的 age 为 ref 类型，一种是修改成不是 ref 类型的，但是结果都是同步更新 proxyUser 和 user。那实现上也需要考虑这两种情况，需要判断原数据值是不是 ref 类型，新赋的值是不是 ref 类型。

```typescript
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unref(Reflect.get(target, key));
    },
    set(target, key, value) {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    },
  });
}
```
