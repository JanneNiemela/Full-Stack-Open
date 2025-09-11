const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  // Error handling of request.user is handled in userExtractor middleware, so the user is always valid here.
  const user = request.user

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

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  // Error handling of request.user is handled in userExtractor middleware, so the user is always valid here.
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: `A blog with id ${request.params.id} doesn't exist.` })
  } else if (!blog.user || blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Changing the properties of blogs made by other users is not permitted.' })
  }

  const newBlog = new Blog({
    title: request.body.title,
    author: request.body.author || '',
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  })

  blog.title = newBlog.title
  blog.author = newBlog.author
  blog.url = newBlog.url
  blog.likes = newBlog.likes
  blog.user = newBlog.user

  const updatedBlog = await blog.save()
  const updatedPopulatedBlog = await updatedBlog.populate('user', { username: 1, name: 1, id: 1 })
  response.status(200).json(updatedPopulatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // Error handling of request.user is handled in userExtractor middleware, so the user is always valid here.
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: `A blog with id ${request.params.id} doesn't exist.` })
  } else if (!blog.user || blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Deleting blogs made by other users is not permitted.' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter