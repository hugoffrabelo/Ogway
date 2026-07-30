'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/auth/context'
import { LoadingState } from '@/components/shared'

// Gate de autenticação (front/back em origens separadas: o cookie de
// sessão do Django só existe no navegador, então essa checagem tem que
// rodar no cliente — ver lib/auth/api.ts). Autorização de verdade
// continua no Django; isto é só para não renderizar UI errada.
function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Verificando sessão…" />
      </div>
    )
  }

  return <>{children}</>
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  )
}
