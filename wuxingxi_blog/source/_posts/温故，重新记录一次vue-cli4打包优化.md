---
title: 温故，重新记录一次vue-cli4打包优化
date: 2023-01-19 12:16:58
tags: vue vue-cli4 webpack 前端框架
categories: 前端框架
top_img:
cover: https://s2.loli.net/2024/01/17/BIXVTMKPUwecxbn.png
---

#### vue-cli4打包优化

##### 一、 配置 proxy 跨域

使用vue-cli发开项目，在本地开发环境中，如果遇到跨域的问题。可以通过配置proxy的方式，解决跨域问题：

```javascript
module.exports = {
  devServer: {
   open: false, // 自动启动浏览器
   host: '0.0.0.0', // localhost
   port: 6060, // 端口号
   hotOnly: false, // 热更新

   overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    },
    proxy: {
      //配置跨域
      '/api': {
        target: 'https://www.test.com', // 接口的域名
        // ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
```

配置完成后，当我们在去请求https://www.test.com/v1/api/userinfo接口时，就可以这么写

```javascript
this.axios({
url:'/api/v1/api/userinfo',
method:'get'
}).then(res=>{
//......
})
```

##### 二、配置 alias 别名

使用vue-cli开发项目，最大特色是组件化。组件中频繁引用其他组件或插件。我们可以把一些常用的路径定义成简短的名字。方便开发中使用。

```javascript
//加载path模块
const path = require('path')
//定义resolve方法，把相对路径转换成绝对路径
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
  }
}
```

配置完成后，我们在项目中可以这样写路径

```html
//之前这么写
import Home from '../views/Home.vue'
//配置alias别名后
import Home from 'views/Home.vue'
//也可以这么写
import Home from '@/views/Home.vue'
```

项目结束后打包前webpack配置
目的：

提高打包速度
减小项目体积、提高首屏加载速度
提高用户体验（骨架屏）
打包前必做
项目开发完成后，运行npm run build进行打包操作。打包前对webpack配置。

```javascript
module.exports = {
  publicPath: './', // 静态资源路径（默认/，打包后会白屏）
  outputDir: 'dist', // 打包后文件的目录 （默认为dist）
  assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录  默认为‘’没有单独目录js/css/img在根目录中。
  }
```

###### 一、去除生产环境sourceMap

问题： vue项目打包之后js文件夹中，会自动生成一些map文件，占用相当一部分空间

sourceMap资源映射文件，存的是打包前后的代码位置，方便开发使用，这个占用相当一部分空间。

map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错，有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。

生产环境是不需要sourceMap的，如下配置可以去除

```javascript
module.exports = {
  //去除生产环境的productionSourceMap
  productionSourceMap: false,
}
```

去除sourceMap前后对比，减少了很大体积。

前：dist大小为7M

后：dist大小为3M

###### 二、去除console.log打印以及注释

下载插件

```javascript
cnpm install uglifyjs-webpack-plugin --save-dev
```

```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';

  configureWebpack: config => {
    const plugins = [];
    if (isProduction) {
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false, // 去掉注释
            },
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']//移除console
            }
          }
        })
      )
    }
  },
```

结论：重新打包，dist体积减少并不大。因为congsole.log()以及注释并不会占用太多体积（也就10-30kb）

###### 三、使用CDN 加速优化

cdn优化是指把第三方库比如（vue，vue-router，axios）通过cdn的方式引入项目中，这样vendor.js会显著减少，并且大大提升项目的首页加载速度，下面是具体操作：

```javascript
const isProduction = process.env.NODE_ENV === 'production';

// externals
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  vant: 'vant',
  axios: 'axios'
}
// CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
 // 生产环境
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js'
    ]
  }
}
module.exports = {
  configureWebpack: config => {
    // 为生产环境修改配置...
    if (isProduction) {
      // externals
      config.externals = externals
    }
  },
  chainWebpack: config => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中
     */
    config.plugin('html').tap(args => {
      if (isProduction) {
        args[0].cdn = cdn.build
      } else {
        args[0].cdn = cdn.dev
      }
      return args
    })
  }
}
```

在 public/index.html 中添加

