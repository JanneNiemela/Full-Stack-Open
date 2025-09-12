import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', async () => {
  const blog = {
    id: 'ds30493049309d343d',
    title: 'Test blog title',
    author: 'Blog Author',
    url: 'https://frontendtesturl.com/',
    likes: 10,
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Test blog title', { exact: false })
  expect(element).toBeDefined()
})