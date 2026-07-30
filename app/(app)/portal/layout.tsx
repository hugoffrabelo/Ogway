'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { PAPEIS_PORTAL } from '@/lib/auth/types'

// Roda dentro de app/(app)/layout.tsx, que já garante status === 'authenticated'.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const autorizado = !!user && PAPEIS_PORTAL.includes(user.papel)

  useEffect(() => {
    if (user && !autorizado) router.replace('/cockpit')
  }, [user, autorizado, router])

  if (!autorizado) return null

  return <>{children}</>
}
