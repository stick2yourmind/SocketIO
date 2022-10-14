const socket = io('http://localhost:8080')

const createProductForm = document.getElementById('createProduct__form')
const aliasForm = document.getElementById('alias__form')
const textMsgForm = document.getElementById('textMsg__form')
const chatDisplay = document.getElementById('chat__display')

let users = []
let messages = []

const getNameBySocketId = (socketId) => {
  const foundData = users.find( element => element.socketId === socketId )
  if(foundData === undefined)
    return 'Desconectado'
  if(!foundData.name)
    return foundData.socketId
  else return foundData.name
}
const cleanChat = () => {
  chatDisplay.innerHTML = ""
}
const renderMsg = ({msg, socketId}) => {
  const classMsg = (socketId === socket.id) ? "chat__msg-own" : "chat__msg"
  const chatOwnerContent = (socketId === socket.id) ? "Yo" : getNameBySocketId(socketId)
  const chatMsg = document.createElement("div")
  const chatOwner = document.createElement("p")
  chatMsg.classList.add(classMsg)
  chatOwner.classList.add('chat__owner')
  chatOwner.innerHTML = chatOwnerContent
  chatMsg.appendChild(chatOwner)
  chatMsg.innerHTML = chatMsg.innerHTML + msg
  chatDisplay.appendChild(chatMsg)
}

createProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(createProductForm)
  const formValues = Object.fromEntries(formData)
  createProductForm.reset()
})

aliasForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(aliasForm)
  const formValues = Object.fromEntries(formData)
  socket.emit('change alias', String(formValues.alias))
})

textMsgForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(textMsgForm)
  const formValues = Object.fromEntries(formData)
  socket.emit('new msg', formValues.textMsg)
})


socket.on('all messages', async (allMsg) => {
messages = allMsg
cleanChat()
 for (msgData of allMsg){
  renderMsg(msgData)
 }
 chatDisplay.scrollTo(0, chatDisplay.scrollHeight)
})

socket.on('all users', async (allUser) => {
  users = allUser
  cleanChat()
  for (msgData of messages){
    renderMsg(msgData)
  }
  chatDisplay.scrollTo(0, chatDisplay.scrollHeight)
})