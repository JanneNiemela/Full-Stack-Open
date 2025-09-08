const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  let { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'Password is missing.' })
  } else if (!username) {
    return response.status(400).json({ error: 'Username is missing.' })
  } else if (password.length < 3) {
    return response.status(400).json({ error: 'Password is too short. It must be at least three characters long.' })
  } else if (username.length < 3) {
    return response.status(400).json({ error: 'Username is too short. It must be at least three characters long.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter