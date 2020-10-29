const path = require('path')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')
module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    path: path.join(distPath),
    filename: 'bundle.js'
  }
})