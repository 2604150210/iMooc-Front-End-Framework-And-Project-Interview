使用mongo教程：https://www.cnblogs.com/haonanZhang/p/8213947.html
进入mongo路径下：cd ~/tools/mongodb
启动命令：mongod --dbpath ../data/db/
批量导入：mongoimport -d playground -c users --file ./user.json

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

 # Node的系统环境变量设置：
 export NODE_ENV=development