const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid.' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author || '',
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid.' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'userId is missing or not valid.' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: `A blog with id ${request.params.id} doesn't exist.` })
  } else if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Deleting blogs made by other users is not permitted.' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter