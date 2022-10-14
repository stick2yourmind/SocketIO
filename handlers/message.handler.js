const Messages = require('../models/message/message.model')

const newMessage = async (socket, io, newMsg) => {
  await Messages.save({ msg: newMsg, socketId: socket.id})
  const allMsg = await Messages.getAll()
  // Propago los mensajes en todos los sockets
  io.sockets.emit('all messages', allMsg)
}


module.exports = {
  newMessage
}