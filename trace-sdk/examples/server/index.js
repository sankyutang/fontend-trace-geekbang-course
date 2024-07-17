const express = require('express')
const http = require('http')
const { resolve } = require('path')

// import { port, FilePaths, ServerUrls } from './config'
const { port, FilePaths, ServerUrls } = require('./config')
// const opn = require('open')
// import { mswServer } from './mocks/node'
//   mswServer.listen()
//   mswServer.printHandlers()
const app = express()

// const url = `http://localhost:${port}/JS/index.html`
// Object.entries(FilePaths).forEach(([path, resolvePath]) => {
//   app.use(path, express.static(resolvePath))
// })

app.use(express.static('examples'))
app.use('/dist', express.static('dist'))

app.get('/track.gif', (req, res) => {
  console.info(req.query.data)
  const img = Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': img.length
  });
  res.end(img);
})

// // mock
app.get(ServerUrls.normalGet, (_req, res) => {
  res.send('get 正常请求响应体')
})

app.get(ServerUrls.exceptionGet, (_req, res) => {
  res.status(500).send('get 异常响应体!!!')
})

app.post(ServerUrls.normalPost, (_req, res) => {
  res.send('post 正常请求响应体')
})

app.post(ServerUrls.exceptionPost, (_req, res) => {
  res.status(500).send('post 异常响应体!!!')
})

app.post(ServerUrls.errorsUpload, (_req, res) => {
  res.send('错误上报成功')
})

const server = http.createServer(app)

server.listen(port, () => {})
if (process.env.NODE_ENV === 'demo') {
  console.log('examples is available at: http://localhost:' + port)
  // opn(url)
}
