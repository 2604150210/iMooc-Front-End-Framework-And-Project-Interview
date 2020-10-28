# <center>Babel在面试过程中的考点</center>

Babel功能：解析JS新语法，转化成低版本语法供浏览器使用。

## 一、环境搭建 & 基本配置

```bash
yarn init -y
yarn add @babel/cli @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
yarn add @babel/polyfill @babel/runtime
```

`babel`配置文件`.babelrc` ：

```json
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    
  ]
}
```

基本使用：

src/index.js
```js
const sum = (a, b) => a + b
```

执行命令：
```bash
yarn babel src/index.js
```

命令行输出结果：
```js
"use strict";

var sum = function sum(a, b) {
  return a + b;
};
```

>`babel`本身是一个空壳，它只是一个流程工具，它之所以可以将`ES6`转换成`ES5`语法，是每个`plugin`起的作用，而所需要的`plugin`太多的话，难以记住，所以采取`preset`预设方案，`preset`就是把许多`plugin`重新打一个包取一个名字，比如`preset-env`,`preset-flow`,`preset-react`,`preset-typescript`, `preset-env`就包含了很多转换`ES6`语法的`plugin`，如果不够用的话还可以配置单独的`plugin`

---

## 二、babel-polyfill
`babel-polyfill`就是`core-js`和`regenerator`的集合
### 1. `Polyfill`是一种`JS`的语法补丁方案。
比如说有些低版本的IE浏览器不支持`Array.indexOf`,那么就可以在网上找一个`Array.indexOf`的`Polyfill`放到项目中，处理浏览器兼容性问题
```js
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    // ......
  }
}
```

### 2. `core-js`是官方提供的`ES6`、`ES7`等新语法的`Polyfill`集合

### 3. `regenerator` 是`generator`语法的`Polyfill`


`Babel 7.4` 之后弃用`babel-polyfill`，推荐直接使用`core-js`和`regenerator`

`babel`的`preset-env`可能无法转换新的API，因为他们的语法已经符合`ES5`的语法规范，例如：
```js
const sum = (a, b) => a + b

// 新的API
Promise.resolve(100).then(data => data);

[10, 20, 30].includes(20)
```

使用babel处理后：
```js
"use strict";

var sum = function sum(a, b) {
  return a + b;
}; // 新的API


Promise.resolve(100).then(function (data) {
  return data;
});
[10, 20, 30].includes(20);
```

所以此时需要引入`babel-polyfill`
```js
import '@babel/polyfill'
const sum = (a, b) => a + b

// 新的API
Promise.resolve(100).then(data => data);

[10, 20, 30].includes(20)
```
进行babel转换后：
```js
"use strict";

require("@babel/polyfill");

var sum = function sum(a, b) {
  return a + b;
}; // 新的API


Promise.resolve(100).then(function (data) {
  return data;
});
[10, 20, 30].includes(20);
```

可以看出`babel`不处理模块化，只解析语法，模块化是`Webpack`的工作

### 4. babel-ployfill 按需引入
+ 文件较大
+ 只用一部分功能，无需全部引入
+ 配置按需引入

在`.babelrc`文件中的`preset`数组里增加一个配置`core-js`：
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": [
  ]
}
```
然后移除掉`index.js`中的`polyfill`手动导入:
```js
import '@babel/polyfill'
const sum = (a, b) => a + b

// 新的API
Promise.resolve(100).then(data => data);

[10, 20, 30].includes(20)
```
重新使用`babel`处理,实现了按需引入：
```js
"use strict";

require("core-js/modules/es.array.includes");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

var sum = function sum(a, b) {
  return a + b;
}; // 新的API


Promise.resolve(100).then(function (data) {
  return data;
});
[10, 20, 30].includes(20);
```

### 5. babel-polyfill的问题
+ 污染全局环境
  ```js
  // babel-polyfill的实现原理
  window.Promise = function() {}
  Array.prototype.includes = function() {}

  // 使用方
  window.Promise = 'abc'
  ```
+ 如果做一个独立的web系统，则无碍
+ 如果做一个第三方lib，则会有问题

所以可以使用`babel-runtime`解决`babel-polyfill`污染全局变量的问题

---

## 三、babel-runtime

在`.babelrc`中配置`babel-runtime`
```json
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```
使用`babel`进行处理后结果如下：
```js
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

require("@babel/polyfill");

var _context;

var sum = function sum(a, b) {
  return a + b;
}; // 新的API


_promise["default"].resolve(100).then(function (data) {
  return data;
});

(0, _includes["default"])(_context = [10, 20, 30]).call(_context, 20);
```
我们可以看到处理后的结果方法名前面加了下划线开头，就不再会污染全局变量了。
