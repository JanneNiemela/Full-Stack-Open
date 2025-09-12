import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  beforeEach(() => {
    const blog = {
      id: 'ds30493049309d343d',
      title: 'Test blog title',
      author: 'Blog Author',
      url: 'https://frontendtesturl.com/',
      likes: 100,
      user: {
        id: '3329480923fdfdf3943',
        name: 'Test User',
        username: 'Username',
      }
    }

    render(<Blog blog={blog} />)
  })

  test('renders the title and the author of the blog at start', () => {
    const title = screen.getByText('Test blog title', { exact: false })
    const author = screen.getByText('Blog Author', { exact: false })

    expect(title).toBeVisible()
    expect(author).toBeVisible()
  })

  test('hides url, likes, and the name of user who posted the blog at start', async () => {
    const url = screen.getByText('https://frontendtesturl.com/', { exact: false })
    const likes = screen.getByText('100', { exact: false })
    const nameOfUserWhoPostedThis = screen.getByText('Test User', { exact: false })

    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
    expect(nameOfUserWhoPostedThis).not.toBeVisible()
  })

  test('toggling the details with the toggle button works', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View', { exact: false })

    const url = screen.getByText('https://frontendtesturl.com/', { exact: false })
    const likes = screen.getByText('100', { exact: false })
    const userInfo = screen.getByText('Test User', { exact: false })

    await user.click(button)

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(userInfo).toBeVisible()

    await user.click(button)

    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
    expect(userInfo).not.toBeVisible()
  })
})