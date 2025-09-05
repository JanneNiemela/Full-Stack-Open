// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blogWithMostLikes, blog) => {
    return blog.likes > blogWithMostLikes.likes ? blog : blogWithMostLikes
  }
  return !blogs || blogs.length === 0 ? null : blogs.reduce(reducer, blogs[0], blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}