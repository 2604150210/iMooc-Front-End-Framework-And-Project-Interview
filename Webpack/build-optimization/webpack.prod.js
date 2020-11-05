const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'production',
  entry: {
    index: path.join(srcPath, 'index.js'),
    other: path.join(srcPath, 'other.js'),
  },
  output: {
    path: distPath,
    filename: 'bundle.[contenthash:8].js', // 打包代码的文件名,
    // publicPath: 'http://cdn.abc.com' // 修改所有静态文件的url前缀
  },
  module: {
    noParse: [/react\.min\.js$/],
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        include: srcPath, // 明确范围
        // exclude: /node_modules/, // 排除范围， include 和 exclude 二者选其一
      },
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
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空output里面的文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.[contenthash:8].css'
    }),
    // 忽略 moment 下的 /locale 目录
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),

    // HappyPack开启多进程打包
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理.js文件，用法和 loader配置中一样
      loaders: ['babel-loader?cacheDirectory']
    }),

    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      // (还是使用 UglifyJS 压缩，只不过帮助开启了多进程)
      uglifyJS: {
        output: {
          beautify: false, // 最紧凑的输出
          comments: false, // 删除所有的注释
        },
        compress: {
          // 删除所有的 console 语句，可以兼容 ie 浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      }
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsWebpackPlugin({}),
      new TerserWebpackPlugin({})
    ]
  }
})