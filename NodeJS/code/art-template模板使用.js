const http = require('http')
const path = require('path')
const template = require('art-template')
const app = http.createServer()

app.on('request', (req, res) => {
  let html = template(path.join(__dirname, 'index.html'), {name: 'Cathy'})
  res.end(html)
})

app.listen(3001, () => {
  console.log('http://localhost:3001')
})