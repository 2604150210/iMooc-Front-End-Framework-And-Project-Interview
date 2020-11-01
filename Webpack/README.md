# <center>Webpack 的面试考点</center>

Webpack 已经是前端打包构建的不二选择
每日必用，面试必考
webpack是一个成熟的工具，重点在于配置和使用，原理并不高优

---

## 一、基本配置
### 安装配置
```sh
yarn add webpack webpack-cli -D
```
hash是为了前端在代码不变的情况下命中缓存，从本地读取，提高速度
```js
mode: 'production',
entry: path.join(srcPath, 'index.js'),
output: {
  path: distPath,
  filename: '[contenthash:8].js',
}
```
### dev-server 
```shell
yarn add webpack-dev-server
```
```js
devServer: {
  port: 9000,
  progress: true, // 显示打包进度
  contentBase: distPath, // 根目录
  open: true, // 自动打开浏览器
  compress: true, // 启动 gzip 压缩

  // 设置代理
  proxy: {
    // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
    '/api': 'http://localhost:3000',

    // 将本地 /api2/xxx 代理到 localhost:3000/xxx
    '/api2': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '/api2': ''
      }
    }
  }
}
```
### 配置package.json中的scripts
注意：在webpack4以后版本中，webpack-dev-server无法指定配置文件，可以替换使用webpack/server

```json
"scripts": {
  "dev:build": "webpack --config build-base-conf/webpack.dev.js",
  "dev": "webpack serve --config build-base-conf/webpack.dev.js",
  "build": "webpack --config build-base-conf/webpack.prod.js"
}
```
### 解析ES6
```sh
yarn add @babel/core @babel/preset-env babel-loader
```

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    presets: ['@babel/preset-env']
  }
}
```

### 解析样式
```sh
yarn add style-loader css-loader postcss-loader autoprefixer less-loader less
```
```js
{
  test: /\.(css)$/,
  use: ['style-loader', 'css-loader', 'postcss-loader'] // postcss-loader 处理 css 的兼容性问题
},
{
  test: /\.(less)$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```
postcss-loader的配置文件 postcss.config.js
```js
module.exports = {
  plugins: [require('autoprefixer')]
}
```
### 解析图片文件
```sh
yarn add file-loader url-loader
```
生产模式：
```js
// 图片，考虑 base64 编码的情况
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        // 小于 5kb 的图片用 base64 格式产出，否则依然沿用 file-loader 的形式，产出 url
        limit: 5 * 1024,
        outputPath: '/img/',
      }
    }
  ]
}
```
开发模式：
```js
// 直接引入图片URL
{
  test: /\.(jpg|jpeg|png|gif)$/,
  loader: 'file-loader'
}
```

### 模块化
webpack 本身默认支持模块化

### 常见loader和plugin

---

## 二、高级特性
webpack基本配置只能做demo，不能做线上项目。面试考察基本配置，只是为了快速判断你是否用过webpack。以下高级配置，也是通过面试的必要条件

### 多入口
SPA - 单页应用
但有时候也需要多页应用，就得打包多入口
```js
entry: {
  index: path.join(srcPath, 'index.js'),
  other: path.join(srcPath, 'other.js')
},
output: {
  path: distPath,
  filename: '[name].[contenthash:8].js', // 打包代码的文件名, name为多入口时的entry的key，hash是为了前端在代码不变的情况下命中缓存，从本地读取，提高速度
}
```
```js
plugins: [
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'index.html'),
    filename: 'index.html',
    // chunks 表示该页面要引入哪些 chunk （即上面的index 和 other）
    chunks: ['index'] // 只引入 index.js
  }),
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'other.html'),
    filename: 'other.html',
    // chunks 表示该页面要引入哪些 chunk （即上面的index 和 other）
    chunks: ['other'] // 只引入 index.js
  }),
]
```

### 抽离压缩CSS
本地开发时可以将CSS直接以style的形式注入到dom上，但是生产模式下，必须将CSS抽离成单独的文件并进行打包压缩。

### 抽离公共代码
开发模式下，依旧这么处理样式文件：
```js
{
  test: /\.(css)$/,
  use: ['style-loader', 'css-loader', 'postcss-loader'] // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
},
{
  test: /\.(less)$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```
生产模式下要对样式文件进行抽离打包
```sh
yarn add mini-css-extract-plugin --dev
```
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
```
```js
// 抽离 css
{
  test: /\.(css)$/,
  use: [
    MiniCssExtractPlugin.loader, // 注意，这里不再用style-loader
    'css-loader',
    'postcss-loader' // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
  ]
},
// 抽离 less -> css
{
  test: /\.(less)$/,
  use: [
    MiniCssExtractPlugin.loader, // 注意，这里不再用style-loader
    'css-loader',
    'less-loader',
    'postcss-loader' // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
  ]
}
```
压缩CSS。JS默认是会压缩的，但是配置了minimizer说明要手动配置压缩选项，那就不会默认压缩JS了，此时要主动压缩JS
```js
plugins: [
  // 抽离 CSS 文件
  new MiniCssExtractPlugin({
    filename: 'css/main.[contentHash:8].css'
  })
]
optimization: {
  // 压缩CSS，JS默认是会压缩的，但是配置了minimizer说明要手动配置压缩选项，那就不会默认压缩JS了，此时要主动压缩JS
  minimizer: [
    new TerserWebpackPlugin({}),
    new OptimizeCSSAssetsWebpackPlugin({})
  ]
}
```
### 懒加载

### 处理React和Vue

---

## 三、优化打包效率
+ 优化babel-loader
+ IgnorePlugin
+ noParse
+ happyPack
+ ParallelUglifyPlugin
+ 自动刷新
+ 热更新
+ DllPlugin

---

## 四、优化产出代码
+ 使用生产环境
+ 小图片 base64 编码
+ bundle加hash
+ 使用CDN
+ 提取公共代码
+ 懒加载
+ scope hosting

---

## 五、构建流程概述

---

## 六、babel
+ ployfill
+ runtime

---

## 七、面试题

### 1. 前端代码为何要进行构建和打包？
### 2. module、chunk、bundle分别是什么意思，有何区别？
### 3. loader和plugin的区别？
### 4. webpack如何实现懒加载？
### 5. webpack常见性能优化？
### 6. babel-runtime和babel-polyfill的区别？