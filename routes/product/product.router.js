const router = require('express').Router()
const Products = require('../../models/product/product.model')

const getAllProduct = async (req, res, next) => {
  const products = await Products.getAll()
  res.json({ data: products })
}


const getProductById = async (req, res, next) => {
  const { id } = req.params
  const product = await Products.getById(Number(id))
  res.json({ data: product })
}

const createProduct = async (req, res, next) => {
  const { title, price, img } = req.body
  Products.save({ title, price, img })
  res.json({ data: { title, price, img } })
}

const updateProductById = async (req, res, next) => {
  const { id } = req.params
  const { title, price, img } = req.body
  Products.updateById({ title, price, img }, Number(id))
  res.json({ data: { title, price, img } })
}

const deleteProductById = async (req, res, next) => {
  const { id } = req.params
  Products.deleteById(Number(id))
  res.json({ deleted: true })
}

router.get('/', getAllProduct)

router.get('/:id', getProductById)

router.post('/', createProduct)

router.put('/:id', updateProductById)

router.delete('/:id', deleteProductById)



module.exports = router
