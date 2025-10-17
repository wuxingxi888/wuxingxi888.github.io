---
title: vue-cli 3/4兼容Android低版本白屏问题
date: 2021-10-29 16:01:49
tags: vue android 前端框架
categories: 前端框架
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---



#### 问题描述：

​	运行很久的H5页面，突然大量用户反馈打开页面白屏，根据多方问题排查 最终确定是Android版本导致的 目前已知Android6.0运行是OK的 Android5.0环境允许白屏 ，具体原因是低版本安卓系统内置的 webview 不支持 ES6 语法等一些新特性，所以报错。

1. 根目录下新建 .babelrc 文件

   ```javascript
   {
     "presets": ["@babel/preset-env"],
     "plugins": [
       "@babel/plugin-transform-runtime"
     ]
   }
   
   ```

2. 修改 babel.config.js

   ```javascript
   module.exports = {
   	presets: [
   		[
   			'@vue/app',
   			{
   				useBuiltIns: 'entry',
   				polyfills: [
   					'es6.promise',
   					'es6.symbol'
   				]
   			}
   		]
   	]
   }
   ```

3. 修改 main.js 文件，导入依赖

   ```javascript
   import '@babel/polyfill'
   import Es6Promise from 'es6-promise'
   
   require('es6-promise').polyfill()
   Es6Promise.polyfill()
   ```

4. 配置vue.config.js

   ```javascript
   const path = require('path');
   
   function resolve(dir) {
     return path.join(__dirname, '.', dir);
   }
   
   module.exports = {
     ...  // 其他配置
       
     // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。
     // 如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
     // 重要
     transpileDependencies: ['node_modules/webpack-dev-server/client'],
     chainWebpack: config => {
       //重要
       config.entry.app = ['@babel/polyfill', './src/main.js']
         
       //重要：通过add方法，配置babel需要另外转换的文件
       config.module.rule('compile')
         .test(/\.js$/)
         .include
         .add(resolve('src'))
         .add(resolve('test'))
         .add(resolve('static'))
         .add(resolve('node_modules/webpack-dev-server/client'))
         .add(resolve('node_modules'))
         .end()
         .use('babel')
         .loader('babel-loader')
         .options({
           presets: [
             ['@babel/preset-env', {
               modules: false
             }]
           ]
         });
     }
   }
   
   ```

5. 安装的依赖

   ```javascript
   npm install --save-dev @babel/core @babel/plugin-transform-runtime @babel/preset-env es6-promise @babel/polyfill babel-plugin-transform-remove-console
   
   ```

6. 注意：如果发布到测试环境和线上环境时，发现没有生效，主要问题在第5步安装依赖，npm时使用–save-dev只会将依赖保存到package.json的devDependencies中，只有开发环境才有效，其他环境无效；故将命令修改为以下命令：

   ```javascript
   # 如果知道依赖的确切版本，可以直接配置到package.json的dependencies中
   npm install --save @babel/core @babel/plugin-transform-runtime @babel/preset-env es6-promise @babel/polyfill 
   
   #  To install it, you can run: npm install --save -- 
   #  @babel/runtime/helpers/createForOfIteratorHelper 
   #  如果上一步没有报缺少该依赖，可以不要
   npm install –save @babel/runtime 
   
   ```

7. **–save-dev说明：**

```javascript
--save || -S // 运行依赖（发布）
–save-dev || -D //开发依赖（辅助）

区别是它们会把依赖包添加到package.json 文件

–save ： dependencies 键下，发布后还需要依赖的模块，譬如像jQuery库或者Angular框架类似的，我们在开发完后后肯定还要依赖它们，否则就运行不了。
(1)尽量还是使用此命令，因为一般情况下，我们线上也需要同样的依赖
(2)使用此命令安装后，会在package.json中dependencies新增依赖项，如果我们知道依赖项确切版本，也可以直接到json文件添加，以后在打包时，直接npm install即可

–save-dev ： devDependencies 键下，开发时的依赖比如安装 js的压缩包gulp-uglify 因为我们在发布后用不到它，而只是在我们开发才用到它。

```

