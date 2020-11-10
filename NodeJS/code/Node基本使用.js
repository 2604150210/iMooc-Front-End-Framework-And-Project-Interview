// 引用系统模块
const http = require('http');
const fs = require('fs')
const url = require('url');
const path = require('path');
const querystring = require('querystring')
// 创建web服务器
const app = http.createServer();
// 当客户端发送请求的时候
app.on('request', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8'
    })
    const public = path.join(__dirname, 'public')
    const urlObj = url.parse(req.url, true)
    console.log(urlObj.query)
    fs.readFile(path.resolve(__dirname, './demo.txt'), 'utf8', (err, data) => {
      if (err) {
        console.log('err', err)
        res.end(JSON.stringify(err))
        return
      }
      console.log('data', data)
      res.end(JSON.stringify(data))
    })
});
// 监听3001端口
app.listen(3001);
console.log('服务器已启动，监听3001端口，请访问 http://localhost:3001')
