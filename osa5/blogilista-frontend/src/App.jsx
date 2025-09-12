import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(returnedBlogs => {
        setBlogs(returnedBlogs.sort((a, b) => a.likes < b.likes))
      })
      .catch(error => {
        displayNotification('Failed to load persons from the server.', 4000, true)
        console.error(error.message)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogListAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error(`Wrong username or password: ${error.message}`)
      displayNotification('Wrong username or password.', 4000, true)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogListAppUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const displayNotification = (message, durationMs, isError) => {
    setErrorNotification(isError)
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, durationMs)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required={true}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required={true}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = (blog) => {
	  blogFormRef?.current?.toggleVisibility()

    blogService
      .create(blog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        if (returnedBlog && returnedBlog.title) {
          let msg = `Added a new blog ${returnedBlog.title}`
          if (returnedBlog.author && returnedBlog.author.length > 0) {
            msg += ` by ${returnedBlog.author}`
          }
          displayNotification(msg, 4000, false)
        }
      })
      .catch(error => {
        console.error(`Failed to create a new blog: (${error.message})`)
        displayNotification('Failed to create a new blog.', 4000, true)
      })
  }

  const likeBlog = (blog) => {
    blogService
      .update(blog.id, blog)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
      })
      .catch(error => {
        console.error(`Failed to like a blog: (${error.message})`)
        displayNotification('Failed to like a blog.', 4000, true)
      })
  }

  const deleteBlog = (blog) => {
    let msg = `Delete blog ${blog.title}`
    if (blog.author && blog.author.length > 0) {
      msg += ` by ${blog.author}`
    }
    msg += '?'
    if (!confirm(msg)) {
      return
    }
    const id = blog.id
    blogService
      .del(id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== id))
        displayNotification('Blog deleted.', 4000, false)
      })
      .catch(error => {
        console.error(`Failed to delete a blog: (${error.message})`)
        displayNotification('Failed to delete a blog.', 4000, true)
      })
  }

  const blogList = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={likeBlog} handleDel={deleteBlog} user={user}/>
      )}
    </div>
  )

  return (
    <div>
      {!user && <h1>Log in to the application</h1>}
      {user && <h1>Blogs</h1>}

      <Notification message={notification} isError={errorNotification}/>

      {!user && loginForm()}
      {user && (
        <div>
          <div>
            {user.name} logged in.
            <button onClick={handleLogOut}>Log out</button>
          </div>
          <Togglable buttonLabel='Create a new blog' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          <br></br>
          {blogList()}
        </div>
      )}

    </div>
  )
}

export default App