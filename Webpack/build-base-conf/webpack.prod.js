const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    path: distPath,
    filename: 'bundle.[contenthash:8].js', // 打包代码的文件名
  },
  module: {
    rules: [
      // 图片，考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 小于 8kb 的图片用 base64 格式产出，否则依然沿用 file-loader 的形式，产出 url
              limit: 8 * 1024,
              outputPath: '/img/',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空output里面的文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify('production')
    })
  ]
})