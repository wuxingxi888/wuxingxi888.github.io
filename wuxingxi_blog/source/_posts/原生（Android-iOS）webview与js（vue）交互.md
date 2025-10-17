---
title: 原生（Android iOS）webview与js（vue）交互
date: 2021-05-24 14:13:03
tags: vue android iOS 前端框架
categories: 前端框架
top_img:
cover: "![vue-4288067](原生（Android-iOS）webview与js（vue）交互/vue-4288067.jpeg)"
---

![vue](原生（Android-iOS）webview与js（vue）交互/vue-4288067.jpeg)

# 1.Vue和原生（ios和安卓）的交互（第一种方法）

## 一、原生调用Vue方法

## 1、Vue

```
mounted() {
    //将要给原生调用的方法挂载到 window 上面
    window.callJsFunction = this.callJsFunction
},
data() {
    return {
    	msg: "哈哈"
	}
},
methods: {
    callJsFunction(str) {
        this.msg = "我通过原生方法改变了文字" + str
        return "js调用成功"
	}
}
```

 在 `methods` 中定义一个供 Android 调用的方法 `callJsFunction(str)` , 并可接收一个参数 `str`，然后改变页面中的文字。

如果只是在 `methods` 中定义方法，原生调用会找不到这个方法。所以要在页面加载的时候将方法挂载在 `window` 上，这样 `WebView` 就可以拿到此方法了。注意，这步很重要一定要写！

注意一个细节，`this.callJsFunction` 后面不要加括号 `()`，加括号相当于直接调用了。

总结起来 `Vue` 中要做的事情就两步：

1. 在 `methods` 中定义方法
2. 在 `mounted` 中将方法挂载在 `window` 上

## 2、原生

### 安卓

 Android 调用 JS 有两种方式，都是通过 `WebView` 的方法：

1. `webview.loadUrl()`
2. `webview.evaluateJavascript()`

> 二者区别：
>
> 1. `loadUrl()` 会刷新页面，`evaluateJavascript()` 则不会使页面刷新，所以 `evaluateJavascript()` 的效率更高
> 2. `loadUrl()` 得不到 js 的返回值，`evaluateJavascript()` 可以获取返回值
> 3. `evaluateJavascript()` 在 Android 4.4 之后才可以使用

#### 1.webview.loadUrl()方式

需要等页面加载完在 `WebView` 的 `onPageFinished` 方法中写调用逻辑，否则不会执行。如果不需要传参数，把参数去掉即可 `tbsWebView.loadUrl("javascript:callJsFunction()");`

```
tbsWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url, headerMap);
                return true;
            }

            @Override
            public void onPageFinished(WebView webView, String s) {
                super.onPageFinished(webView, s);
                //安卓调用js方法。注意需要在 onPageFinished 回调里调用
                tbsWebView.post(new Runnable() {
                    @Override
                    public void run() {
                        tbsWebView.loadUrl("javascript:callJsFunction('soloname')");
                    }
                });
            }
        });
    }
});
```

#### 2.webview.evaluateJavascript()方式

其他地方跟`loadUrl()`一样，只是把 `tbsWebView.loadUrl("javascript:callJsFunction('soloname')");` 替换掉

```
@Override
public void onPageFinished(WebView webView, String s) {
    super.onPageFinished(webView, s);
    //安卓调用js方法。注意需要在 onPageFinished 回调里调用
    tbsWebView.post(new Runnable() {
        @Override
        public void run() {
            tbsWebView.evaluateJavascript("javascript:callJsFunction('soloname')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String s) {
                    Logger.d("js返回的结果： " + s);
                }
            });
        }
    });
}
```

### iOS

```
NSString *toVueSting = @"soloname";
 
  NSString *jsStr = [NSString stringWithFormat:@"callJsFunction('%@')",toVueSting];
 
  [self->_wkWebView evaluateJavaScript:jsStr completionHandler:^(id _Nullable d, NSError * _Nullable error) {
 
            NSLog(@"返回---%@",d);//回调值
 
    }];
```

## 二、Vue 调用原生

1. 对于JS（vue）调用原生代码的方法有2种：

   1. 通过 `WebView` 的 `addJavascriptInterface()` 进行对象映射
   2. 通过 `WebViewClient` 的 `shouldOverrideUrlLoading()`方法回调拦截 url

   对比： 第一种最简洁，但在 Android 4. 2 以下存在漏洞；第二种使用复杂，但不存在漏洞问题。第二种想了解的可以参考 [这篇文章](https://www.jianshu.com/p/345f4d8a5cfa) 。

## 1、Vue

```
//vue调用Android方法，且传值给Android （Android方法名为 showToast）
  $App.showToast("哈哈，我是js调用的")；  
 
//vue调用iOS方法，且传值给iOS （iOS 方法名为 showToast）
window.webkit.messageHandlers.showToast.postMessage("哈哈，我是js调用的");
```

## 2、原生

### 安卓

新建类 `JsJavaBridge`

```
public class JsJavaBridge {

    private Activity activity;
    private WebView webView;

    public JsJavaBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
    }

    @JavascriptInterface
    public void onFinishActivity() {
        activity.finish();
    }

    @JavascriptInterface
    public void showToast(String msg) {
        ToastUtils.show(msg);
    }
}

// 然后通过 WebView 设置 Android 类与 JS（vue） 代码的映射
tbsWebView.addJavascriptInterface(new JsJavaBridge(this, tbsWebView), "$App");
```

### iOS

```
#pragma mark -WKScriptMessageHandler
 
- (void)userContentController:(WKUserContentController*)userContentController didReceiveScriptMessage:(nonnull WKScriptMessage *)message{
 
    if ([message.name isEqualToString:@"showToast"]) {
 
        NSLog(@"是什么？---%@",message.body);
 
       //做原生操作
 
    }
 
}
```

这里将类 `JsJavaBridge` 在 JS 中映射为了 `$App`，所以在 Vue 中可以这样调用 `$App.showToast("哈哈，我是js调用的")`。

以上就是 原生 与 JS（vue） 的互相调用。

