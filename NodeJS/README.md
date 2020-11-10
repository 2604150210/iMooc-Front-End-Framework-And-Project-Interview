# ModeJS


## Node是什么
Node 是一个基于 Chrome V8 引擎的 JavaScript代码运行环境

## NodeJS 的组成
+ JavaScript 与三部分组成： ECMAScript、DOM、BOM
+ NodeJS是由 ECMAScript 及 Node 环境提供的一些附加 API 组成的，包括文件、网络、路径等等一些更加强大的API

## 使用 NodeJS 创建 Web 服务器
```js
// 引用系统模块
 const http = require('http');
  // 创建web服务器
 const app = http.createServer();
  // 当客户端发送请求的时候
 app.on('request', (req, res) => {
   res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8', // 不指定编码会乱码的！
    })
    //  响应
    res.end('<h1>hi, user</h1>');
 });
  // 监听3000端口
 app.listen(3000);
 console.log('服务器已启动，监听3000端口，请访问 localhost:3000')

```

## Http 请求与响应

### Get 请求参数
+ 参数被放置在浏览器地址栏中，例如：http://localhost:3000/?name=zhangsan&age=20
+ 参数获取需要借助系统模块url，url模块用来处理url地址
```js
 const http = require('http');
 // 导入url系统模块 用于处理url地址
 const url = require('url');
 const app = http.createServer();
 app.on('request', (req, res) => {
     // 将url路径的各个部分解析出来并返回对象
         // true 代表将参数解析为对象格式
     let {query} = url.parse(req.url, true);
     console.log(query);
 });
 app.listen(3000);
```

### Post 请求参数
+ 参数被放置在请求体中进行传输
+ 获取POST参数需要使用data事件和end事件
+ 使用querystring系统模块将参数转换为对象格式
```js
 // 导入系统模块querystring 用于将HTTP参数转换为对象格式
 const querystring = require('querystring');
 app.on('request', (req, res) => {
     let postData = '';
     // 监听参数传输事件
     req.on('data', (chunk) => postData += chunk;);
     // 监听参数传输完毕事件
     req.on('end', () => { 
         console.log(querystring.parse(postData)); 
     }); 
 });
```

## 路由处理
```js
 // 当客户端发来请求的时候
 app.on('request', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8', // 不指定编码会乱码的！
    })
     // 获取客户端的请求路径
     let { pathname } = url.parse(req.url);
     if (pathname == '/' || pathname == '/index') {
         res.end('欢迎来到首页');
     } else if (pathname == '/list') {
         res.end('欢迎来到列表页页');
     } else {
        res.end('抱歉, 您访问的页面出游了');
     }
 });
```

## 异步编程
```js
 // 路径拼接
 const public = path.join(__dirname, 'public');
 // 请求地址解析
 const urlObj = url.parse(req.url);
 // 读取文件
 fs.readFile(path.resolve(__dirname, './demo.txt'), 'utf8', (err, result) => { // 这里如果不写__dirname的话，是相对于控制台的路径，会出问题，最好带上__dirname相对于当前文件路径
     console.log(result);
 });
```