```html
<!-- 使用CDN的CSS文件 -->
<% for (var i in
  htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.css) { %>
  <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="preload" as="style" />
  <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet" />
<% } %>
 <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
<% for (var i in
  htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
  <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
<% } %>
```
总结：配置了cdn引入，1.1M体积较少到660kb。效果很明显。

###### 四、对资源文件进行压缩

需要下载 compression-webpack-plugin

```javascript
cnpm i compression-webpack-plugin -D
```

vue.config.js 中按照如下方式进行配置：

```javascript
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  // 根据你的实际情况更改这里
  publicPath,
  assetsDir: 'assets',
  lintOnSave: true,
  configureWebpack: {
    plugins:[
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        // test: /\.js$|\.html$|\.json$|\.css/,
        test: /\.js$|\.json$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: true // 删除原文件
      })
    ],
  },
}
```

压缩后也会节省一部分空间，单后端要对nginx修改，配合前端

nginx配置示例：

```javascript
location ~ .*\.(js|json|css)$ {
    gzip on;
    gzip_static on; # gzip_static是nginx对于静态文件的处理模块，该模块可以读取预先压缩的gz文件，这样可以减少每次请求进行gzip压缩的CPU资源消耗。
    gzip_min_length 1k;
    gzip_http_version 1.1;
    gzip_comp_level 9;
    gzip_types  text/css application/javascript application/json;
    root /dist;
}
```

压缩前后大小大致如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210116175735462.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzYzODk2OA==,size_16,color_FFFFFF,t_70)

 可以看到相应头中存在 Content-Encoding:gzip 表示已经配置成功

