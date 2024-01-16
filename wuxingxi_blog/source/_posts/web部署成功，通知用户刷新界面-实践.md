---
title: web部署成功，通知用户刷新界面 实践
date: 2024-01-16 19:41:08
tags: web javascript
categories: web javascript
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/javascript.jpeg"
---



### 使用场景

​	当我们成功部署web应用之后，由于页面没有及时刷新，导致数据存在差异  无法体验到最新的功能等问题。



### 代码实现

```javascript
interface Options {
	timer?: number
}

export class Updater {
	oldScript: string[] // 存储第一次值也就是script 的hash 信息
	newScript: string[] // 获取新的值 也就是新的script 的hash信息
	dispatch: Record<string, Array<() => void>> // 小型发布订阅通知用户更新了
	timer: NodeJS.Timeout | null = null

	constructor(options: Options) {
		this.oldScript = []
		this.newScript = []
		this.dispatch = {}
		this.init() // 初始化
		this.timing(options?.timer) // 轮询
	}

	async init(): Promise<void> {
		try {
			const html: string = await this.getHtml()
			this.oldScript = this.parseScript(html)
		} catch (error) {
			console.error('Error initializing Updater:', error)
		}
	}

	async getHtml(): Promise<string> {
		const html = await fetch('/').then((res) => res.text()) // 读取index html
		return html
	}

	parseScript(html: string): string[] {
		const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi) // script正则
		return html.match(reg) as string[] // 匹配script标签
	}

	// 发布订阅通知
	on(key: 'no-update' | 'update', fn: () => void): this {
		;(this.dispatch[key] || (this.dispatch[key] = [])).push(fn)
		return this
	}

	compare(oldArr: string[], newArr: string[]): void {
		const base = oldArr.length
		const arr = Array.from(new Set(oldArr.concat(newArr)))
		// 如果新旧length一样无更新
		if (arr.length === base) {
			this.dispatch['no-update']?.forEach((fn) => fn())
		} else {
			// 否则通知更新
			this.dispatch['update']?.forEach((fn) => fn())
		}
	}

	timing(time = 10000): void {
		// 轮询
		this.timer = setInterval(async () => {
			try {
				const newHtml = await this.getHtml()
				this.newScript = this.parseScript(newHtml)
				this.compare(this.oldScript, this.newScript)
			} catch (error) {
				console.error('Error during polling:', error)
			}
		}, time)
	}

	// 取消轮询
	stopTiming(): void {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	}
}
```



### 使用方法

```
//实例化该类
const up = new Updater({
    timer:2000
})
//未更新通知
up.on('no-update',()=>{
   console.log('未更新')
})
//更新通知
up.on('update',()=>{
    console.log('更新了')
})
```



### 代码思路解析

1. 通过 `fetch` 获取网页 HTML 内容。
2. 使用正则表达式匹配 HTML 中的 `<script>` 标签，提取脚本内容的哈希信息。
3. 将获取到的哈希信息存储到 `oldScript` 数组中。
4. 设置定时器，定期获取最新的 HTML 内容，提取脚本哈希信息，并与之前的哈希信息进行比较。
5. 如果哈希信息有变化，触发更新通知；否则，触发无更新通知。
6. 原文链接：https://juejin.cn/post/7185451392994115645



### 推荐插件（plugin-web-update-notification）

> 监听网页更新，并通知用户刷新页面的插件，支持 `Vite`、`Webpack`、`umi`

没错，最佳实践就是这个插件，如果觉得有用就点个 `star` 收藏下吧。

[github](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification) | [npm ](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F@plugin-web-update-notification%2Fcore)| [文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2FREADME.zh-CN.md)

### 原理

以 `git commit hash` (也支持 `svn revision number`、`package.json version`、`build timestamp`、`custom`) 为版本号，打包时将版本号写入一个 `json` 文件，同时注入客户端运行的代码。客户端轮询服务器上的版本号（浏览器窗口的`visibilitychange`、`focus` 事件辅助），和本地作比较，如果不相同则通知用户刷新页面。

### 优点

1. 接入简单，安装插件，修改配置文件即可，不用修改业务代码（如果不自定义行为）。

   ```javascript
   javascript
   复制代码// 以 vite 为例
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import { webUpdateNotice } from '@plugin-web-update-notification/vite'
   
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [
       vue(),
       webUpdateNotice({
         logVersion: true,
       }),
     ]
   })
   ```

2. 支持多种版本号类型：

   - `git commit hash`（git 仓库默认）。
   - `svn revision number` (svn 仓库默认)
   - `package.json` 中的 `version` 字段。（建议搭配 [bumpp](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fantfu%2Fbumpp) 食用最佳）
   - `build timestamp`，运行打包命令时的时间戳。
   - `custom`，用户自定义版本号。

