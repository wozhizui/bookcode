const express = require('express')
  , nunjucks = require('nunjucks')
  , Sequelize = require('sequelize')
  , bodyParser = require('body-parser')

// 创建express实例
let app = express()

// 初始化sequelize
const sequelize = new Sequelize('todo-example', 'root', '8307')
// 定义项目和工程模型
const Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  created: Sequelize.DATE
})
const Task = sequelize.define('Task', {
  title: Sequelize.STRING
})
Task.belongsTo(Project)
Project.hasMany(Task)
// belongsTo联合意味着每个Task都有一个指向它所属项目的字段。另外每个任务模型都会有一个名为getProject的方法来获取其所属的项目。
// 对于hasMany而言，调用find查询到项目后，它们都会有一个名为getTasks的方法来获取项目中的任务。
// 初次之外，sequelize还支持另一种关系：hasOne。不过本例中用不到这种联合，他与belongsTo是相对的。

// 同步
sequelize.sync({force: true});
// 创建数据


// 配置应用
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
app.set('view engine', 'njk')

// 中间件
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: false}))

// 首页路由
app.get('/', (req, res, next) => {
  res.render('index')
})

// 删除项目路由
app.delete('/project/:id', (req, res, next) => {
  //
})

// 创建项目路由
app.post('/projects', (req, res, next) => {
  // 是一个promise对象
  Project.build(req.body).save()
  .success((obj) => {
    res.send(obj) //发送JSON数据
  })
  .error(next)
})

// 展示指定项目中的任务
app.get('/project/:id/tasks', (req, res, next) => {
  //
})

// 为指定项目添加任务
app.post('/project/:id/tasks', (req, res, next) => {
  res.body.ProjectId = req.param.id
  Task.build(req.body).save()
  .success((obj) => {
    res.send(obj) //发送JSON数据
  })
  .error(next)
})

// 删除任务路由
app.delete('/task/:id', (req, res, next) => {
  //
})

// 监听
app.listen(3000, () => {
  console.log('http://localhost:3000')
})