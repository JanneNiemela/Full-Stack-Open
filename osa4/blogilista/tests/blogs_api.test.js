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

after(async () => {
  await mongoose.connection.close()
})