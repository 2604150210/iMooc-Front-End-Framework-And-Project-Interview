const path = require('path')
const {merge} = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

module.exports = merge(webpackCommonConf, {
  mode: 'development',
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: distPath,
    progress: true, // 显示打包进度
    compress: true,
    port: 9000,
  }
})