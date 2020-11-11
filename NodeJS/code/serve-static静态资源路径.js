const http = require('http')
const path = require('path')
const serveStatic = require('serve-static')
const  finalhandler = require('finalhandler')

const serve = serveStatic(path.join(__dirname, 'public'))

const app = http.createServer()

app.on('request', (req, res) => {
  serve(req, res, finalhandler)
})

app.listen(3001, () => {
  console.log('http://localhost:3001')
})