3. 预置了一个简约的更新 `Notification`，可以自定义文案、样式、位置。当然也可以取消默认的 `Notification`，监听到更新事件后自定义行为。

   ![image-20230311125900307](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ce7fcc785a140ac8519dfc9ed98aa95~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

4. 预置的 `Notification` 文案支持国际化。

5. 支持手动控制检测。

6. tiny, 注入的 `js` 和 `css` 文件压缩后不到 2kb。

7. 完善的 `ts` 类型提示。

8. `issue` 响应急时...

### 什么时候会检测更新

> 检测：通过 `fetch` 加载服务器上的 `version.json` 文件（会忽略本地缓存）。

1. 首次加载页面。
2. 轮询（default: 10 * 60 * 1000 ms）。
3. js 脚本资源加载失败 (404 ?)。
4. 标签页 `visibilitychange`、`focus` 事件为 `true` 时。(按目前公司的项目来看，大多数更新是这个时候命中的，轮询反而少些)

### 关于时效性

有人说轮询如果频率太慢了，时效性会比较差。

我觉得影响不大。用户一般不会长时间保持这个标签页在前台，很有可能会切换到其他标签页或直接切出浏览器做其他操作，这时如果你回到当前标签页，会触发 `visibilitychange` 事件，立刻检测更新。所以大多数更新应该是在`visibilitychange`、`focus` 事件中命中的，轮询反而是一个辅助兜底的手段。

### 轮询对服务器的压力？

感觉应该问题不大，只是轮询服务器上的一个 `json` 文件。

```json
json
复制代码// version.json
{
  "version": "f29e8de"
}
```

而且如果用户离开（不关闭）当前标签页时，插件会暂时停止轮询的行为。重新回到页面后，会立刻检查一次并开启轮询。

你也可以设置 `checkInterval: 0` 来关闭轮询，只通过 `visibilitychange`、`focus` 事件来触发检测。

### 是否单独起一个 `web worker` 跑检测更新任务

看到有类似功能的插件会单独起一个 `worker` 来运行检测更新任务，为了不影响主线程。

个人觉得没有太大必要，因为检测更新任务只是简单的 `fetch json` 文件，然后做下本地与远程的版本对比，应该可以说是毫无压力。反而运行一个 `web worker` 会占用内存和 `cpu`。

### 插件对打包内容做了哪些变动

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a1a9dabe52143209fe88d10589e5141~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 源码

monorepo 形式组织代码，原理简单，代码也比较简单。

[core](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fcore%2Fsrc%2Findex.ts): 主要是如何获取版本号。

[injectScript](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fcore%2Fsrc%2FinjectScript.ts): 注入到客户端运行的代码。

[injectStyle](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fcore%2Fpublic%2FwebUpdateNoticeInjectStyle.css): 预置的 `Notification` `css` 样式。

[vite plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fvite-plugin%2Fsrc%2Findex.ts): vite 插件的实现。

[webpack plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fwebpack-plugin%2Fsrc%2Findex.ts): webpack 插件的实现。

[umi plugin](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fpackages%2Fumi-plugin%2Fsrc%2Findex.ts): umi 插件的实现。

[e2e test](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGreatAuk%2Fplugin-web-update-notification%2Fblob%2Fmaster%2Fexample%2Fvue-vite%2Ftests%2Fe2e%2Fplugin.spec.ts): `vite` 插件的基于 `playwright` 的 `e2e` 测试。

你可以看看一个标准的 `js` 库是如何通过 `tsup` 打包，如何配置 `pkg` 的。

一个通过 `tag` 触发，打包 -> release -> 发布 npm 包的 `github action` workflow 配置。

一个简单的 `vite`、`webpack`、`umi` 插件怎么能写的。

## 为什么不使用 ** 方案?

**websocket**

需要一个 `websocket` 服务, 还需要后端配合。

**service worker（pwa）**

*印像中老版本的 `vue-router` 文档就是基于 `service worker` 做的更新通知。*

接入 `service worker` 需要成本，本地运行一个 `worker` 也会占用内存和 `cpu` 资源。

国内并不流行 `pwa`。

最主要是的它具有拦截并处理网络请求的能力，如果你不熟悉，很有可能造成强缓存，手动强制刷新页面都无法更新。参考[谨慎处理 Service Worker 的更新](https://juejin.cn/post/6844903792522035208)。

如果非要使用的话， 建议使用 [vite-plugin-pwa](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvite-pwa%2Fvite-plugin-pwa)，插件已经内置了更新提示功能，开发也不用关心如何更新 `sw.js`。

**对比 `html` 文件里引入的 `js` 文件 `hash` 值**

不支持监听静态资源的更新。

轮询加载 version.json 应该比加载 index.html 对服务器的压力小些吧。

如 `webpack` 打包时给文件路径加 `hash` 的功能是可以被关闭的。

**检查 index.html `Response head` 的 `Etag`、`Last-Modified` 值**

需要服务端开启缓存。另外, 一些代理服务和负载均衡设备也可能在转发 `HTTP` 请求和响应时在 `Etag` 和 `Last-Modified` 之前去除这些头信息，以减少网络负载和提高性能。

不支持监听静态资源的更新。


