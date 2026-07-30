'use client'

import { useAuth } from '@/lib/auth/context'

// Placeholder — Fase B do doc de frontend substitui isto por FilaPorPrazo etc.
export default function CockpitPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-serif text-2xl text-foreground">Cockpit</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user?.username} · {user?.papel}
      </p>
      <button
        type="button"
        onClick={() => logout()}
        className="mt-6 text-sm text-accent-foreground underline"
      >
        Sair
      </button>
    </div>
  )
}
