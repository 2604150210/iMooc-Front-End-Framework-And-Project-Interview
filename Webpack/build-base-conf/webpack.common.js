const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath, disPath } = require('./paths')
module.exports = {
  entry: path.join(srcPath, 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html')
    })
  ]
}