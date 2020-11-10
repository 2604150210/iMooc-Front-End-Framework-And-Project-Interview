const mongoose = require('mongoose')

mongoose.connect('mongodb://jal:666666@localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('连接数据库成功')
})
.catch((e) => {
  console.log('连接数据库失败: ', e)
})

// 设定集合规则
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  isPublish: Boolean
})
// 创建集合并应用规则
const Course = mongoose.model('Course', courseSchema)

Course.find({ author: 'Cathy' }).then(res => {
  console.log(res)
})