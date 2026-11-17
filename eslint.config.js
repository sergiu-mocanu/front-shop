import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import storybook from 'eslint-plugin-storybook'

export default defineConfig([
  // Build output and generated test reports: not our source.
  globalIgnores(['dist', 'coverage', 'playwright-report*', 'test-results', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Rules for *.stories.tsx files (eslint-plugin-storybook)
  ...storybook.configs['flat/recommended'],
])
