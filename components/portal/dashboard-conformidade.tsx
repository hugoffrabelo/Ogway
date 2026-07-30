'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/lib/portal/api'
import { GRAU_LABEL, formatarNota } from '@/lib/portal/labels'
import { ErrorState, KpiCard, LoadingState } from '@/components/shared'

const GRAUS = ['basico', 'intermediario', 'avancado'] as const

// docs/frontend-cockpit-portal.md §4.3 — "nota + degrau de maturidade."
// O backend (apps/portal/services.dashboard) devolve uma nota por grau,
// não uma nota única + rótulo — mostramos os três lado a lado em vez de
// inventar uma agregação que a API não calcula.
export function DashboardConformidade() {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'dashboard'],
    queryFn: fetchDashboard,
  })

  if (status === 'pending') return <LoadingState label="Carregando dashboard…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Nota de conformidade LGPD</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GRAUS.map((grau) => (
            <KpiCard key={grau} label={GRAU_LABEL[grau]} valor={formatarNota(data.nota_lgpd[grau])} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Resumo operacional</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Incidentes abertos" valor={data.incidentes_abertos} />
          <KpiCard label="Solicitações pendentes" valor={data.solicitacoes_pendentes} />
          <KpiCard label="Operadores com DPA vencendo" valor={data.operadores_dpa_vencendo} />
          <KpiCard label="Tarefas atrasadas" valor={data.tasks_atrasadas} />
        </div>
      </div>
    </div>
  )
}
