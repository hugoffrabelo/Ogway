'use client'

import { useAuth } from '@/lib/auth/context'
import { FilaPorPrazo } from '@/components/cockpit/fila-por-prazo'
import { PainelIncidente } from '@/components/cockpit/painel-incidente'
import { PainelSolicitacao } from '@/components/cockpit/painel-solicitacao'

export default function CockpitPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Cockpit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.username} · {user?.papel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Sair
        </button>
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Fila por prazo</h2>
      <div className="mt-3">
        <FilaPorPrazo />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Incidentes</h2>
      <div className="mt-3">
        <PainelIncidente />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Solicitações de titulares</h2>
      <div className="mt-3">
        <PainelSolicitacao />
      </div>
    </div>
  )
}
