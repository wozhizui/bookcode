const http = require('http'),
      mysql = require('mysql'),
      work = require('./lib/timetrack')

// 数据库配置
let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '8307',
  database : 'timetrack'
})
// 连接数据库，有错误处理
db.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
})

// 创建服务器
let server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res)
          break
        case '/archive':
          work.archive(db, req, res)
          break
        case '/delete':
          work.archive(db, req, res)
          break
      }
      break
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res)
          break
        case '/archived':
          work.showArchived(db, res)
          break
      }
      break
  }
})

// 建表后通过回调函数启动服务器
db.query(
  `CREATE TABLE IF NOT EXISTS "runoob_tbl"(
    "runoob_id" INT UNSIGNED AUTO_INCREMENT,
    "runoob_title" VARCHAR(100) NOT NULL,
    "runoob_author" VARCHAR(40) NOT NULL,
    "submission_date" DATE,
    PRIMARY KEY ( "runoob_id" )
  )`, err => {
    if (err) throw err
    console.log('Server started...')
    server.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  }
)