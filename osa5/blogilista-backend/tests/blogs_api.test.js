const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token
let incorrectToken = 'a'

describe('when there are blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'blogs_api_test_user', passwordHash })
    await user.save()

    const tokenUser = {
      username: user.username,
      id: user._id,
    }
    token = jwt.sign(tokenUser, process.env.SECRET)
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

  describe('posting', () => {
    test('a new blog with correct content but without a token fails with correct status code', async () => {
      const correctBlogWithoutToken = {
        title: 'New Blog',
        author: 'New Author',
        url: 'https://newblogsomeurl.com/',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(correctBlogWithoutToken)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const addedCorrectBlogs = await helper.findBlogWithTitleFromDb('New Blog')
      assert.strictEqual(addedCorrectBlogs.length, 0)
    })

    test('a new blog with correct content but with an incorrect token fails with correct status code', async () => {
      const correctBlogWithoutToken = {
        title: 'New Blog',
        author: 'New Author',
        url: 'https://newblogsomeurl.com/',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(correctBlogWithoutToken)
        .set('Authorization', `Bearer ${incorrectToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const addedCorrectBlogs = await helper.findBlogWithTitleFromDb('New Blog')
      assert.strictEqual(addedCorrectBlogs.length, 0)
    })

    test('a new blog without a title returns 400 bad request', async () => {
      const newBlog = {
        author: 'New Author Without A Title',
        url: 'https://newblogsomewithoutauthorurl.com/',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const addedBlogs = await helper.findBlogWithTitleFromDb('New Author Without A Title')
      assert.strictEqual(addedBlogs.length, 0)
    })

    test('a new blog without url returns 400 bad request', async () => {
      const newBlog = {
        title: 'New Blog Without URL',
        author: 'New Author Without URL',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const addedBlogs = await helper.findBlogWithTitleFromDb('New Blog Without URL')
      assert.strictEqual(addedBlogs.length, 0)
    })

    test('a new blog with correct content and a correct token works', async () => {
      const correctBlog = {
        title: 'New Blog',
        author: 'New Author',
        url: 'https://newblogsomeurl.com/',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(correctBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const addedCorrectBlogs = await helper.findBlogWithTitleFromDb('New Blog')
      assert.strictEqual(addedCorrectBlogs.length, 1)
    })

    test('a new blog with a correct token without likes sets the likes count to zero works', async () => {
      const blogWithoutLikes = {
        title: 'New Blog Without Likes',
        author: 'New Author Without Likes',
        url: 'https://newblogsomewithoutlikesurl.com/'
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const addedBlogsWithoutLikes = await helper.findBlogWithTitleFromDb('New Blog Without Likes')
      assert.strictEqual(addedBlogsWithoutLikes.length, 1)
      assert.strictEqual(addedBlogsWithoutLikes[0].likes, 0)
    })
  })

  describe('deletion', () => {
    test('with a valid id but without a token fails with the correct status code', async () => {
      const blogsBeforeOperation = await helper.blogsInDb()
      const deletedBlog = blogsBeforeOperation[0]

      await api
        .delete(`/api/blogs/${deletedBlog.id}`)
        .expect(401)

      const blogsWithDeletedTitle = await helper.findBlogWithTitleFromDb(deletedBlog.title)
      assert.strictEqual(blogsWithDeletedTitle.length, 1)
    })

    test('with a valid id but without a valid token fails with the correct status code', async () => {
      const blogsBeforeOperation = await helper.blogsInDb()
      const deletedBlog = blogsBeforeOperation[0]

      await api
        .delete(`/api/blogs/${deletedBlog.id}`)
        .set('Authorization', `Bearer ${incorrectToken}`)
        .expect(401)

      const blogsWithDeletedTitle = await helper.findBlogWithTitleFromDb(deletedBlog.title)
      assert.strictEqual(blogsWithDeletedTitle.length, 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const nonExistentID = await helper.nonExistingId
      await api
        .delete(`/api/blogs/${nonExistentID}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    test('succeeds with status code 204 if the blog id is valid and it is posted by the token holder', async () => {
      const newBlog = {
        title: 'Blog to be deleted',
        author: 'Author',
        url: 'https://newblogsomeurl.com/',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const addedBlogs = await helper.findBlogWithTitleFromDb('Blog to be deleted')
      assert.strictEqual(addedBlogs.length, 1)

      await api
        .delete(`/api/blogs/${addedBlogs[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const deletedBlogs = await helper.findBlogWithTitleFromDb('Blog to be deleted')
      assert.strictEqual(deletedBlogs.length, 0)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})