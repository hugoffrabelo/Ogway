'use client'

import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registrarAvaliacao } from '@/lib/frameworks/api'
import {
  ORDEM_STATUS_AVALIACAO,
  STATUS_AVALIACAO_LABEL,
  tomPorStatusAvaliacao,
} from '@/lib/frameworks/labels'
import { STATUS_CONFIG } from '@/lib/status'
import type { AvaliacaoControle, Controle, StatusAvaliacao } from '@/lib/frameworks/types'
import { cn } from '@/lib/utils'

interface ControleAvaliacaoProps {
  controle: Controle
  avaliacao: AvaliacaoControle | undefined
  org: number
}

// docs/frontend-cockpit-portal.md §4.2 — "linha de framework com os
// quatro estados... e indicador provisorio/validado." Marcação rápida em
// série (28 controles de uma vez): sem modal, salvamento automático por
// clique, otimista com reversão se a API falhar.
export function ControleAvaliacao({ controle, avaliacao, org }: ControleAvaliacaoProps) {
  const queryClient = useQueryClient()
  const [statusOtimista, setStatusOtimista] = useState<StatusAvaliacao | null>(
    avaliacao?.status ?? null
  )
  const [expandido, setExpandido] = useState(false)
  const [evidencia, setEvidencia] = useState(avaliacao?.evidencia ?? '')
  const [evidenciaSalva, setEvidenciaSalva] = useState(avaliacao?.evidencia ?? '')
  const [erro, setErro] = useState<string | null>(null)

  // Sincroniza com o dado real quando ele muda por fora (troca de
  // cliente, refetch) — nunca sobrescreve um clique/edição em voo.
  useEffect(() => {
    setStatusOtimista(avaliacao?.status ?? null)
    setEvidencia(avaliacao?.evidencia ?? '')
    setEvidenciaSalva(avaliacao?.evidencia ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org, controle.id, avaliacao?.status, avaliacao?.evidencia])

  const rascunhoSujo = evidencia !== evidenciaSalva

  const mutation = useMutation({
    mutationFn: (dados: { status: StatusAvaliacao; evidencia: string }) =>
      registrarAvaliacao(org, {
        controle: controle.id,
        status: dados.status,
        evidencia: dados.evidencia,
      }),
    onSuccess: (resultado) => {
      setErro(null)
      setEvidenciaSalva(resultado.evidencia)
      queryClient.invalidateQueries({ queryKey: ['frameworks', 'avaliacoes', org] })
      queryClient.invalidateQueries({ queryKey: ['frameworks', 'nota'] })
    },
    onError: () => {
      setStatusOtimista(avaliacao?.status ?? null)
      setErro('Não foi possível salvar — tente de novo.')
    },
  })

  function marcar(novoStatus: StatusAvaliacao) {
    if (mutation.isPending) return // trava clique duplo no mesmo controle em voo
    setStatusOtimista(novoStatus)
    mutation.mutate({ status: novoStatus, evidencia })
  }

  function salvarEvidencia() {
    if (!statusOtimista || mutation.isPending) return
    mutation.mutate({ status: statusOtimista, evidencia })
  }

  function alternarExpansao() {
    if (expandido && rascunhoSujo) {
      const confirmar = window.confirm(
        'Há evidência não salva neste controle. Fechar mesmo assim e perder o rascunho?'
      )
      if (!confirmar) return
      setEvidencia(evidenciaSalva)
    }
    setExpandido((v) => !v)
  }

  // Recarregar/fechar a aba com rascunho não salvo também avisa.
  useEffect(() => {
    if (!rascunhoSujo) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [rascunhoSujo])

  return (
    <li className="flex flex-col gap-2 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            onClick={alternarExpansao}
            aria-expanded={expandido}
            aria-label={expandido ? 'Recolher detalhes' : 'Expandir detalhes'}
            className="mt-0.5 shrink-0 text-muted-foreground"
          >
            {expandido ? '▾' : '▸'}
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{controle.codigo}</span>
              {controle.status === 'provisorio' && (
                <span
                  title="Conteúdo regulatório provisório — apoio à decisão, ainda sem revisão humana formal. Não é entregável ao cliente sem validação."
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <Info className="size-3" aria-hidden="true" />
                  Provisório
                </span>
              )}
            </div>
            <p className="text-sm text-foreground">{controle.descricao}</p>
          </div>
        </div>
      </div>

      <SegmentoStatus ativo={statusOtimista} onSelecionar={marcar} desabilitado={mutation.isPending} />
      {erro && <p className="text-xs font-medium text-status-critico">{erro}</p>}

      {expandido && (
        <div className="mt-1 flex flex-col gap-2 rounded-md border border-border bg-background p-3">
          <label htmlFor={`evidencia-${controle.id}`} className="text-xs text-muted-foreground">
            Evidência
          </label>
          <textarea
            id={`evidencia-${controle.id}`}
            value={evidencia}
            onChange={(e) => setEvidencia(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={salvarEvidencia}
              disabled={!rascunhoSujo || mutation.isPending || !statusOtimista}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              Salvar evidência
            </button>
            {!statusOtimista && (
              <span className="text-xs text-muted-foreground">Marque um estado antes de salvar.</span>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

interface SegmentoStatusProps {
  ativo: StatusAvaliacao | null
  onSelecionar: (status: StatusAvaliacao) => void
  desabilitado: boolean
}

// role="radiogroup" com navegação por seta — marcar 28 linhas em série
// rende bem com teclado (revisão do plano).
function SegmentoStatus({ ativo, onSelecionar, desabilitado }: SegmentoStatusProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function irPara(indice: number) {
    const status = ORDEM_STATUS_AVALIACAO[indice]
    refs.current[indice]?.focus()
    onSelecionar(status)
  }

  return (
    <div role="radiogroup" aria-label="Estado do controle" className="flex flex-wrap gap-1.5">
      {ORDEM_STATUS_AVALIACAO.map((status, indice) => {
        const selecionado = ativo === status
        const tom = tomPorStatusAvaliacao(status)
        const podeReceberFoco = selecionado || (ativo === null && indice === 0)
        return (
          <button
            key={status}
            ref={(el) => {
              refs.current[indice] = el
            }}
            type="button"
            role="radio"
            aria-checked={selecionado}
            tabIndex={podeReceberFoco ? 0 : -1}
            disabled={desabilitado}
            onClick={() => onSelecionar(status)}
            onKeyDown={(e) => {
              const total = ORDEM_STATUS_AVALIACAO.length
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault()
                irPara((indice + 1) % total)
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault()
                irPara((indice - 1 + total) % total)
              } else if (e.key === 'Home') {
                e.preventDefault()
                irPara(0)
              } else if (e.key === 'End') {
                e.preventDefault()
                irPara(total - 1)
              }
            }}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              selecionado
                ? STATUS_CONFIG[tom].badge
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            {STATUS_AVALIACAO_LABEL[status]}
          </button>
        )
      })}
    </div>
  )
}
