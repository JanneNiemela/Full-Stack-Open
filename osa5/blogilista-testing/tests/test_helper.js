const login = async (page, username, password) => {
  await page.getByLabel('Username:').fill(username)
  await page.getByLabel('Password:').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const addBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create a new blog' }).click()

  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)

  await page.getByRole('button', { name: 'Create' }).click()

  await page.getByText(`${title} by ${author}`).waitFor()
}

export { login, addBlog }