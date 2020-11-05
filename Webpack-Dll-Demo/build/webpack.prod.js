const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'production',
  entry: path.join(srcPath, 'index.js'),
  output: {
    path: distPath,
    filename: 'bundle.[contenthash:8].js', // 打包代码的文件名
  },
  module: {
    noParse: [/react\.min\.js$/],
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['babel-loader'],
        include: srcPath, // 明确范围
        // exclude: /node_modules/, // 排除范围， include 和 exclude 二者选其一
      },
    ]
  },
  plugins: [

  ],
})