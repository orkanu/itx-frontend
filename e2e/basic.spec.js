import { expect, test } from '@playwright/test'

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

// Helper to click the first button in a group of radio buttons or checkboxes
async function clickFirstButtonForGroup(groupLocator) {
  await new Promise((r) => setTimeout(r, 1000))
  if (await groupLocator.count()) {
    const firstBtn = groupLocator.getByRole('button').first()
    if (await firstBtn.isVisible()) {
      await firstBtn.click()
    }
  }
}

// Helper to read the basket count from the header
const readBasketCount = async (page) => {
  const basketLocator = page.locator('.header__right span')
  const txt = (await basketLocator.innerText()) ?? ''
  const m = txt.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

test('details page add to basket increases header count', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Products Shop')
  const firstCard = page.locator('.card').first()
  await expect(firstCard).toBeVisible()

  const initialBasketCount = await readBasketCount(page)

  const detailsLink = page.getByRole('link', { name: /View details for/i }).first()
  await detailsLink.click()
  await page.waitForLoadState('domcontentloaded')

  const colorGroup = page.getByRole('group', { name: /Colors/i })
  await clickFirstButtonForGroup(colorGroup)

  const storageGroup = page.getByRole('group', { name: /Storages/i })
  await clickFirstButtonForGroup(storageGroup)

  const addBtn = page.getByRole('button', { name: /Add to basket|Adding…/i })
  await expect(addBtn).toBeVisible()
  await addBtn.click()

  await expect(addBtn).toHaveText(/Add to basket/i, { timeout: 15000 })

  await expect
    .poll(async () => await readBasketCount(page), {
      message: 'Basket count should increase after adding a product',
      intervals: [200, 400, 800],
      timeout: 15000,
    })
    .toBe(initialBasketCount + 1)
})
