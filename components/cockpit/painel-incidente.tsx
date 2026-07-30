'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIncidentesCockpit } from '@/lib/cockpit/api'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'
import { IncidenteRow } from './incidente-row'
import { NovoIncidenteForm } from './novo-incidente-form'

// docs/frontend-cockpit-portal.md §4.2 — "vista da máquina de estados
// (§6.5 do blueprint) com transições visíveis." Ao contrário da
// FilaPorPrazo (só o que tem prazo correndo), este painel mostra todos
// os estágios — inclusive registrado/avaliando_risco, que fila_hoje não
// traz por não terem prazo ainda.
export function PainelIncidente() {
  const [criando, setCriando] = useState(false)
  const { data, status, error, refetch } = useQuery({
    queryKey: ['cockpit', 'incidentes'],
    queryFn: fetchIncidentesCockpit,
  })

  return (
    <div className="flex flex-col gap-3">
      {criando ? (
        <NovoIncidenteForm onCancel={() => setCriando(false)} onCriado={() => setCriando(false)} />
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            + Novo incidente
          </button>
        </div>
      )}

      {status === 'pending' && <LoadingState label="Carregando incidentes…" />}

      {status === 'error' && (
        <ErrorState
          descricao={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      )}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState titulo="Nenhum incidente registrado" descricao="Nenhuma organização atendida tem incidente em andamento." />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {data.map((incidente) => (
              <IncidenteRow key={incidente.id} incidente={incidente} />
            ))}
          </ul>
        ))}
    </div>
  )
}
