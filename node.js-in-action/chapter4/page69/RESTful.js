const http = require('http'),
      url = require('url')

let items = []

// 创建服务器
let server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST': {
      // 为这个post设置缓存
      let item = ''
      req.setEncoding('utf8')
      req.on('data', chunk => {
        // 将数据块拼接到缓存上
        item += chunk
      })
      req.on('end', () => {
        items.push(item)
        res.end('OK\n')
      })
      break
    }
    case 'GET': {
      let body = items.map(function (item, index) {
        return index + ') ' + item
      }).join('\n')
      // Content-Length应该是字节长度，而不是字符长度
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
      res.end(body)
      break
    }
    case 'DELETE': {
      let path = url.parse(req.url).pathname
      let index = parseInt(path.slice(1), 10)

      if (isNaN(index)) {
        res.statusCode = 400
        res.end('Invalid item id')
      } else if (!items[index]) {
        res.statusCode = 404
        res.end('Item not found')
      } else {
        items.splice(index, 1)
        res.end('OK\n')
      }
    }
    break
  }
})

server.listen(3008, () => {
  console.log('run at http://localhost:3008')
})