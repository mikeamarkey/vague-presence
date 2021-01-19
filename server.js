const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid')

const wss = new WebSocket.Server({ port: 8080 })
const users = {}
let interval = null

wss.on('connection', (ws) => {
  ws.id = uuidv4()
  users[ws.id] = null

  ws.on('message', (imageData) => {
    users[ws.id] = JSON.parse(imageData)
  })

  ws.on('close', () => {
    delete users[ws.id]
  })

  if (!interval) {
    interval = setInterval(() => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(users))
        }
      })
    }, 200)
  }
})
