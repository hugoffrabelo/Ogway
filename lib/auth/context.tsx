'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authApi from './api'
import type { Usuario } from './types'

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: Usuario | null
  status: Status
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  const refetch = useCallback(async () => {
    setStatus('loading')
    const me = await authApi.fetchMe()
    setUser(me)
    setStatus(me ? 'authenticated' : 'unauthenticated')
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  return ctx
}