![20210116175431533](https://img-blog.csdnimg.cn/20210116175431533.png)

 

###### 五、图片压缩

一张图片压缩前后对比：

![](https://img-blog.csdnimg.cn/2021011614592414.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzYzODk2OA==,size_16,color_FFFFFF,t_70)

需要下载 image-webpack-loader

```javascript
npm install image-webpack-loader --save-dev
```

```javascript
module.exports = {
  // 根据你的实际情况更改这里
  publicPath,
  assetsDir: 'assets',
  lintOnSave: true,
  // image 压缩 定义在chainWebpack中
 chainWebpack: config => {
   config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()}
}
```

1、此插件容易下载失败，导致运行报错

```javascript
若安装过 image-webpack-loader 先卸载
//npm 安装的npm 则npm 移除
npm uninstall image-webpack-loader
//如果yarn安装的，则yarn 移除
yarn remove image-webpack-loader 
```

2、使用 cnpm , 这一步意思就是安装 cnpm 然后将全局的 registry 设置成阿里的镜像，国内阿里比较快

```javascript
npm install cnpm -g --registry=https://registry.npm.taobao.org
```

3、使用 cnpm 安装 image-webpack-loader 会发现很快就安装好了，【手动滑稽】

```javascript
cnpm install --save-dev image-webpack-loader
```

###### 六、只打包改变的文件

```javascript
const { HashedModuleIdsPlugin } = require('webpack');
configureWebpack: config => {    
    const plugins = [];
    plugins.push(
        new HashedModuleIdsPlugin()
    )
}
```

###### 七、公共代码抽离

如何提取公共代码？

从webpack4开始官方移除了commonchunk插件，改用了optimization属性进行更加灵活的配置，这也应该是从V3升级到V4的代码修改过程中最为复杂的一部分

```javascript
splitChunks: {
    chunks: "async”,//默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
    minSize: 30000,  //表示在压缩前的最小模块大小,默认值是30kb
    minChunks: 1,  // 表示被引用次数，默认为1；
    maxAsyncRequests: 5,  //所有异步请求不得超过5个
    maxInitialRequests: 3,  //初始话并行请求不得超过3个
   automaticNameDelimiter:'~',//名称分隔符，默认是~
    name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
    cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
       common: {
         name: 'common',  //抽取的chunk的名字
         chunks(chunk) { //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取
         },
         test(module, chunks) {  //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。自己尝试过程中发现不能提取出css，待进一步验证。
         },
        priority: 10,  //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
       minChunks: 2,  //最少被几个chunk引用
       reuseExistingChunk: true，//  如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
       enforce: true  // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
       }
    }
}
```

公共模块抽离
举例：

项目中分别有a.js, b.js, page1.js, page2.js这四个JS文件， page1.js 和
page2.js中同时都引用了a.js, b.js， 这时候想把a.js, b.js抽离出来合并成一个公共的js，然后在page1,page2中自动引入这个公共的js，怎么配置呢？

第三方模块抽离

页面中有时会引入第三方模块，比如import $ from ‘jquery’;
page1中需要引用，page2中也需要引用，这时候就可以用vendor把jquery抽离出来，

如下：

```javascript
// 公共代码抽离
configureWebpack: config => {
//....
//优化项配置

config.optimization = {
    splitChunks: { // 分割代码块
        cacheGroups: {
            vendor: {//第三方库抽离
                chunks: 'all',
                test: /node_modules/,
                name: 'vendor',
                minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                maxInitialRequests: 5,
                minSize: 0,//大于0个字节
                priority: 100//权重
            },
            common: {  //公用模块抽离
                chunks: 'all',
                test: /[\\/]src[\\/]js[\\/]/,
                name: 'common',
                minChunks: 2,在分割之前，这个代码块最小应该被引用的次数
                maxInitialRequests: 5,
                minSize: 0,//大于0个字节
                priority: 60
            },
            styles: { //样式抽离
                name: 'styles',
                test: /\.(sa|sc|c)ss$/,
                chunks: 'all',
                enforce: true
            },
            runtimeChunk: {
                name: 'manifest'
            }
        }
    }
}
}
```

###### 八、配置 打包分析

安装

```
cnpm i webpack-bundle-analyzer -D
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  chainWebpack: config => {
    // 打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  }
}
```

###### 九、骨架屏

安装插件 

```
npm install vue-skeleton-webpack-plugin
```

在src下新建Skeleton文件夹，其中新建index.js以及index.vue，在其中写入以下内容，其中，骨架屏的index.vue页面样式请自行编辑

```html
index.js

import Vue from 'vue'
import home from './index.vue'
import list from './list.vue'
export default new Vue({
  components: {
    home,
    list
  },
  template: `

  <div>
   <home id="home" style="display:none"/>
   <list id="list" style="display:none"/>
  </div>

 `
})
```

index.vue(骨架屏页面) list.vue同理

```html
<template>
  <div class="skeleton-wrapper">
    <header class="skeleton-header"></header>
    <section class="skeleton-block">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAyNjEiPjxkZWZzPjxwYXRoIGlkPSJiIiBkPSJNMCAwaDEwODB2MjYwSDB6Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgeD0iLTUwJSIgeT0iLTUwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii0xIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd09mZnNldE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTMzMzMzMzMzIDAgMCAwIDAgMC45MzMzMzMzMzMgMCAwIDAgMCAwLjkzMzMzMzMzMyAwIDAgMCAxIDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCA0NGg1MzN2NDZIMjMweiIvPjxyZWN0IHdpZHRoPSIxNzIiIGhlaWdodD0iMTcyIiB4PSIzMCIgeT0iNDQiIGZpbGw9IiNGNkY2RjYiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCAxMThoMzY5djMwSDIzMHpNMjMwIDE4MmgzMjN2MzBIMjMwek04MTIgMTE1aDIzOHYzOUg4MTJ6TTgwOCAxODRoMjQydjMwSDgwOHpNOTE3IDQ4aDEzM3YzN0g5MTd6Ii8+PC9nPjwvc3ZnPg==">
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAyNjEiPjxkZWZzPjxwYXRoIGlkPSJiIiBkPSJNMCAwaDEwODB2MjYwSDB6Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgeD0iLTUwJSIgeT0iLTUwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii0xIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd09mZnNldE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTMzMzMzMzMzIDAgMCAwIDAgMC45MzMzMzMzMzMgMCAwIDAgMCAwLjkzMzMzMzMzMyAwIDAgMCAxIDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCA0NGg1MzN2NDZIMjMweiIvPjxyZWN0IHdpZHRoPSIxNzIiIGhlaWdodD0iMTcyIiB4PSIzMCIgeT0iNDQiIGZpbGw9IiNGNkY2RjYiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCAxMThoMzY5djMwSDIzMHpNMjMwIDE4MmgzMjN2MzBIMjMwek04MTIgMTE1aDIzOHYzOUg4MTJ6TTgwOCAxODRoMjQydjMwSDgwOHpNOTE3IDQ4aDEzM3YzN0g5MTd6Ii8+PC9nPjwvc3ZnPg==">
    </section>
  </div>
</template>
 
<script>
  export default {
    name: 'skeleton'
  }
</script>
 
<style scoped>
  .skeleton-header {
    height: 40px;
    background: #1976d2;
    padding:0;
    margin: 0;
    width: 100%;
  }
  .skeleton-block {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
  }
 
</style>
```

vue.config.js 配置

```javascript
//骨架屏渲染
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')

//path引入
const path = require('path')

//configureWebpack模块中写入内容
// 骨架屏渲染
config.plugins.push(new SkeletonWebpackPlugin({
      webpackConfig: {
        entry: {
          app: path.join(__dirname, './src/Skeleton/index.js'),
        },
      },
      minimize: true,
      quiet: true,
      // 如果不设置那么所有的路由都会共享这个骨架屏组件
      router: {
        mode: 'hash',
        // 给对应的路由设置对应的骨架屏组件，skeletonId的值根据组件设置的id
        routes: [
          { path: '/home', skeletonId: 'home' },
          { path: '/list', skeletonId: 'list' },
        ]
    }))
```

##### 三、完整配置

vue.config.js完整配置

```javascript
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 去掉注释
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 开启压缩
const { HashedModuleIdsPlugin } = require('webpack');
 
function resolve(dir) {
    return path.join(__dirname, dir)
}
 
const isProduction = process.env.NODE_ENV === 'production';
 
// cdn预加载使用
const externals = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios',
    "element-ui": "ELEMENT"
}
 
const cdn = {
    // 开发环境
    dev: {
        css: [
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        ],
        js: []
    },
    // 生产环境
    build: {
        css: [
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        ],
        js: [
            'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
            'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
            'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
            'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
            'https://unpkg.com/element-ui/lib/index.js'
        ]
    }
}
 
module.exports = {
 
    lintOnSave: false, // 关闭eslint
    productionSourceMap: false,
    publicPath: './', 
    outputDir: process.env.outputDir, // 生成文件的目录名称
    chainWebpack: config => {
 
        config.resolve.alias
            .set('@', resolve('src'))
 
        // 压缩图片
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
 
        // webpack 会默认给commonChunk打进chunk-vendors，所以需要对webpack的配置进行delete
        config.optimization.delete('splitChunks')
 
        config.plugin('html').tap(args => {
            if (process.env.NODE_ENV === 'production') {
                args[0].cdn = cdn.build
            }
            if (process.env.NODE_ENV === 'development') {
                args[0].cdn = cdn.dev
            }
            return args
        })
 
        config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    },
 
    configureWebpack: config => {
        const plugins = [];
 
        if (isProduction) {
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                })
            )
            // 服务器也要相应开启gzip
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: /\.(js|css)$/,// 匹配文件名
                    threshold: 10000, // 对超过10k的数据压缩
                    deleteOriginalAssets: false, // 不删除源文件
                    minRatio: 0.8 // 压缩比
                })
            )
 
            // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
            plugins.push(
                new HashedModuleIdsPlugin()
            )
 
            // 开启分离js
            config.optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 1000 * 60,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // 排除node_modules 然后吧 @ 替换为空 ,考虑到服务器的兼容
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            };
 
            // 取消webpack警告的性能提示
            config.performance = {
                hints: 'warning',
                //入口起点的最大体积
                maxEntrypointSize: 1000 * 500,
                //生成文件的最大体积
                maxAssetSize: 1000 * 1000,
                //只给出 js 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.js');
                }
            }
 
            // 打包时npm包转CDN
            config.externals = externals;
        }
 
        return { plugins }
    },
 
    pluginOptions: {
        // 配置全局less
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [resolve('./src/style/theme.less')]
        }
    },
    devServer: {
        open: false, // 自动启动浏览器
        host: '0.0.0.0', // localhost
        port: 6060, // 端口号
        https: false,
        hotOnly: false, // 热更新
        proxy: {
            '^/sso': {
                target: process.env.VUE_APP_SSO, // 重写路径
                ws: true,   //开启WebSocket
                secure: false,      // 如果是https接口，需要配置这个参数
                changeOrigin: true
            }
        }
    }
}
```

