const path = require('path')
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'] // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
      },
      {
        test: /\.(less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      // 直接引入图片URL
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'development'
      ENV: JSON.stringify('development')
    })
  ],
  // watch: true,
  // devtool: 'eval-cheap-module-source-map',
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
})