const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: SocketIOServer }  = require('socket.io')
const routers = require('./routes/index')

const { userConnected, userDisconnected, userChangeAlias } = require('./handlers/user.handler')
const { newMessage } = require('./handlers/message.handler')

const app = express ()
const httpServer = new HttpServer(app)
const io = new SocketIOServer(httpServer)

const PORT = 8080


// Middlewares
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routers)

httpServer.listen(PORT, () =>{
  console.log(`Server running on port: ${PORT}`)
})

io.on('connection', socket => {
  // Agrego al usuario conectado
  userConnected(socket, io)

  // Evento disconnect
  socket.on('disconnect', reason => {
    console.log("🚀 ~ file: index.js ~ line 33 ~ reason", reason)
    userDisconnected(socket, io)
  })

  // Evento new msg
  socket.on('new msg', newMsg => {
    newMessage(socket, io, newMsg)
  })

  // Evento change alias
  socket.on('change alias', alias => {
    userChangeAlias(socket, io, alias)
  })

})

