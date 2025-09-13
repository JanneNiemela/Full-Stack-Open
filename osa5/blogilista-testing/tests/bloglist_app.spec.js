const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, addBlog } = require('./test_helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to the application' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(await page.getByLabel('Username:')).toBeVisible()
    await expect(await page.getByLabel('Password:')).toBeVisible()  
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'testuser', 'password')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'testuser', 'wrongpassword')

      const notification = await page.getByTestId('notificationText')
      await expect(notification).toContainText('Wrong username or password.')
      await expect(notification).toBeVisible()

      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await login(page, 'testuser', 'password')
      })

      test('a new blog can be created', async ({ page }) => {
        await addBlog(page, 'Test blog', 'Test Author', 'www.testblogurl.com')
        await expect(page.getByText('Added a new blog.')).toBeVisible()
      })

      test('a created blog can be liked', async ({ page }) => {
        await addBlog(page, 'Test blog', 'Test Author', 'www.testblogurl.com')
        
        const blogParent = await page.getByText('Test blog by Test Author').locator('..')

        await blogParent.getByRole('button', { name: 'View' }).click()
        await expect(blogParent.getByRole('button', { name: 'Hide' })).toBeVisible()

        await blogParent.getByRole('button', { name: 'Like' }).click()
        await blogParent.getByText('1').waitFor()
      })

      test('a created blog can be deleted', async ({ page }) => {
        await addBlog(page, 'Test blog', 'Test Author', 'www.testblogurl.com')
        const blogParent = await page.getByText('Test blog by Test Author').locator('..')
        await blogParent.getByRole('button', { name: 'View' }).click()

        page.on('dialog', dialog => dialog.accept());
        await blogParent.getByRole('button', { name: 'Remove' }).click()

        await expect(page.getByText('Blog deleted.')).toBeVisible()
        await expect(page.getByText('Test blog by Test Author')).not.toBeVisible()
      })
    })
  })
})