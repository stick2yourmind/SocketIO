const Products = require('../models/product/product.model')

const newProduct = async (socket, io, newProduct) => {
  await Products.save(newProduct)
  const allProduct = await Products.getAll()
  // Propago los productos en todos los sockets
  io.sockets.emit('all products', allProduct)
}


module.exports = {
  newProduct
}