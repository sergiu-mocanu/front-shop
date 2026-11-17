import { defineConfig } from '@playwright/test'

// Loads .env (git-ignored) into process.env, for the login journey's E2E_EMAIL / E2E_PASSWORD.
// Built into Node (20.12+): no dotenv package. A missing file is fine: that test then skips itself.
try {
  process.loadEnvFile()
} catch {
  // no .env: nothing to load
}

// End-to-end tests: a real browser drives the real app (dev server) against the real Supabase.
export default defineConfig({
  testDir: 'e2e',
  // html: the report read with `npx playwright show-report`; open: 'never' so a failing run doesn't
  // block the terminal by serving it. list: one line per test in the terminal.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    // Kept only when a test fails: what the report shows to understand the failure.
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Playwright starts the dev server itself, unless one is already running on that URL.
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
