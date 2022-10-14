const Users = require('../models/user/user.model')
const Messages = require('../models/message/message.model')

const userConnected = async (socket, io) => {
  console.log("Usuario conectado: ", socket.id)
  await Users.save({ name: null, socketId: socket.id})
  const allMsg = await Messages.getAll()
  const allUser = await Users.getAll()
  // Envio todos los usuarios a todos los sockets
  io.sockets.emit('all users', allUser)
  // Envio todos los mensajes a todos los sockets
  io.sockets.emit('all messages', allMsg)
}

const userDisconnected = async (socket, io) => {
  const user = await Users.getBySocketId(socket.id)
  if(user)
    await Users.deleteById(user.id)
  const allUser = await Users.getAll()
  // Envio todos los usuarios a todos los sockets
  io.sockets.emit('all users', allUser)
}

const userChangeAlias = async (socket, io, alias) => {
  const user = await Users.getBySocketId(socket.id)
  const userUpdated = {...user, name: alias}
  await Users.updateById(userUpdated, user.id)
  const allUser = await Users.getAll()
  // Envio todos los usuarios a todos los sockets
  io.sockets.emit('all users', allUser)
}

module.exports = {
  userConnected,
  userDisconnected,
  userChangeAlias
}