#### 宏任务和微任务

+ 宏任务： setTimeout,  setInterval, Ajax, DOM事件
+ 微任务： Promise async/await
+ 微任务执行时机比宏任务要早

1. Call Stack 空闲
2. 尝试 DOM 渲染
3. 触发Event Loop

#### event loop 和 DOM 渲染

+ 每次 Call Stack 清空（即每次轮询结束），即同步任务执行完
+ 都是 DOM 重新渲染的机会，DOM结构如果有改变则重新渲染
+ 然后再去触发下一次 Event Loop

#### 微任务和宏任务的区别

+ 宏任务：DOM渲染后触发，如setTimeout
+ 微任务：DOM渲染前触发，如Promise

#### 整个执行流程
Call Stack清空之后，会先执行 Promise 的回调，微任务是进入microTask Queue， 不会进入Web API，因为微任务是ES6语法规定的，而宏任务是浏览器语法规定的。

1. Call Stack 清空
2. 执行当前的微任务
3. 尝试iDOM渲染
4. 触发Event Loop


## 网页加载过程

+ DNS 解析：域名 -> IP地址
+ 浏览器根据 IP 地址想服务器发起 http 请求
+ 服务器处理 http 请求，并返回给浏览器
+ 根据 HTML 代码生成 DOM Tree
+ 根据 CSS 代码生成 CSSOM
+ 将DOM Tree 和 CSSOM 整合形成 Render Tree
+ 浏览器根据 Render Tree 渲染页面
+ 遇到 script 则暂停渲染，优先加载并执行 JS 代码，完成在继续
+ 直至把 Render Tree 渲染完成

## 性能优化
+ 让加载更快
  + 减少资源体积：压缩代码
  + 减少访问次数：合并代码，SSR服务端渲染，缓存
  + 使用更快的网络：CDN
+ 让渲染更快
  + CSS 放在 head，JS 放在 body 最下面
  + 尽早开始执行 JS，用DOMContentLoaded触发
  + 懒加载（图片懒加载、上滑加载更多）
  + 对 DOM 查询进行缓存
  + 频繁 DOM 操作，合并到一起插入DOM结构
  + 节流 throttle，防抖 debounce
