const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const Messages = require('../models/message/message.model')

dayjs.extend(customParseFormat)

const newMessage = async (socket, io, newMsg) => {
  
  const date = new Date()
  const dateFormated = dayjs(date).format('DD/MM/YYYY hh:mm:ss')
  console.log("🚀 ~ file: message.handler.js ~ line 11 ~ newMessage ~ dateFormat", dateFormated)
  await Messages.save({ msg: newMsg, socketId: socket.id, createdAt: `${dateFormated} hs`})
  const allMsg = await Messages.getAll()
  // Propago los mensajes en todos los sockets
  io.sockets.emit('all messages', allMsg)
}


module.exports = {
  newMessage
}