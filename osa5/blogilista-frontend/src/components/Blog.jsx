import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDel, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const style = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    margin: 5,
  }

  const detailStyle = { display: showDetails ? '' : 'none' }
  const showRemoveButtonStyle = { display: (blog && blog.user && user && user.username === blog.user.username) ? '' : 'none' }
  const toggleButtonText = (showDetails) ? 'Hide' : 'View'

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const like = () => {
    const likedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    handleLike(likedBlog)
  }

  const deleteBlog = () => {
    handleDel(blog)
  }

  return (
    <div style={style}>
      <div>
        {blog && blog.title && blog.title.length > 0 && (<>{blog.title}</>)}
        {blog && blog.author && blog.author.length > 0 && (<> by {blog.author}</>)}
        <button onClick={toggleDetails}>{toggleButtonText}</button>
      </div>
      <div style={detailStyle}>
        {blog && blog.url && blog.url.length > 0 && (<div>URL: {blog.url}</div>)}
        {blog && blog.likes !== null && blog.likes !== undefined && (
          <div>
            Likes: {blog.likes}
            <button onClick={like}>Like</button>
          </div>
        )}
        {blog && blog.user && blog.user.name && blog.user.name.length > 0 && (<div>Added by: {blog.user.name}</div>)}
        <div style={showRemoveButtonStyle}>
          <button onClick={deleteBlog}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog