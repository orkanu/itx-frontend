import { test, expect } from '@playwright/test'

test('loads, shows list, and filters by model M900 to a single result', async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 30000)
  await page.goto('/')

  await expect(page).toHaveTitle('Products Shop')

  const cards = page.locator('.card')
  await expect(cards.first()).toBeVisible()
  const initialCount = await cards.count()
  expect(initialCount).toBeGreaterThan(0)

  const input = page.getByPlaceholder(/Filter by brand or model/i)
  await input.click()
  await input.fill('M900')

  // Wait for the filter to complete cause of the debounce
  await page.waitForTimeout(400)

  await expect(cards).toHaveCount(1)
  await expect(page.getByText('M900', { exact: false })).toBeVisible()
})
