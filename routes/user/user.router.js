const router = require('express').Router()
const Users = require('../../models/user/user.model')

const getAllUser = async (req, res, next) => {
  const users = await Users.getAll()
  res.json({ data: users })
}

const getUserById = async (req, res, next) => {
  const { id } = req.params
  const user = await Users.getById(Number(id))
  res.json({ data: user })
}

const createUser = async (req, res, next) => {
  const { name, socketId } = req.body
  Users.save({ name, socketId })
  res.json({ data: { name, socketId } })
}

const updateUserById = async (req, res, next) => {
  const { id } = req.params
  const { name, socketId } = req.body
  Users.updateById({ name, socketId }, Number(id))
  res.json({ data: { name, socketId } })
}

const deleteUserById = async (req, res, next) => {
  const { id } = req.params
  Users.deleteById(Number(id))
  res.json({ deleted: true })
}

router.get('/', getAllUser)

router.get('/:id', getUserById)

router.post('/', createUser)

router.put('/:id', updateUserById)

router.delete('/:id', deleteUserById)



module.exports = router
