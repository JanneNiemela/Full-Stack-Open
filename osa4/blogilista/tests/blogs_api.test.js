const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blogs_api_test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned in json format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('all blogs have id as their identifying property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  for (let blog of response.body) {
    assert.strictEqual(Object.prototype.hasOwnProperty.call(blog, 'id'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(blog, '_id'), false)
  }
})

test('posting a new blog with correct content works', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://newblogsomeurl.com/',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  assert(blogs.map((blog) => blog.title).includes('New Blog'))
  assert(blogs.map((blog) => blog.author).includes('New Author'))
  assert(blogs.map((blog) => blog.url).includes('https://newblogsomeurl.com/'))
})

after(async () => {
  await mongoose.connection.close()
})