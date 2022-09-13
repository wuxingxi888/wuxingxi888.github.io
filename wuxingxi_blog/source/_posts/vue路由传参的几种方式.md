---
title: vue路由传参的几种方式
date: 2021-11-15 18:55:48
tags: vue
categories: vue
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

### 路由跳转的两种方式

#### 1. 声明式导航



```html
1. 使用router-link的to属性进行路由跳转 to的值是要跳转到的那个路由

// 1.1 to后直接跟路由
<router-link to="/home">to home</router-link> 
// 1.2 to后跟一个配置对象path属性是要跳转到的那个路由
<router-link :to="{ path: '/home' }">to home</router-link> 
// 1.3 to后跟一个配置对象，使用命名路由的name进行跳转
<router-link :to="{ name: 'homeIndex' }">to home</router-link>

2. 查询字符串形式 路由传参  to的值是一个配置对象 以查询字符串形式携带 url?id=123
// 2.1 以 url?id=123&name=zs的形式携带
<router-link :to="{ path: '/home?id=123' }">to home?id=123</router-link>
// 2.2 以query属性进行传参
<router-link :to="{ path: '/home', query: { id: 123 } }">to home 以query携带</router-link>
// 2.3 以params进行传参 需要命名路由name
<router-link :to="{ name: 'userIndex', params: { id: 123 } }">to user 以params携带</router-link>
```

#### 2. 编程式导航



```vue
1. 使用this.$router进行跳转 $router可以访问到路由的实例

this.$router.push('/home')
this.$router.push('/home?id=123')
this.$router.push({ path: '/home', query: { id: 123 } })
this.$router.push({ name: 'homeIndex', params: { id: 123 } })

2. $router实例的跳转方法
push() 跳转到指定的路由，向history历史中添加记录，点击返回，返回到来之前的路由。
go(n) 向前前进 n 或 后退 n个路由 n可为负数
replace() 跳转到指定的路由，但是不会在history中添加记录，点击返回，会跳转到上上一个路由。
back() 后退
forward() 前进
```

#### 3. 参数的接收



```vue
// 1. 查询字符串   url?id123    query
this.$route.query

// 2. params
this.$route.params
```

**注意:**
 以查询字符串 query进行传递的参数，刷新页面，数据依然存在。
 以params传递的参数，刷新页面就会丢失。
 跳转用$router
 获取参数用$route
