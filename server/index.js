const express = require('express')
const http = require('http')
const path = require('path')
const { serveWS } = require('./websocket')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '..', 'client')))
server.listen(port, () => {
  console.log(`Listening on ${port}`)
})
serveWS(server)
