import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(false)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      })
      .catch(error => {
        displayNotification(`Failed to load persons from the server.`, 4000, true)
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
      displayNotification(`Wrong username or password.`, 4000, true)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogListAppUser')
    blogService.setToken("")
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

  const handleBlogTitleChange = event => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = event => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = event => {
    setNewBlogUrl(event.target.value)
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

  const addBlog = event => {
    event.preventDefault()
    const blog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: 0,
    }

    blogService
      .create(blog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
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
        displayNotification(`Failed to create a new blog.`, 4000, true)
      })
  }

  const blogForm = () => (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>Title:</label>
          <input value={newBlogTitle} onChange={handleBlogTitleChange} required={true}/>
        </div>
        <div>
          <label>Author:</label>
          <input value={newBlogAuthor} onChange={handleBlogAuthorChange}/>
        </div>
        <div>
          <label>URL:</label>
          <input value={newBlogUrl} onChange={handleBlogUrlChange} required={true}/>
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
          {blogForm()}
          <br></br>
          {blogList()}
        </div>
      )}

    </div>
  )
}

export default App