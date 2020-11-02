const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const webpackCommonConf = require('./webpack.common')
const { srcPath, distPath } = require('./paths')

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    path: distPath,
    filename: '[name].[contenthash:8].js', // 打包代码的文件名, name为多入口时的entry的key，hash是为了前端在代码不变的情况下命中缓存，从本地读取，提高速度
  },
  module: {
    rules: [
      // 抽离 css
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用style-loader
          'css-loader',
          // 'postcss-loader' // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
        ]
      },
      // 抽离 less -> css
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用style-loader
          'css-loader',
          'less-loader',
          // 'postcss-loader' // postcss-loader 处理 css 的兼容性问题, 加上浏览器前缀
        ]
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
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空output里面的文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify('production')
    }),
    // 抽离 CSS 文件
    new MiniCssExtractPlugin({
      filename: 'css/main.[contenthash:8].css'
    })
  ],
  optimization: {
    // 压缩CSS，JS默认是会压缩的，但是配置了minimizer说明要手动配置压缩选项，那就不会默认压缩JS了，此时要主动压缩JS
    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCSSAssetsWebpackPlugin({})
    ],
    // 分割代码块
    splitChunks: {
      chunks: 'all', // 一般情况下写all, all 全部 chunk, async 异步 chunk, 只对异步导入的文件处理，initial 入口 chunk，对于异步导入的文件不处理
      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vender', // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！
          test: /node_modules/,
          minSize: 0, // 大小限制，小于这个值就不单独打包
          minChunks: 1, // 最少复用过几次 1 表示只要用到就单独打包
        },
        common: {
          name: 'common', // chunk 名称
          priority: 0,
          minSize: 0, // 公共模块大小限制
          minChunks: 2, // 公共模块最少复用过几次 引用2次或以上就单独打包
        }
      }
    }
  }
})