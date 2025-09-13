const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login } = require('./test_helper')

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
  })
})