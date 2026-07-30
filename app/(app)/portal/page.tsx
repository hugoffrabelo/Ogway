'use client'

import { useAuth } from '@/lib/auth/context'
import { DashboardConformidade } from '@/components/portal/dashboard-conformidade'
import { PendenteDecisao } from '@/components/portal/pendente-decisao'
import { MatrizRiscoRaci } from '@/components/portal/matriz-risco-raci'
import { RepositorioDocumentos } from '@/components/portal/repositorio-documentos'

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

      <div className="mt-8">
        <DashboardConformidade />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Pendente da sua decisão</h2>
      <div className="mt-3">
        <PendenteDecisao />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Matriz de risco (RACI)</h2>
      <div className="mt-3">
        <MatrizRiscoRaci />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Documentos publicados</h2>
      <div className="mt-3">
        <RepositorioDocumentos />
      </div>
    </div>
  )
}
