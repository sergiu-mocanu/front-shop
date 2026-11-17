import { useEffect, type ReactElement } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation, type Location } from 'react-router-dom'

// Renders a component inside the providers the app's pages need: React Query and the Router.
// - retry: false: a failing query fails at once (React Query would otherwise retry 3 times, with
//   delays, and the test would crawl or time out).
// - MemoryRouter: a router whose URL lives in memory, starting at `url`; no browser address bar.
// - getLocation(): the router's current URL, for tests that check what the page wrote in it.
export function renderWithProviders(ui: ReactElement, url = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  let location: Location | undefined

  function LocationSpy() {
    const current = useLocation()
    useEffect(() => {
      location = current
    }, [current])
    return null
  }

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        {ui}
        <LocationSpy />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return { ...result, getLocation: () => location }
}
