import './style/style1.css'
import './style/style2.less'

// import { sum } from './math'


// // 引入第三方模块
// import _ from 'lodash'

// console.log(_.each)

import moment from 'moment'
import 'moment/locale/zh-cn' // 手动引入中文语言包
moment.locale('zh-cn') // 设置语言
console.log('locale',moment.locale())
console.log('date', moment().format('ll')) // 2020年11月4日

// const sumRes = sum(30, 20)
// console.log('sumRes', sumRes)

// // 开启热更新之后的代码逻辑
// if (module.hot) {
//   module.hot.accept(['./math'], () => {
//     const sumRes = sum(10, 20)
//     console.log('sumRes in hot', sumRes)
//   })
// }

// console.log('window.ENV', ENV)

// // 引入图片
// function insertImgElem(imgFile) {
//   const img = new Image()
//   img.src = imgFile
//   document.body.appendChild(img)
// }
// import imgFile1 from './img/1.jpeg'
// insertImgElem(imgFile1)

// import imgFile2 from './img/2.jpeg'
// insertImgElem(imgFile2)

// 引入动态数据 - 懒加载
// setTimeout(() => {
//   import('./dynamic-data.js').then(res => {
//     console.log(res.default.message) // 注意这里的default
//   })
// }, 1500);