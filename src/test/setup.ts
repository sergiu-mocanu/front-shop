import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
// Adds DOM matchers such as toBeInTheDocument() to expect(), and their TypeScript types.
import '@testing-library/jest-dom/vitest'

// Unmount what each test rendered. Testing Library does it by itself only when the test runner
// exposes a global afterEach (Vitest's `globals: true`); without it, a test would find the
// previous test's elements still in the page.
afterEach(() => cleanup())
