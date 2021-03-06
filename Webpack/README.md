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

### 抽离公共代码
```js
// // 引入第三方模块
import _ from 'lodash'
console.log(_.each)
```
这种大体积的第三方模块我们希望可以单独打包，因为根据contenthash生成文件名，每次改动一点代码，hash就变了，而整个代码中是包含lodash的，但lodash并没有变，却也重新打包了。
我们希望lodash可以单独打包，它不会变化，命中缓存加载就很快。

生产模式使用 splitChunk 抽离chunk
```js
optimization: {
  // 分割代码块
  splitChunks: {
    chunks: 'all', // 一般情况下写all, all 全部 chunk, async 异步 chunk, 只对异步导入的文件处理，initial 入口 chunk，对于异步导入的文件不处理
    // 缓存分组
    cacheGroups: {
      // 第三方模块
      vendor: {
        name: 'vender', // chunk 名称
        priority: 1, // 权限更高，优先抽离，重要！
        test: /node_modules/,
        minSize: 0, // 大小限制，小于这个值就不单独打包
        minChunks: 1, // 最少复用过几次 1 表示只要用到就单独打包
      },
      common: {
        name: 'common', // chunk 名称
        priority: 0,
        minSize: 0, // 公共模块大小限制
        minChunks: 2, // 公共模块最少复用过几次 引用2次或以上就单独打包
      }
    }
  }
}
```
公共webpack配置中模板引用chunk情况：
```js
plugins: [
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'index.html'),
    filename: 'index.html',
    // chunks 表示该页面要引入哪些 chunk （即上面的index 和 other）
    chunks: ['index', 'vendor', 'common'] // 只引入 index、vendor、common
  }),
  new HtmlWebpackPlugin({
    template: path.join(srcPath, 'other.html'),
    filename: 'other.html',
    // chunks 表示该页面要引入哪些 chunk （即上面的index 和 other）
    chunks: ['other', 'common'] // 只引入 index、common
  }),
]
```

### 懒加载
JS 自带的异步加载 import 函数
```js
// 引入动态数据 - 懒加载
// 联想到 react 和 vue 中的 import
setTimeout(() => {
  import('./dynamic-data.js').then(res => {
    console.log(res.default.message) // 注意这里的default
  })
}, 1500);
```

### 处理React和Vue
处理React：
React 的 babel 预设
```sh
yarn add @babel/preset-react -D
```
然后在`.babelrc`里面配置react预设
```js
{
  "presets": [
    ["@babel/preset-react"]
  ]
}
```
处理Vue：
Vue 要安装解析Vue文件的loader
```sh
yarn add vue-loader
```
配置vue-loader
```js
{
  test: /\.vue$/,
  loader: ['vue-loader'],
  include: srcPath
}
```

---

## 三、Webpack性能优化

### 优化打包构建速度 - 开发体验和效率

#### 优化babel-loader
```js
{
  test: /\.js$/,
  use: ['babel-loader?cacheDirectory'], // 开启缓存
  include: srcPath, // 明确范围
  // exclude: /node_modules/, // 排除范围， include 和 exclude 二者选其一
},
```
使用`use`放`loader`数组的时候，不能使用`options`属性，所以我们把`@babel/preset-env`写到`.babelrc`里面去
```json
{
  "presets": [
    ["@babel/preset-env"]
  ],
  "plugins": []
}
```
#### IgnorePlugin 避免引如无用模块
避免引如无用模块
```sh
yarn add moment
```
默认会引用所有语言JS代码，代码过大。如何只引入中英文？
webpack中配置插件：
```js
// 忽略 moment 下的 /locale 目录
new webpack.IgnorePlugin(/\.\/locale/, /moment/)
```
代码中手动引入所需语言包：
```js
import moment from 'moment'
import 'moment/locale/zh-cn' // 手动引入中文语言包
moment.locale('zh-cn') // 设置语言
console.log('locale',moment.locale())
console.log('date', moment().format('ll')) // 2020年11月4日
```

