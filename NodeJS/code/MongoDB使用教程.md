使用mongo教程：https://www.cnblogs.com/haonanZhang/p/8213947.html
进入mongo路径下：cd ~/tools/mongodb
启动命令：mongod --dbpath ../data/db/
批量导入：mongoimport -d playground -c users --file ./user.json

在MongoDB中不需要显式创建数据库，如果正在使用的数据库不存在，MongoDB会自动创建。


进入mongo交互模式： mongo

查看数据库：show dbs
创建管理员账号：
use admin
db.createUser({user:'root',pwd:'root',roles:['root']})
创建普通账号：
use blog
db.createUser({user:'jal',pwd:'666666',roles:['readWrite']})

------
todo项目
登录数据库：
mongo
use admin
db.auth('root', 'root')
use todo
db.createUser({user: 'jal', pwd: '666666', roles:['readWrite']})
---------

注意：不要把use写成user！！！ 

在可视化面板中连接数据库：
mongodb://root:root@localhost:27017/blog?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false

 # Node的系统环境变量设置：
 export NODE_ENV=development

先在MongoDB的交互模式下创建访问用户jal：
```sh
use todo
db.createUser({user: 'jal', pwd: '666666', roles:['readWrite']})
```
 安装mongoose模块连接MongoDB
 使用mongoose提供的connect方法即可连接数据库。
 yarn add mongoose
 ```js
 const mongoose = require('mongoose')
 // 使用jal这个用户连接
mongoose.connect('mongodb://jal:666666@localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true})
     .then(() => console.log('数据库连接成功'))
     .catch(err => console.log('数据库连接失败', err));
 ```

 3.MongoDB增删改查操作
3.1 创建集合
创建集合分为两步，一是对对集合设定规则，二是创建集合，创建mongoose.Schema构造函数的实例即可创建集合。
```js
  // 设定集合规则
 const courseSchema = new mongoose.Schema({
     name: String,
     author: String,
     isPublished: Boolean
 });
  // 创建集合并应用规则
 const Course = mongoose.model('Course', courseSchema); // courses

```
3.2 创建文档
创建文档实际上就是向集合中插入数据。
分为两步：
创建集合实例。
调用实例对象下的save方法将数据保存到数据库中。
```js
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

const course = new Course({
  name: 'Node Mongoose Test',
  author: 'Cathy',
  isPublish: true
})
course.save()

```

或者：
```js
const Course = mongoose.model('Course', courseSchema)

Course.create({
  name: 'HTML',
  author: 'Cathy',
  isPublish: true
})
.then(res => {
  console.log('插入成功 ', res)
})
.catch(e => {
  console.log('插入失败', e)
})
```

3.3 mongoDB数据库导入数据
```js
mongoimport –d 数据库名称 –c 集合名称 –file 要导入的数据文件
找到mongodb数据库的安装目录，将安装目录下的bin目录放置在环境变量中。

```
3.4 查询文档
```js
//  根据条件查找文档（条件为空则查找所有文档）
Course.find().then(result => console.log(result))
```

// 返回文档集合
[{
    _id: 5c0917ed37ec9b03c07cf95f,
    name: 'HTML',
    author: 'Cathy',
    isPublish: true,
},{
     _id: 5c09dea28acfb814980ff827,
     name: 'Javascript',
    author: 'Cathy'
    isPublish: true,
},
.....
]
//  根据条件查找文档
```js
Course.findOne({author: 'Cathy'}).then(result => console.log(result))
```
```js

 //  匹配大于 小于
 User.find({age: {$gt: 20, $lt: 50}}).then(result => console.log(result))
 //  匹配包含
 User.find({hobbies: {$in: ['敲代码']}}).then(result => console.log(result))
 //  选择要查询的字段  
 User.find().select('name email').then(result => console.log(result))
 //  选择要查询的字段  
 User.find().select('name email').then(result => console.log(result))
 //  skip 跳过多少条数据  limit 限制查询数量
 User.find().skip(2).limit(2).then(result => console.log(result))
```

3.5 删除文档
```js
 // 删除单个
Course.findOneAndDelete({}).then(result => console.log(result))
 // 删除多个
User.deleteMany({}).then(result => console.log(result))
```
3.6 更新文档
```js
// 更新单个
User.updateOne({查询条件}, {要修改的值}).then(result => console.log(result))
// 更新多个
User.updateMany({查询条件}, {要更改的值}).then(result => console.log(result))
```

3.6 mongoose验证
在创建集合规则时，可以设置当前字段的验证规则，验证失败就则输入插入失败。
required: true 必传字段
minlength：3 字符串最小长度
maxlength: 20 字符串最大长度
min: 2 数值最小为2
max: 100 数值最大为100
enum: ['html', 'css', 'javascript', 'node.js']
trim: true 去除字符串两边的空格
validate: 自定义验证器
default: 默认值
获取错误信息：error.errors['字段名称'].message

3.7 集合关联
通常不同集合的数据之间是有关系的，例如文章信息和用户信息存储在不同集合中，但文章是某个用户发表的，要查询文章的所有信息包括发表用户，就需要用到集合关联。
使用id对集合进行关联
使用populate方法进行关联集合查询

3.7 集合关联实现
```js
// 用户集合
const User = mongoose.model('User', new mongoose.Schema({ name: { type: String } })); 
// 文章集合
const Post = mongoose.model('Post', new mongoose.Schema({
    title: { type: String },
    // 使用ID将文章集合和作者集合进行关联
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));
//联合查询
Post.find()
      .populate('author')
      .then((err, result) => console.log(result));

```