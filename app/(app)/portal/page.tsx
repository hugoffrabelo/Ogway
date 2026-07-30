'use client'

import { useAuth } from '@/lib/auth/context'
import { KpiCard, StatusBadge } from '@/components/shared'

// Placeholder — Fase C do doc de frontend substitui isto por
// DashboardConformidade etc. Dado fictício, só pra validar componentes.
export default function PortalPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Portal do cliente</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.username}</p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Sair
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Grau de conformidade" valor="72%" variacao={{ texto: '+5 pontos no trimestre', tom: 'ok' }} />
        <div className="flex flex-col justify-center gap-2 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Pendências que exigem sua decisão</p>
          <StatusBadge status="atencao" label="1 aprovação pendente" />
        </div>
      </div>
    </div>
  )
}
