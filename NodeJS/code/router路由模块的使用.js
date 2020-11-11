const http = require('http')
const path = require('path')
const finalhandler = require('finalhandler')
const getRouter = require('router')
const app = http.createServer()

const router = getRouter()
router.get('/', (req, res) => {
  res.end('欢迎来到 首页')
})
router.get('/add', (req, res) => {
  res.end('欢迎来到 add')
})

app.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  })
  router(req, res, finalhandler(req, res))
})

app.listen(3001, () => {
  console.log('http://localhost:3001')
})