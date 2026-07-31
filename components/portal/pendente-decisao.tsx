'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aceitarRisco, fetchRiscos } from '@/lib/portal/api'
import { NIVEL_RISCO_LABEL, tomPorNivelRisco } from '@/lib/portal/labels'
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '@/components/shared'
import type { Risco } from '@/lib/portal/types'

// docs/frontend-cockpit-portal.md §4.3 — "único ponto não passivo do
// portal." Mesma fonte de dado que MatrizRiscoRaci (['portal','riscos']),
// só filtrada a `pendente_decisao_cliente` (blueprint §6.4).
// Sem prop `org` de propósito: "aceitar risco" é a decisão do cliente
// (RACI — o encarregado nunca assume a decisão do controlador, CLAUDE.md).
// O DrilldownCliente do cockpit reaproveita MatrizRiscoRaci (só leitura),
// nunca este componente.
export function PendenteDecisao() {
  const queryClient = useQueryClient()
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'riscos', null],
    queryFn: () => fetchRiscos(),
  })

  if (status === 'pending') return <LoadingState label="Carregando pendências…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  const pendentes = data.filter((r) => r.pendente_decisao_cliente)

  if (pendentes.length === 0) {
    return (
      <EmptyState
        titulo="Nenhuma decisão pendente"
        descricao="Não há riscos aguardando sua decisão no momento."
      />
    )
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {pendentes.map((risco) => (
        <PendenteDecisaoRow
          key={risco.id}
          risco={risco}
          onDone={() => queryClient.invalidateQueries({ queryKey: ['portal', 'riscos', null] })}
        />
      ))}
    </ul>
  )
}

function PendenteDecisaoRow({ risco, onDone }: { risco: Risco; onDone: () => void }) {
  const mutation = useMutation({
    mutationFn: () => aceitarRisco(risco.id),
    onSuccess: onDone,
  })

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{risco.titulo}</p>
        <p className="text-xs text-muted-foreground">Responsável (A): {risco.accountable}</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={tomPorNivelRisco(risco.nivel)} label={NIVEL_RISCO_LABEL[risco.nivel]} />
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Aceitar risco
        </button>
      </div>
      {mutation.isError && (
        <p className="w-full text-xs font-medium text-status-critico">
          {(mutation.error as Error).message}
        </p>
      )}
    </li>
  )
}
