const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath, disPath } = require('./paths')

/**
@type {import('webpack').Configuration}
**/
module.exports = {
  entry: path.join(srcPath, 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'] // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
      },
      {
        test: /\.(less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      title: 'Webpack DEMO'
    })
  ]
}