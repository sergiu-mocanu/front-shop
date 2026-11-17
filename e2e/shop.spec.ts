import { expect, test } from '@playwright/test'

// The journey that makes the shop worth something: a visitor finds a product and fills the cart.
// Each step is what a user would do, found the way a user sees it (getByRole, as in the RTL tests).
// Runs on the real catalogue: it depends on "Lampe Aria" existing and being in stock.
test('a visitor browses the catalogue and fills the cart', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Boutique' }).click()
  await expect(page.getByRole('heading', { name: 'Tous les produits' })).toBeVisible()

  // The card's price as displayed, to check the cart total against it.
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Lampe Aria' }) })
  const price = await card.getByText(/^\d+(,\d+)? €$/).innerText()

  await card.getByRole('button', { name: /ajouter au panier/i }).click()

  const cart = page.getByRole('complementary', { name: /le panier/i })
  await expect(cart.getByRole('heading', { name: /le panier/i })).toContainText('1')
  await expect(cart.getByText('Lampe Aria')).toBeVisible()
  await expect(cart.getByText(`Total ${price}`)).toBeVisible()
})
