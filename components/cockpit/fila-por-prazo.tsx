'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchFilaHoje } from '@/lib/cockpit/api'
import { labelItemFila } from '@/lib/cockpit/labels'
import { ClienteTag, EmptyState, ErrorState, LoadingState, PrazoBadge } from '@/components/shared'

// docs/frontend-cockpit-portal.md §4.2 — "tabela/lista ordenável
// cross-cliente (incidentes, solicitações, tasks), célula = PrazoBadge +
// ClienteTag." Tasks não estão aqui porque apps/cockpit/services.fila_hoje
// (a fonte) não as agrega ainda — não inventamos dado que o backend não
// devolve.
export function FilaPorPrazo() {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['cockpit', 'fila-hoje'],
    queryFn: fetchFilaHoje,
  })

  if (status === 'pending') {
    return <LoadingState label="Carregando fila…" />
  }

  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState
        titulo="Sem prazos em aberto"
        descricao="Nenhum incidente ou solicitação pendente no momento."
      />
    )
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {data.map((item) => (
        <li
          key={`${item.tipo}-${item.objeto.id}`}
          className="flex flex-wrap items-center justify-between gap-4 p-4"
        >
          <div className="flex flex-wrap items-center gap-3">
            <ClienteTag nome={item.org_nome} />
            <span className="text-sm text-foreground">{labelItemFila(item)}</span>
          </div>
          {item.dias_uteis_restantes !== null ? (
            <PrazoBadge diasUteisRestantes={item.dias_uteis_restantes} />
          ) : (
            <span className="text-xs text-muted-foreground">Sem prazo definido</span>
          )}
        </li>
      ))}
    </ul>
  )
}
