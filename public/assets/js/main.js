const socket = io('http://localhost:8080')

/* -------------------------------------------------------------------------- */
/*                             VARIABLES GLOBALES                             */
/* -------------------------------------------------------------------------- */
let users = []
let messages = []
let products = []
/* -------------------------------------------------------------------------- */
/*                             REFERENCIAS DEL DOM                            */
/* -------------------------------------------------------------------------- */
const createProductForm = document.getElementById('createProduct__form')
const aliasForm = document.getElementById('alias__form')
const textMsgForm = document.getElementById('textMsg__form')
const chatDisplay = document.getElementById('chat__display')
const productSection = document.getElementById('products')

/* -------------------------------------------------------------------------- */
/*                              RENDERS DEL CHAT                              */
/* -------------------------------------------------------------------------- */
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
const renderMsg = ({msg, socketId, createdAt}) => {
  const classMsg = (socketId === socket.id) ? "chat__msg-own" : "chat__msg"
  const chatOwnerContent = (socketId === socket.id) ? "Yo" : getNameBySocketId(socketId)
  const chatMsg = document.createElement("div")
  const chatOwner = document.createElement("p")
  const chatDate = document.createElement("p")
  chatMsg.classList.add(classMsg)
  chatOwner.classList.add('chat__owner')
  chatDate.classList.add('chat__date')
  chatOwner.innerHTML = chatOwnerContent
  chatDate.innerHTML = createdAt
  chatMsg.appendChild(chatOwner)
  chatMsg.innerHTML = chatMsg.innerHTML + msg
  chatMsg.appendChild(chatDate)
  chatDisplay.appendChild(chatMsg)
}

/* -------------------------------------------------------------------------- */
/*                            RENDERS DE PRODUCTOS                            */
/* -------------------------------------------------------------------------- */
const cleanProducts = () => {
  productSection.innerHTML = ""
}
const renderProducts = async (products) => {
  let response = await fetch('/assets/templates/products.template.handlebars')
  const template = await response.text()
  const templateCompiled = Handlebars.compile(template)
  const html = templateCompiled({ products })
  productSection.innerHTML = html
}

/* -------------------------------------------------------------------------- */
/*                            LISTENER DE PRODUCTOS                           */
/* -------------------------------------------------------------------------- */
createProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(createProductForm)
  const formValues = Object.fromEntries(formData)
  createProductForm.reset()
  socket.emit('new product', formValues)
})

/* -------------------------------------------------------------------------- */
/*                             LISTENERS DEL CHAT                             */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                              EVENTOS DEL CHAT                              */
/* -------------------------------------------------------------------------- */
socket.on('all messages', allMsg => {
messages = allMsg
cleanChat()
 for (msgData of allMsg){
  renderMsg(msgData)
 }
 chatDisplay.scrollTo(0, chatDisplay.scrollHeight)
})

socket.on('all users', allUser => {
  users = allUser
  cleanChat()
  for (msgData of messages){
    renderMsg(msgData)
  }
  chatDisplay.scrollTo(0, chatDisplay.scrollHeight)
})

/* -------------------------------------------------------------------------- */
/*                            EVENTOS DE PRODUCTOS                            */
/* -------------------------------------------------------------------------- */
socket.on('all products', allProduct => {
  products = allProduct
  cleanProducts()
  renderProducts(allProduct)
})