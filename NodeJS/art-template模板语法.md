# <center>art-template 模板引擎</center>

## 1. art-template 模板引擎的基础概念
### 1.1 art-template 模板引擎
art-template 模板引擎是第三方模块。
让开发者以更加友好的方式拼接字符串，使项目代码更加清晰、更加易于维护。
```js
 // 未使用模板引擎的写法
 var ary = [{ name: '张三', age: 20 }];
 var str = '<ul>';
 for (var i = 0; i < ary.length; i++) { 
    str += '<li>\
        <span>'+ ary[i].name +'</span>\
        <span>'+ ary[i].age +'</span>\
    </li>';
 }
 str += '</ul>'; 
```
```html
 <!-- 使用模板引擎的写法 --> 
 <ul>
    {{each ary}}
        <li>{{$value.name}}</li>
        <li>{{$value.age}}</li>
    {{/each}}
 </ul>
```

### 1.2 art-template模板引擎
在命令行工具中使用 npm install art-template 命令进行下载
使用const template = require('art-template')引入模板引擎
告诉模板引擎要拼接的数据和模板在哪 const html = template(‘模板路径’, 数据);
使用模板语法告诉模板引擎，模板与数据应该如何进行拼接 

### 1.3 art-template代码示例
```js
 // 导入模板引擎模块
 const template = require('art-template');
 // 将特定模板与特定数据进行拼接
 const html = template('./views/index.art',{
    data: {
        name: '张三',
        age: 20
    }
 }); 
```
```html
 <div>
    <span>{{data.name}}</span>
    <span>{{data.age}}</span>
 </div>
```

## 2. 模板引擎语法

### 2.1 模板语法
art-template同时支持两种模板语法：标准语法和原始语法。
标准语法可以让模板更容易读写，原始语法具有强大的逻辑处理能力。
>标准语法： {{ 数据 }}
原始语法：<%=数据  %>

### 2.2 输出
将某项数据输出在模板中，标准语法和原始语法如下：
>标准语法：{{ 数据 }}
原始语法：<%=数据 %>
```html
  <!-- 标准语法 -->
 <h2>{{value}}</h2>
 <h2>{{a ? b : c}}</h2>
 <h2>{{a + b}}</h2>

  <!-- 原始语法 -->
 <h2><%= value %></h2>
 <h2><%= a ? b : c %></h2>
 <h2><%= a + b %></h2>
```

### 2.3 原文输出
如果数据中携带HTML标签，默认模板引擎不会解析标签，会将其转义后输出。
>标准语法：{{@ 数据 }}
原始语法：<%-数据 %>
```html
 <!-- 标准语法 -->
 <h2>{{@ value }}</h2>
 <!-- 原始语法 -->
 <h2><%- value %></h2>
```

### 2.4 条件判断
```html
 <!-- 标准语法 --> 
 {{if 条件}} ... {{/if}}
 {{if v1}} ... {{else if v2}} ... {{/if}}
 <!-- 原始语法 -->
 <% if (value) { %> ... <% } %>
 <% if (v1) { %> ... <% } else if (v2) { %> ... <% } %>
```

### 2.5 循环
>标准语法：{{each 数据}} {{/each}}
原始语法：<% for() { %> <% } %>
```html
 <!-- 标准语法 -->
 {{each target}}
     {{$index}} {{$value}}
 {{/each}}
  <!-- 原始语法 -->
 <% for(var i = 0; i < target.length; i++){ %>
     <%= i %> <%= target[i] %>
 <% } %>
```

### 2.6 子模版
使用子模板可以将网站公共区块(头部、底部)抽离到单独的文件中。
>标准语法：{{include '模板'}}
原始语法：<%include('模板') %>
```html
  <!-- 标准语法 -->
 {{include './header.art'}}
  <!-- 原始语法 -->
 <% include('./header.art') %>
```

### 2.7 模板继承
使用模板继承可以将网站HTML骨架抽离到单独的文件中，其他页面模板可以继承骨架文件。

### 2.8 模板继承示例
```html
 <!doctype html>
 <html>
     <head>
         <meta charset="utf-8">
         <title>HTML骨架模板</title>
         {{block 'head'}}{{/block}}
     </head>
     <body>
         {{block 'content'}}{{/block}}
     </body>
 </html>
```
```html
 <!--index.art 首页模板-->
 {{extend './layout.art'}}
 {{block 'head'}} <link rel="stylesheet" href="custom.css"> {{/block}}
 {{block 'content'}} <p>This is just an awesome page.</p> {{/block}}
```

### 2.9 模板配置
向模板中导入变量 template.defaults.imports.变量名 = 变量值;
设置模板根目录 template.defaults.root = 模板目录
设置模板默认后缀 template.defaults.extname = '.art'



