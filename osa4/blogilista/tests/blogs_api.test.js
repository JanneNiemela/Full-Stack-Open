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

test('posting a new blog without a title returns 400 bad request', async () => {
  const newBlog = {
    author: 'New Author Without A Title',
    url: 'https://newblogsomewithoutauthorurl.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const addedBlogs = await helper.findWithTitleFromDb('New Author Without A Title')
  assert.strictEqual(addedBlogs.length, 0)
})

test('posting a new blog without url returns 400 bad request', async () => {
  const newBlog = {
    title: 'New Blog Without URL',
    author: 'New Author Without URL',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const addedBlogs = await helper.findWithTitleFromDb('New Blog Without URL')
  assert.strictEqual(addedBlogs.length, 0)
})

test('posting a new blog with correct content with or without likes works', async () => {
  const correctBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://newblogsomeurl.com/',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(correctBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  const addedCorrectBlogs = await helper.findWithTitleFromDb('New Blog')
  assert.strictEqual(addedCorrectBlogs.length, 1)

  // A test for blogs without likes is also included here, because if it is separated into another test,
  // the blog doesn't seem to be added to the test database for some reason.
  const blogWithoutLikes = {
    title: 'New Blog Without Likes',
    author: 'New Author Without Likes',
    url: 'https://newblogsomewithoutlikesurl.com/'
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const addedBlogsWithoutLikes = await helper.findWithTitleFromDb('New Blog Without Likes')
  assert.strictEqual(addedBlogsWithoutLikes.length, 1)
  assert.strictEqual(addedBlogsWithoutLikes[0].likes, 0)
  const blogsAtTheEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtTheEnd.length, helper.initialBlogs.length + 2)
})

after(async () => {
  await mongoose.connection.close()
})