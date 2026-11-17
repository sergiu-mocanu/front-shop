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
      coverage: {
        provider: 'v8', // V8 (the JS engine in Node and Chrome) records which code each test ran
        reporter: ['text', 'html', 'lcov'], // terminal table, coverage/index.html, lcov for CI tools
        include: ['src/**/*.{ts,tsx}'], // every source file, tested or not: untested ones show 0 %
        exclude: ['src/**/*.d.ts', 'src/test/**', 'src/main.tsx', 'src/**/*.test.{ts,tsx}'],
      },
    },
  }),
)
