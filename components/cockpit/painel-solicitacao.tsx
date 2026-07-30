'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchSolicitacoesCockpit } from '@/lib/cockpit/api'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'
import { SolicitacaoRow } from './solicitacao-row'
import { NovaSolicitacaoForm } from './nova-solicitacao-form'

// docs/frontend-cockpit-portal.md §4.2 — "fluxo Art. 18 com relógio de
// SLA." Ao contrário da FilaPorPrazo (só RECEBIDA/EM_ANALISE), mostra
// todos os status, inclusive o histórico (RESPONDIDA/NEGADA).
export function PainelSolicitacao() {
  const [criando, setCriando] = useState(false)
  const { data, status, error, refetch } = useQuery({
    queryKey: ['cockpit', 'solicitacoes'],
    queryFn: fetchSolicitacoesCockpit,
  })

  return (
    <div className="flex flex-col gap-3">
      {criando ? (
        <NovaSolicitacaoForm onCancel={() => setCriando(false)} onCriada={() => setCriando(false)} />
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            + Nova solicitação
          </button>
        </div>
      )}

      {status === 'pending' && <LoadingState label="Carregando solicitações…" />}

      {status === 'error' && (
        <ErrorState
          descricao={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      )}

      {status === 'success' &&
        (data.length === 0 ? (
          <EmptyState
            titulo="Nenhuma solicitação registrada"
            descricao="Nenhuma organização atendida tem solicitação de titular em aberto."
          />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {data.map((solicitacao) => (
              <SolicitacaoRow key={solicitacao.id} solicitacao={solicitacao} />
            ))}
          </ul>
        ))}
    </div>
  )
}
