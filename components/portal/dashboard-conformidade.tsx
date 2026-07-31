'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/lib/portal/api'
import { descricaoNota, GRAU_LABEL } from '@/lib/frameworks/labels'
import type { Perfil } from '@/lib/frameworks/types'
import { ErrorState, KpiCard, LoadingState } from '@/components/shared'

const GRAUS: Perfil[] = ['basico', 'intermediario', 'avancado']

// docs/frontend-cockpit-portal.md §4.3 — "nota + degrau de maturidade."
// O backend (apps/portal/services.dashboard) devolve nota+avaliados+total
// por grau — "não avaliado" (avaliados===0) nunca aparece como "0/100"
// (revisão do plano de ControleAvaliacao: zero só quando há avaliação
// de verdade por trás).
interface DashboardConformidadeProps {
  /** Passado pelo DrilldownCliente do cockpit; ausente no portal (auto-escopado). */
  org?: number
}

export function DashboardConformidade({ org }: DashboardConformidadeProps = {}) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'dashboard', org ?? null],
    queryFn: () => fetchDashboard(org),
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
          {GRAUS.map((grau) => {
            const { texto, cobertura } = descricaoNota(data.nota_lgpd[grau])
            return (
              <KpiCard
                key={grau}
                label={GRAU_LABEL[grau]}
                valor={texto}
                variacao={cobertura ? { texto: cobertura, tom: 'neutro' } : undefined}
              />
            )
          })}
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
