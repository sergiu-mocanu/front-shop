import { expect, test } from '@playwright/test'

// A test account's login, from .env (never in the repo): E2E_EMAIL and E2E_PASSWORD.
const email = process.env.E2E_EMAIL
const password = process.env.E2E_PASSWORD

// Without them (a fresh clone, CI without secrets) the journey is skipped, not failed.
test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD not set (see README, Tests)')

test('a customer logs in, reaches their account and logs out', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Connexion' }).click()

  await page.getByLabel('E-mail').fill(email!)
  await page.getByLabel('Mot de passe').fill(password!)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  // Real Supabase session: the form redirects to the account page.
  await expect(page).toHaveURL('/account')
  await expect(page.getByRole('heading', { name: 'Mes commandes' })).toBeVisible()
  await expect(page.getByText(`Vous êtes connecté avec ${email}`)).toBeVisible()

  // And back out: the header offers "Connexion" again.
  await page.getByRole('main').getByRole('button', { name: 'Se déconnecter' }).click()
  await expect(page.getByRole('link', { name: 'Connexion' })).toBeVisible()
})
