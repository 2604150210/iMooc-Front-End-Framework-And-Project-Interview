const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath, disPath } = require('./paths')

/**
@type {import('webpack').Configuration}
**/
module.exports = {
  entry: {
    index: path.join(srcPath, 'index.js'),
    other: path.join(srcPath, 'other.js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
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
}