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
      
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      title: 'Webpack DEMO'
    })
  ]
}