import { useEffect, useState } from 'react'
import type { FetchResult } from '@/types/ecommerce'

export async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`La requête a échoué (${response.status} ${response.statusText}).`)
  }
  return response.json() as Promise<T>
}

export function useFetch<T>(url: string): FetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    void fetchData<T>(url, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ status: 'success', data })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            status: 'error',
            message: error instanceof Error ? error.message : 'Une erreur inattendue est survenue.',
          })
        }
      })

    return () => controller.abort()
  }, [url])

  return result
}
