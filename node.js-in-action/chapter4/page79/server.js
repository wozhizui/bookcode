const http = require('http'),
      parse = require('url').parse,
      qs = require('querystring'),
      join = require('path').join,
      fs = require('fs'),
      formidable = require('formidable')

// __dirname是一个神奇的变量，他的值是该文件所在目录的路径
let root = __dirname
let items = []

// 创建服务器
let server = http.createServer((req, res) => {
  if ('/' === req.url) {
    switch (req.method) {
      case 'GET':
        show(req, res)
        break
      case 'POST':
        upload(req, res)
        break
      default:
        badRequest(res)
    }
  } else {
    notFound(res)
  }
})

// 响应默认的url
function show (req, res) {
  let list = items.map((item) => {
    return `<li>${item}</li>`
  }).join('')
  // html模板
  let html = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <title>todo-list</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="css/style.css" rel="stylesheet">
  </head>
  <body>
    <h1>To-do List</h1>
    <ul id="list">
    ${list}
    </ul>
    <form action="/" method="post" enctype="multipart/form-data">
      <p><input type="text" name="item"></p>
      <p><input type="file" name="file"></p>
      <p><input type="submit" value="Upload"></p>
    </form>
  </body>
</html>`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

// 响应未发现文件
function notFound (res) {
  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not Found')
}

// 错误请求
function badRequest (res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Bad Request')
}

// 响应post
function add (req, res) {
  let body = ''
  req.setEncoding('utf8')
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    let obj = qs.parse(body)
    items.push(obj.item)
    show(res)
  })
}

// 文件上传逻辑
function upload (req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400
    res.end('Bad Request: expecting multipart/form-data')
    return
  }
  // 开始上传逻辑
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    // console.log(files)
    res.end('upload complete!')
  })
  form.on('progress', function(bytesReceived, bytesExpected) {
    let percent = Math.floor(bytesReceived / bytesExpected * 100)
    console.log(percent)
  });
}

// 是否是formdata
function isFormData (req) {
  let type = req.headers['content-type'] || ''
  return 0 === type.indexOf('multipart/form-data')
}

// 监听3008端口
server.listen(3008, () => {console.log('run at http://localhost:3008')})