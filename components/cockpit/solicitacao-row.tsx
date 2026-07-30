'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  lerConteudoSolicitacao,
  responderSolicitacao,
  triarSolicitacao,
} from '@/lib/cockpit/api'
import { labelStatusSolicitacao, labelTipoDireito } from '@/lib/cockpit/labels'
import type { SolicitacaoTitularCockpit } from '@/lib/cockpit/types'
import { ClienteTag, PrazoBadge } from '@/components/shared'

interface SolicitacaoRowProps {
  solicitacao: SolicitacaoTitularCockpit
}

export function SolicitacaoRow({ solicitacao }: SolicitacaoRowProps) {
  const queryClient = useQueryClient()
  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ['cockpit', 'solicitacoes'] })
    queryClient.invalidateQueries({ queryKey: ['cockpit', 'fila-hoje'] })
  }

  const emAndamento = solicitacao.status === 'recebida' || solicitacao.status === 'em_analise'

  return (
    <li className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ClienteTag nome={solicitacao.org_nome} />
          <span className="text-sm text-foreground">
            Solicitação #{solicitacao.id} — {labelTipoDireito(solicitacao.tipo_direito)} ·{' '}
            {labelStatusSolicitacao(solicitacao.status)}
          </span>
        </div>
        {solicitacao.dias_uteis_prazo_sla !== null && emAndamento && (
          <PrazoBadge diasUteisRestantes={solicitacao.dias_uteis_prazo_sla} />
        )}
      </div>

      {solicitacao.eliminacao_bloqueada_por_retencao && (
        <p className="text-xs font-medium text-status-atencao">
          Eliminação bloqueada por obrigação de retenção legal.
        </p>
      )}

      <VerConteudoToggle id={solicitacao.id} org={solicitacao.org} />

      {solicitacao.prazo_sla === null ? (
        <TriagemForm id={solicitacao.id} org={solicitacao.org} onDone={invalidar} />
      ) : emAndamento ? (
        <ResponderForm id={solicitacao.id} org={solicitacao.org} onDone={invalidar} />
      ) : (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Resposta: </span>
          {solicitacao.resposta || '—'}
        </p>
      )}
    </li>
  )
}

function ErroAcao({ mensagem }: { mensagem: string }) {
  return <p className="text-xs font-medium text-status-critico">{mensagem}</p>
}

// Ilha sensível: revela o conteúdo cifrado sob demanda, nunca por
// padrão. Cada clique gera log de auditoria no backend
// (SolicitacaoTitular.ler_conteudo); o texto some do estado ao esconder,
// não fica cacheado além disso.
function VerConteudoToggle({ id, org }: { id: number; org: number }) {
  const [conteudo, setConteudo] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: () => lerConteudoSolicitacao(id, org),
    onSuccess: (data) => setConteudo(data.conteudo),
  })

  if (conteudo !== null) {
    return (
      <div className="rounded-md border border-status-atencao/30 bg-status-atencao/5 p-2">
        <p className="text-xs font-medium text-status-atencao">Conteúdo sensível (ilha sensível)</p>
        <p className="mt-1 text-sm text-foreground">{conteudo}</p>
        <button
          type="button"
          onClick={() => setConteudo(null)}
          className="mt-1 text-xs text-muted-foreground underline underline-offset-4"
        >
          Esconder
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60"
      >
        Ver conteúdo
      </button>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </div>
  )
}

function TriagemForm({
  id,
  org,
  onDone,
}: {
  id: number
  org: number
  onDone: () => void
}) {
  const [prazo, setPrazo] = useState('')
  const mutation = useMutation({
    mutationFn: () => triarSolicitacao(id, org, prazo),
    onSuccess: onDone,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <div>
        <label htmlFor={`prazo-${id}`} className="block text-xs text-muted-foreground">
          Prazo de resposta (triagem)
        </label>
        <input
          id={`prazo-${id}`}
          type="date"
          required
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="mt-1 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
      >
        Iniciar triagem
      </button>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </form>
  )
}

function ResponderForm({
  id,
  org,
  onDone,
}: {
  id: number
  org: number
  onDone: () => void
}) {
  const [resposta, setResposta] = useState('')
  const [acaoPendente, setAcaoPendente] = useState<'respondida' | 'negada' | null>(null)
  const mutation = useMutation({
    mutationFn: (status: 'respondida' | 'negada') => responderSolicitacao(id, org, resposta, status),
    onSuccess: onDone,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (acaoPendente) mutation.mutate(acaoPendente)
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        required
        placeholder="Resposta ao titular"
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          onClick={() => setAcaoPendente('respondida')}
          disabled={mutation.isPending || !resposta.trim()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Responder
        </button>
        <button
          type="submit"
          onClick={() => setAcaoPendente('negada')}
          disabled={mutation.isPending || !resposta.trim()}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground disabled:opacity-60"
        >
          Negar
        </button>
      </div>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </form>
  )
}
