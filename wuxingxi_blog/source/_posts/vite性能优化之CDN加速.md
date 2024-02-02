---
title: vite性能优化之CDN加速
date: 2024-02-02 10:59:20
tags: vite vue
categories: vite vue
top_img:
cover: https://s2.loli.net/2024/02/02/8cRdqZbAUnhVeLE.webp
---

### CDN 加速

内容分发网络（Content Delivery Network，简称 CDN）就是让用户从最近的服务器请求资源，提升网络请求的响应速度。同时减少应用打包出来的包体积，利用浏览器缓存，不会变动的文件长期缓存。(不建议使用第三方cdn，这里做学习讨论使用)

### 采用CDN引入的弊端：

1、可靠性：使用CDN引入外部模块意味着依赖于第三方服务商的可用性和稳定性。如果CDN服务商发生故障或者网络问题，可能会导致外部模块无法加载，影响网站的正常运行

2、安全性：使用CDN引入外部模块需要信任第三方服务商，因为模块实际上是从服务商的服务器上加载的。如果服务商被黑客攻击或者恶意篡改了模块的内容，可能会导致安全问题

3、性能：CDN服务通常会根据用户的地理位置选择最近的节点进行内容分发，这样可以减少网络延迟和提高访问速度。但是如果用户所在地区的CDN节点发生故障或者网络拥堵，可能会导致加载速度变慢甚至加载失败

4、版本控制：使用CDN引入外部模块可能会导致版本控制的问题。如果模块的版本发生变化，CDN服务商可能会立即更新节点上的内容，这样可能会导致网站出现兼容性问题或者功能异常



### 代码实现

#### 安装插件

```javascript
install rollup-plugin-external-globals -D
```

#### vite.config.ts里面配置 

1. 允许设置延迟加载
2. rollupOptions需要设置external
3. 具体的CDN链接根据自己需要去官网或是CDN网站查询，**cdn网站：[cdnjs.com/](https://link.juejin.cn/?target=https%3A%2F%2Fcdnjs.com%2F)**

```
import externalGlobals from 'rollup-plugin-external-globals'

const externalGlobalsObj = {
	'vue': 'Vue',
	'vue-demi': 'VueDemi',
	'vue-router': 'VueRouter',
	'pinia': 'Pinia',
	'vant': 'vant',
	'axios': 'axios'
}

export default defineConfig({
  plugins: [
    vue(),
    {
      ...externalGlobals(externalGlobalsObj),
      enforce: 'post',
      apply: 'build',
    },
  ],
  build: {
    outDir: 'dist', // 指定输出路径
    rollupOptions: {
      external: Object.keys(externalGlobalsObj),
    },
  }
})
```

#### 手动在打包后的index添加CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
    <link href="https://cdn.jsdelivr.net/npm/vant@4.8.3/lib/index.min.css" rel="preload" as="style" />
    <script src="https://cdn.jsdelivr.net/npm/vue@3.4.15/dist/vue.global.prod.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@4.8.3/lib/vant.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.5/dist/vue-router.global.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-demi@0.14.6/lib/index.iife.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pinia@2.1.7/dist/pinia.iife.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
    <script type="module" crossorigin src="/assets/index-c24c670c.js"></script>
    <link rel="stylesheet" href="/assets/index-f757e912.css">
  </head>
  <body>
    <div id="app"></div>
    
  </body>
</html>

```



#### 不想手动添加的同学可以配置自动添加

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import externalGlobals from 'rollup-plugin-external-globals'

const cdn = {
    css: ["https://cdn.jsdelivr.net/npm/vant@4.8.3/lib/index.min.css"],
    js: [
        "https://cdn.jsdelivr.net/npm/vue@3.4.15/dist/vue.global.prod.js",
        "https://cdn.jsdelivr.net/npm/vant@4.8.3/lib/vant.min.js",
        "https://cdn.jsdelivr.net/npm/vue-router@4.2.5/dist/vue-router.global.min.js",
        "https://cdn.jsdelivr.net/npm/vue-demi@0.14.6/lib/index.iife.min.js",
        'https://cdn.jsdelivr.net/npm/pinia@2.1.7/dist/pinia.iife.min.js',
        "https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js",
    ],
};

const externalGlobalsObj = {
	'vue': 'Vue',
	'vue-demi': 'VueDemi',
	'vue-router': 'VueRouter',
	'pinia': 'Pinia',
	'vant': 'vant',
	'axios': 'axios'
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      vue(),
        {
          name: 'custom-html-transform',
          transformIndexHtml(html) {
              // 获取配置中的 CDN 资源
              const cdnCss = cdn && cdn.css || [];
              const cdnJs = cdn && cdn.js || [];

              // 生成 CSS 预加载和链接标签
              const cssTags = cdnCss.map(url => `<link href="${url}" rel="preload" as="style" />
                                                <link href="${url}" rel="stylesheet" />`).join('\n');

              // 生成 JS 脚本标签
              const jsTags = cdnJs.map(url => `<script src="${url}" defer></script>`).join('\n');

              // 替换原始 HTML 中的占位符
              html = html.replace('<!--CDN_CSS-->', cssTags);
              html = html.replace('<!--CDN_JS-->', jsTags);

              return html;
          }
      },
      {
        ...externalGlobals(externalGlobalsObj),
        enforce: 'post',
        apply: 'build',
      },
    ],
    build: {
      outDir: 'dist', // 指定输出路径
      // minify: 'terser', // 混淆器，terser 构建后文件体积更小，'terser' | 'esbuild' ,默认为esbuild
      rollupOptions: {
        external: Object.keys(externalGlobalsObj),
      },
    }
  }
})

```



#### 修改你的 `public/index.html` 文件，添加占位符：

```html
<!-- public/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--CDN_CSS-->
</head>
<body>
  <div id="app"></div>
  <!--CDN_JS-->
</body>
</html>

```



需要注意使用CDN未必会加快速度，只能减小打包体积，因为对应js和css需要从远程地址读取，如果CDN的资源出现错误，那么所引入的项目也会出现错误，建议把资源都Down到本地，然后在引入本地的链接，保证不会被所引入资源报错影响
开发环境不走CDN，只有构建后走！！！
