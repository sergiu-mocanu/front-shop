import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// The app's Vite config (React plugin, "@" alias) plus the test settings: one source of truth
// for the alias instead of a copy.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom', // a simulated browser (document, window, localStorage) inside Node
      setupFiles: './src/test/setup.ts', // runs before every test file
      exclude: ['node_modules/**', 'dist/**', 'e2e/**'], // e2e/ belongs to Playwright, not Vitest
    },
  }),
)
