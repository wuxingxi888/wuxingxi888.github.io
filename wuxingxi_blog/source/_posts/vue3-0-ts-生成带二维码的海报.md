---

title: vue3.0 + ts 生成带二维码的海报
date: 2021-12-11 09:33:22
tags: vue typescript 前端框架
categories: 前端框架
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/vue.jpeg"
---

### 生成带有二维码的海报

​	背景需求：生成一个带二维码的海报，可实现分享助力。

### 插件

- qrcodejs2 或者 qrcode.vue （生成二维码）
- html2canvas （生成海报图）



### 安装使用

- qrcodejs2

  ```
  // 安装插件 
  npm install --save qrcodejs2
  // 页面引入
  import QRCode from "qrcodejs2";
  // 方法调用
   <div id="qrcode" ref="qrcode"></div>
   
  const createQrCode = (dom: any, width: number, height: number， qtext: string) => {
        return new QRCode(dom, {
          width: width,
          height: height,
          text: qtext,
          colorDark: "#000",
          colorLight: "#fff",
        });
     };
  ```

- qrcode.vue 

  ```
  <template>
    <qrcode-vue :value="value" :size="size" level="H" />
  </template>
  <script>
    import QrcodeVue from 'qrcode.vue'
  
    export default {
      data() {
        return {
          value: 'https://example.com',
          size: 300,
        }
      },
      components: {
        QrcodeVue,
      },
    }
  </script>
  ```

- html2canvas

  ```
  // 安装插件
  npm install --save html2canvas
  // 页面引入    
  const createPoster = (dom: any) => {
        html2canvas(dom, {
          useCORS: true, //开启跨域配置
          allowTaint: true,  //允许跨域（图片跨域相关）
          logging: true,
          taintTest: false,
        }).then((canvas: any) => {
          state.packageInfo.shareImage[0].imageUrl =
            canvas.toDataURL("image/jpeg");
          state.posterWrap = false;
        });
      };
  ```

- 问题总结：刚开始使用阿里os图片的时候 生成海报都是白色背景 没有相应的图片 可以把图片统一转换base64格式

  ```
   const urlToBase64 = (url: string) => {
        return new Promise<string>((resolve, reject) => {
          const Img = new Image();
          Img.setAttribute("crossOrigin", "Anonymous");
          Img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = Img.width;
            canvas.height = Img.height;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.drawImage(Img, 0, 0, Img.width, Img.height);
            const base64 = canvas.toDataURL("image/jpeg");
            resolve(base64);
          };
          Img.onerror = function (e) {
            console.log("图片加载失败：");
            reject(new Error("图片加载失败：" + e));
          };
          Img.src = url;
        });
      };
      
      
        urlToBase64("xxoo")
          .then(async (res) => {
            state.canvasUrl = res;
            await createPoster();
          })
          .catch((err) => {
            console.log(err);
            // do....
          });
  ```

  
