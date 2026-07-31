'use client'

import { useState } from 'react'
import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ApiAuthError } from './api-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // 401 é sessão expirada, não erro de tela — manda pro login de
  // qualquer query/mutação, em vez de cada componente tratar por conta
  // própria (docs/frontend-cockpit-portal.md §6).
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof ApiAuthError) router.replace('/login')
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof ApiAuthError) router.replace('/login')
          },
        }),
      })
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
