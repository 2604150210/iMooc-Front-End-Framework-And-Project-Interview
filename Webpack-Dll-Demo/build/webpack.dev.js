const path = require('path')
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

// 第一，引入 DllReferencePlugin 
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'development',
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
  // watch: true,
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 9000,
    progress: true, // 显示打包进度
    contentBase: distPath, // 根目录
    open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩

    hot: true,

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
})