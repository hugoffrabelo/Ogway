'use client'

import { Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchRiscos } from '@/lib/portal/api'
import { NIVEL_RISCO_LABEL, tomPorNivelRisco } from '@/lib/portal/labels'
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '@/components/shared'
import type { Impacto, Probabilidade } from '@/lib/portal/types'

const PROBABILIDADES: { valor: Probabilidade; label: string }[] = [
  { valor: 'baixa', label: 'Baixa' },
  { valor: 'media', label: 'Média' },
  { valor: 'alta', label: 'Alta' },
]

// Impacto alto no topo — convenção usual de matriz de risco (mais grave
// primeiro, lido de cima pra baixo).
const IMPACTOS: { valor: Impacto; label: string }[] = [
  { valor: 'alto', label: 'Alto' },
  { valor: 'medio', label: 'Médio' },
  { valor: 'baixo', label: 'Baixo' },
]

// docs/frontend-cockpit-portal.md §4.3 — "grade probabilidade × impacto,
// com indicação de quem é o 'A' (sempre o controlador)." `nivel` vem
// pronto da API (apps/riscos/models._MATRIZ_NIVEL) — não duplicamos essa
// tabela no front, só posicionamos cada risco pela própria
// probabilidade/impacto.
interface MatrizRiscoRaciProps {
  org?: number
}

export function MatrizRiscoRaci({ org }: MatrizRiscoRaciProps = {}) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'riscos', org ?? null],
    queryFn: () => fetchRiscos(org),
  })

  if (status === 'pending') return <LoadingState label="Carregando matriz de riscos…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }
  if (data.length === 0) {
    return <EmptyState titulo="Nenhum risco registrado" descricao="Nenhum risco identificado até o momento." />
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[6rem_repeat(3,1fr)] gap-2">
        <div />
        {PROBABILIDADES.map((p) => (
          <div key={p.valor} className="text-center text-xs font-medium text-muted-foreground">
            {p.label}
          </div>
        ))}

        {IMPACTOS.map((imp) => (
          <Fragment key={imp.valor}>
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              {imp.label}
            </div>
            {PROBABILIDADES.map((prob) => {
              const riscosCelula = data.filter(
                (r) => r.probabilidade === prob.valor && r.impacto === imp.valor
              )
              return (
                <div
                  key={`${prob.valor}-${imp.valor}`}
                  className="flex min-h-[5rem] flex-col gap-1.5 rounded-md border border-border bg-card p-2"
                >
                  {riscosCelula.map((risco) => (
                    <div key={risco.id} className="rounded border border-border bg-background p-1.5">
                      <p className="text-xs font-medium text-foreground">{risco.titulo}</p>
                      <p className="text-[11px] text-muted-foreground">A: {risco.accountable}</p>
                      <StatusBadge
                        status={tomPorNivelRisco(risco.nivel)}
                        label={NIVEL_RISCO_LABEL[risco.nivel]}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