#### noParse 避免重复打包
避免重复打包，像 min.js 基本上都是打包过了的，不需要对它进行重复打包
```js
module: {
  noParse: [/react\.min\.js$/]
}
````

**IgnorePlugin 和 noParse 的区别**
+ IgnorePlugin 直接不引入，代码中没有
+ noParse 引入，但不对它分析、构建和打包
+ IgnorePlugin 还优化了产出体积


#### happyPack 多进程打包

+ JS 单线程，开启多进程打包
+ 提高构建速度（特别是多核CPU）
```sh
yarn add happypack -D
```
webpack 的module rules配置：
```js
{
  test: /\.js$/,
  // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
  use: ['happypack/loader?id=babel'],
  include: srcPath, // 明确范围
  // exclude: /node_modules/, // 排除范围， include 和 exclude 二者选其一
}
```
```js
const HappyPack = require('happypack')
```
webpack中plugins配置：
```js
// HappyPack开启多进程打包
new HappyPack({
  // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
  id: 'babel',
  // 如何处理.js文件，用法和 loader配置中一样
  loaders: ['babel-loader?cacheDirectory']
})
```

#### ParallelUglifyPlugin 多进程压缩 JS
+ webpack 内置Uglify 工具压缩 JS
+ JS 单线程，开启多进程压缩更快
+ 和 HappyPack 同理
```sh
yarn add webpack-parallel-uglify-plugin -D
yarn webpack@4.44.2 -D # 将webpack降级到4，因为webpack5中移除了compiler.plugin，这个插件暂时不支持webpack5，在webpack5下会报错
yarn add terser-webpack-plugin@2.2.2 -D # 降级了webpack到4后，terser-webpack-plugin也要跟着降级，否则会报错
```
```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
```
plugins中：
```js
// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
new ParallelUglifyPlugin({
  // 传递给 UglifyJS 的参数
  // (还是使用 UglifyJS 压缩，只不过帮助开启了多进程)
  uglifyJS: {
    output: {
      beautify: false, // 最紧凑的输出
      comments: false, // 删除所有的注释
    },
    compress: {
      // 删除所有的 console 语句，可以兼容 ie 浏览器
      drop_console: true,
      // 内嵌定义了但是只用到一次的变量
      collapse_vars: true,
      // 提取出出现多次但是没有定义成变量去引用的静态值
      reduce_vars: true
    }
  }
})
```
关于开启多进程：
+ 项目较大，打包较慢，开启多进程能提高速度
+ 项目较小，打包很快，开启多进程会降低速度（进程开销）

#### 自动刷新
watch监听的方式现在几乎用不上了，因为起来了webpack-dev-server会就会自动刷新。
```js
module.export = {
  watch: true, // 开启监听，默认为false
  // 注意，开启监听之后，webpack-dev-server会自动开启刷新浏览器

  // 监听配置
  watchOptions: {
    ignored: /node_modules/, // 忽略哪些
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    aggregateTimeout: 300, // 默认为300ms
    // 判断文件是否发生变化是通过不停地去询问同指定文件有没有变化实现的
    poll: 1000 // 默认每隔1000毫秒询问一次
  }
}
```
#### 热更新
+ 自动刷新：整个网页全部刷新，速度较慢
+ 自动刷新：整个网页全部刷新，状态会丢失
+ 热更新：新代码生效，网页不刷新，状态不丢失

```js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = {
  entry: {
    // index: path.join(srcPath, 'index.js'),
    index: [
      'webpack-dev-server/client?http://localhost:9000/',
      'webpack/hot/dev-server',
      path.join(srcPath, 'index.js')
    ],
    other: path.join(srcPath, 'other.js'),
  },

  plugins: [
    new HotModuleReplacementPlugin()
  ],

  devServer: {
    hot: true
  }
}
```
样式文件可以自动热更新，脚本文件需要开发者注册需要热更新的模块，不在热更新注册范围内的模块发生改变，会触发自动刷新
```js
// 开启热更新之后的代码逻辑，注册哪些模块需要监听
if (module.hot) {
  module.hot.accept(['./math'], () => {
    const sumRes = sum(10, 20)
    console.log('sumRes in hot', sumRes)
  })
}
```

#### DllPlugin 动态链接库插件
前端框架如 Vue React，体积大，构建慢，但是较稳定，不常升级版本，同一个版本只构建一次即可，不用每次都重新构建
+ webpack已内置DLLPlugin支持
+ DLLPlugin - 打包出dll文件
+ DLLReferencePlugin - 使用dll文件

```sh
yarn add @babel/core @babel/preset-env @babel/preset-react babel-loader html-webpack-plugin webpack webpack-cli webpack-dev-server webpack-merge -D
```
```json
"scripts": {
  "dev": "webpack serve --config build/webpack.dev.js",
  "dll": "webpack --config build/webpack.dll.js"
}
```
webpack.dll.js，配置好后就可以运行`yarn dll`生成`react.dll.js`和`react.manifest.json`到`dist`文件夹中
```js
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
const { srcPath, distPath } = require('./paths')

module.exports = {
  mode: 'development',
  // JS 执行入口文件
  entry: {
    // 把 React 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: distPath,
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(distPath, '[name].manifest.json'),
    }),
  ],
}
```
webpack.dev.js中怎么使用dll
```js
// 第一，引入 DllReferencePlugin 
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')

module.exports = merge(webpackCommonConf, {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader'], // 开启缓存
        include: srcPath, // 明确范围
        exclude: /node_modules/, // 第二，不要再转换 node_modules
      },
    ]
  },
  plugins: [
    // 第三，告诉 webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require(path.join(distPath, 'react.manifest.json'))
    })
  ],
})
```
执行`yarn dev`即可测试开发环境下使用dll

#### 总结：webpack 优化构建速度（可用于生产环境）
1. 优化 babel-loader
2. IgnorePlugin
3. noParse
4. happyPack
5. ParallelUglifyPlugin(必须用于生产环境，因为这是压缩代码的，开发环境没必要压缩代码)

#### 总结：webpack 优化构建速度（不用于生产环境）
1. 自动刷新
2. 热更新
3. DllPlugin

### 优化产出代码 - 产品性能

#### 性能优化的优点
+ 体积更小
+ 合理分包，不重复加载
+ 速度更快，内存使用更少

#### 如何性能优化
+ 小图片 base64 编码
+ bundle加hash
+ 懒加载
+ 提取公共代码
+ IgnorePlugin
+ 使用CDN加速
+ 使用 production 模式
+ scope hosting

---

## 四、构建流程概述

---

## 五、babel
+ ployfill
+ runtime

---

## 六、面试题

### 1. 前端代码为何要进行构建和打包？
### 2. module、chunk、bundle分别是什么意思，有何区别？
+ module - 各个源码文件，webpack中一切皆模块
+ chunk - 多模块合成的，如 entry、import()、splitChunk
+ bundle - 最终的输出文件， 一个chunk生成一个bundle

### 3. loader和plugin的区别？
### 4. webpack如何实现懒加载？
### 5. webpack常见性能优化？
### 6. babel-runtime和babel-polyfill的区别？