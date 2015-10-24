# wooden

使用markdown来创建你的网页

## 安装

```
npm install wooden -g
```

## 使用步骤

1. 创建一个空项目

```
wooden create [dir]
```

这个命名会生成一个空的项目，它包含了四个文件：

	* _post // 你的markdown文件放在这里
	* _layout // 布局文件，在这里我使用的jade
	* assets // 静态资源

现在你可以在_post里使用markdown写你的文章。

2. 预览网页

```
wooden prevew
```

这个命令会开启express来预览你的网站

3. 编译网页

```
wooden build [dir] [--output target]
```

当你完成写作并使用以上命名，就可以来更新或者生成为html文件，现在把它放到你的静态服务器上去吧！

## 配置

其中，contact支持twitter,fb等其他社交信息

```
{
	"name" : "hacke2's blog",
	"contact" : {
		"github" : "https://github.com/hacke2",
		"Weibo" : "http://weibo.com/p/1005052330269092/",
		"mail" : "hacke2cn@gmail.com"
	}
}
```

## 例子

当然，markdown非常简单，相信你已经会了，本系统也支持 `<!--more-->` 关键字，用来在首页显示摘要

```
---
title : hello, wooden
---

## abstract

<!-- more-->

>This is quote

article
```

## 下一步计划

* 加入评论系统能够
* 分页功能

# wooden

use markdown to build a static web page

```
npm install wooden -g
```

## step

1. create empty project

```
wooden create [dir]
```

This command can create empty project, It contains four folders:

	* _post // your markdown file
	* _layout // layout file by jade
	* assets //static resources 

you can user markdown to write your article in "_post" folders now。

2. preview your web page

```
wooden prevew
```

It is Command will open web server by express.

3. build

```
wooden build [dir] [--output target]
```

if you done your markdown, you make it to html.you can sent to your static server(e.g github page)

## config

contact can spport twitter,fb..

```
{
	"name" : "hacke2's blog",
	"contact" : {
		"github" : "https://github.com/hacke2",
		"Weibo" : "http://weibo.com/p/1005052330269092/",
		"mail" : "hacke2cn@gmail.com"
	}
}
```

## example

I believe you learned how user markdown to write article, you can user `<!--more-->` for index page Where can show abstract.

```
---
title : hello, wooden
---

## abstract

<!-- more-->

>This is quote

article
```

## next

* comment system
* Paging 