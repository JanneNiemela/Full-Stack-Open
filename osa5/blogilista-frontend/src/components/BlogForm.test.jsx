import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls the handler function with correct arguments when blog form is submitted', async () => {
    const user = userEvent.setup()
    const addBlog = vi.fn()

    const { container } = render(<BlogForm addBlog={addBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const sendButton = screen.getByText('Create')

    await user.type(titleInput, 'title test')
    await user.type(authorInput, 'author test')
    await user.type(urlInput, 'url test')
    await user.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('title test')
    expect(addBlog.mock.calls[0][0].author).toBe('author test')
    expect(addBlog.mock.calls[0][0].url).toBe('url test')
  })
})