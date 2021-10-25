---
title: css基础温故
date: 2021-10-14 11:44:15
tags: css
categories: css
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/css.jpeg"
---

### 三栏布局

题目：假设高度已知，请写出三栏布局，其中左栏、右栏宽度各为 300px，中间自适应。
解答：可以有很多种布局方式，这里列出五种：float布局，absolute布局，flex布局，table布局，grid布局，代码如下：

```css
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>三栏布局</title>
	<link rel="stylesheet" href="">
	<style type="text/css" media="screen">
		html *{
			margin: 0;
			padding: 0;
		}
	</style>
</head>
<body>
	<section class="layout float">
		<style type="text/css" media="screen">
			.layout.float .wrapper>div{
				min-height: 100px;
			}
			.layout.float .left{
				float: left;
				width: 300px;
				background: red;
			}
			.layout.float .center{
				background: yellow;
			}
			.layout.float .right{
				float: right;
				width: 300px;
				background: blue;
			}
			
		</style>
		<article class="wrapper">
			<div class="left"></div>
			<div class="right"></div>
			<div class="center">
				<h1>float布局</h1>
				1.我是float布局的中间部分
				2.我是float布局的中间部分
			</div>
		</article>
	</section>


	<section class="layout absolute">
		<style type="text/css" media="screen">
			.layout.absolute .wrapper{
				width: 100%;
				margin-top: 20px;
			}
			.layout.absolute .wrapper>div{
				min-height: 100px;
			}
			.layout.absolute .left{
				position: absolute;
				left: 0;
				width: 300px;
				background: red;
			}
			.layout.absolute .center{
				position: absolute;
				left: 300px;
				right: 300px;
				background: yellow;
			}
			.layout.absolute .right{
				position: absolute;
				right: 0;
				width: 300px;
				background: blue;
			}
		</style>
		<article class="wrapper">
			<div class="left"></div>
			<div class="center">
				<h1>absolute布局</h1>
				1.我是absolute布局的中间部分
				2.我是absolute布局的中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>


	<section class="layout flex">
		<style type="text/css" media="screen">
			.layout.flex .wrapper{
				width: 100%;
				min-height: 100px;
				display: flex;
				margin-top: 140px;
			}
			.layout.flex .left{
				width: 300px;
				background: red;
			}
			.layout.flex .center{
				flex: 1;
				background: yellow;
			}
			.layout.flex .right{
				width: 300px;
				background: blue;
			}
		</style>
		<article class="wrapper">
			<div class="left"></div>
			<div class="center">
				<h1>flex布局</h1>
				1.我是flex布局的中间部分
				2.我是flex布局的中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>


	<section class="layout table">
		<style type="text/css" media="screen">
			.layout.table .wrapper{
				display: table;
				width: 100%;
				min-height: 100px;
				margin-top: 20px;
			}
			.layout.table .left{
				display: table-cell;
				width: 300px;
				background: red;
			}
			.layout.table .center{
				display: table-cell;
				background: yellow;
			}
			.layout.table .right{
				display: table-cell;
				width: 300px;
				background: blue;
			}
			
		</style>
		<article class="wrapper">
			<div class="left"></div>
			<div class="center">
				<h1>table布局</h1>
				1.我是table布局的中间部分
				2.我是table布局的中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>


	<section class="layout grid">
		<style type="text/css" media="screen">
			.layout.grid .wrapper{
				display: grid;
				grid-template-columns: 300px auto 300px;
				grid-template-rows: 100px;
				width: 100%;
				margin-top: 20px;
			}
			.layout.grid .left{
				background: red;
			}
			.layout.grid .center{
				background: yellow;
			}
			.layout.grid .right{
				background: blue;
			}
			
		</style>
		<article class="wrapper">
			<div class="left"></div>
			<div class="center">
				<h1>grid布局</h1>
				1.我是grid布局的中间部分
				2.我是grid布局的中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>
</body>
</html>
```

### 每种布局的优缺点

#### 1. float 布局

优点： 比较简单，兼容性也比较好。只要清除浮动做的好，是没有什么问题的
缺点：浮动元素是脱离文档流，要做清除浮动，这个处理不好的话，会带来很多问题，比如高度塌陷等。

#### 2. 绝对布局

优点：很快捷，设置很方便，而且也不容易出问题
缺点：绝对定位是脱离文档流的，意味着下面的所有子元素也会脱离文档流，这就导致了这种方法的有效性和可使用性是比较差的。

#### 3. flex 布局

优点：简单快捷
缺点：不支持 IE8 及以下

#### 4. table布局

优点：实现简单，代码少
缺点：当其中一个单元格高度超出的时候，两侧的单元格也是会跟着一起变高的，而有时候这种效果不是我们想要的。

#### 5. grid布局

跟 flex 相似。



### 水平垂直居中

```css
absolute + 负margin
这种方式比较好理解，兼容性也很好，缺点是需要知道子元素的宽高

<div class="out">
  <div class="inner">12345</div>
</div>

<style type="text/css">
  .out{
    position: relative;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
  }
</style>

absolute + auto margin
这种方法兼容性也很好，缺点是需要知道子元素的宽高

<style type="text/css">
  .out{
    position: relative;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
</style>

absolute + calc
这种方法的兼容性依赖于 calc，且也需要知道宽高

<style type="text/css">
  .out{
    position: relative;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    position: absolute;
    width: 100px;
    height: 100px;
    background: yellow;
    left: calc(50% - 50px);
    top: calc(50% - 50px);
  }
</style>

absolute + transform
兼容性依赖 translate，不需要知道子元素宽高

<style type="text/css">
  .out{
    position: relative;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    position: absolute;
    background: yellow;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

table
css新增的table属性，可以让我们把普通元素，变为table元素的显示效果，通过这个特性也可以实现水平垂直居中。
这种方法兼容性也不错。

<style type="text/css">
  .out{
    display: table-cell;
    width: 300px;
    height: 300px;
    text-align: center;
    vertical-align: middle;
    background: red;
  }

  .inner{
    display: inline-block;
    background: yellow;
    width: 100px;
    height: 100px;
  }
</style>

flex
flex 实现起来比较简单，三行代码即可搞定。可通过父元素指定子元素的对齐方式，也可通过 子元素自己指定自己的对齐方式来实现。第二种方式见 grid 布局。

<style type="text/css">
  .out{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    background: yellow;
    width: 100px;
    height: 100px;
  }
</style>

grid
grid 布局也很强大，大体上属性跟 flex 差不多。

//方法一：父元素指定子元素的对齐方式
<style type="text/css">
  .out{
    display: grid;
    align-content: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    background: yellow;
    width: 100px;
    height: 100px;
  }
</style>

//方法二：子元素自己指定自己的对齐方式
<style type="text/css">
  .out{
    display: grid;
    width: 300px;
    height: 300px;
    background: red;
  }

  .inner{
    background: yellow;
    width: 100px;
    height: 100px;
    align-self: center;
    justify-self: center;
  }
</style>
```

