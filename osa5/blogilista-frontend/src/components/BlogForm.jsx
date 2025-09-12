import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const createBlog = event => {
    event.preventDefault()
    const blog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: 0,
    }
    addBlog(blog)
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return(
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={createBlog}>
        <div>
          <label>Title:</label>
          <input value={newBlogTitle} onChange={() => setNewBlogTitle(event.target.value)} required={true} id='title-input' />
        </div>
        <div>
          <label>Author:</label>
          <input value={newBlogAuthor} onChange={() => setNewBlogAuthor(event.target.value)} id='author-input' />
        </div>
        <div>
          <label>URL:</label>
          <input value={newBlogUrl} onChange={() => setNewBlogUrl(event.target.value)} required={true} id='url-input' />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm