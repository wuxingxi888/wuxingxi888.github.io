---
title: vue中使用svg
date: 2021-05-12 14:10:35
tags: vue
categories: vue
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

先安装svg-sprite-loader

```
npm install svg-sprite-loader --save
```

vue.config.js

```
const path = require('path')
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader,否则接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, './src/assets/icons'))// 配置icons的目录  
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      .exclude.add(path.resolve(__dirname, './src/assets/icons')) // 配置icons的目录
      .end()
      .use('file-loader')
      .loader('file-loader')
  }
}
```

新建一个IconSvg.vue

```
<template>
    <svg class="svg-icon" aria-hidden="true" v-on="$listeners">
      <use :xlink:href="iconName" />
    </svg>
</template>
   
<script>
  export default {
    name: "icon-svg",
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ""
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.iconClass}`;
      },
      svgClass() {
        if (this.className) {
          return "svg-icon " + this.className;
        } else {
          return "svg-icon";
        }
      }
    }
  };
</script>
   
  <style>
  .svg-icon {
    width: 100%;
    height: 100%; 
    fill: currentColor;
    overflow: hidden;
  }
  </style>
```

在main.js中注入svg事件

```
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

//引入svg组件
import IconSvg from './components/IconSvg'

// //全局注册svg-icon
Vue.component('svg-icon', IconSvg)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

在组件中的使用
app.vue

```
<template>
  <div id="app">
    <router-view></router-view>
    <footer  v-if="$route.meta.footShow">
      <ul>
        <router-link to="/home">
          <li :class="{liactive:$route.path.includes('/home')}">
            <span v-if="$route.path.includes('/home')">
              <svg-icon  icon-class="shuaxin"/>
              刷新
            </span>
            <span v-else>
              <svg-icon  icon-class="shouye"/>
              首页
            </span>            
          </li>
        </router-link>
        <router-link to="/writer">
          <li>
              <svg-icon   icon-class="jia"/>
              发布
          </li>
        </router-link>
        <router-link to="/personal">
          <li :class="{liactive:$route.path.includes('/personal')}">
            <svg-icon v-if="$route.path.includes('/personal')"   icon-class="wode_mian"/>
            <svg-icon v-else  icon-class="wode"/>
            我的
          </li>
        </router-link>
      </ul>
    </footer>
  </div>
</template>

<script>
import "@/assets/icons/shouye.svg"
import "@/assets/icons/shuaxin.svg"
import "@/assets/icons/jia.svg"
import "@/assets/icons/wode.svg"
import "@/assets/icons/wode_mian.svg"
export default {
  name: 'app',
  components: {
   
  },
  methods:{
    //跳转页面
    pageTo:function(index){
      this.indexPage = index;
        this.$router.replace(index)
    },
  }
}
</script>

<style>

</style>
```

如何更改svg的颜色
首先，确保 .svg文件中

```
fill="currentColor"
```

然后为</加上class=”XXX”

```
<svg-icon class="xiaoxi-svg" icon-class="xiaoxi" />
<style>
.xiaoxi-svg{
width: 26px;
height: 26px;
color: #66b1ff;
vertical-align: top;
}
</style>
```
