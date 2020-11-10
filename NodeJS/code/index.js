const http = require('http')

const app = http.createServer()

app.on('request', (req, res) => {
  res.end('111')
})

app.listen(3001, () => {
  console.log('Start successful! Please visit http://localhost:3001')
})