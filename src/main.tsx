import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/index.css'
import App from '@/App'

// The server-state cache. staleTime: data younger than a minute is served from the cache without
// a new request, so moving between pages doesn't refetch the catalogue each time.
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
