'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrganizacoes, registrarSolicitacao } from '@/lib/cockpit/api'
import { labelTipoDireito } from '@/lib/cockpit/labels'
import type { SolicitacaoTitular } from '@/lib/cockpit/types'

interface NovaSolicitacaoFormProps {
  onCancel: () => void
  onCriada: () => void
}

const TIPOS_DIREITO: SolicitacaoTitular['tipo_direito'][] = [
  'acesso',
  'confirmacao',
  'correcao',
  'eliminacao',
  'portabilidade',
  'oposicao',
  'informacao_compartilhamento',
  'revogacao',
]

// Uso pontual: quando a solicitação chega por telefone/e-mail direto ao
// time (o canal público automatizado ainda não existe — Fase D).
export function NovaSolicitacaoForm({ onCancel, onCriada }: NovaSolicitacaoFormProps) {
  const { data: orgs, status: orgsStatus } = useQuery({
    queryKey: ['cockpit', 'organizacoes'],
    queryFn: fetchOrganizacoes,
  })
  const queryClient = useQueryClient()

  const [org, setOrg] = useState('')
  const [tipoDireito, setTipoDireito] = useState<SolicitacaoTitular['tipo_direito'] | ''>('')
  const [recebidaEm, setRecebidaEm] = useState('')
  const [conteudo, setConteudo] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      registrarSolicitacao({
        org: Number(org),
        tipo_direito: tipoDireito as SolicitacaoTitular['tipo_direito'],
        recebida_em: recebidaEm,
        conteudo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit', 'solicitacoes'] })
      onCriada()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <div>
        <label htmlFor="nova-sol-org" className="block text-xs text-muted-foreground">
          Cliente
        </label>
        <select
          id="nova-sol-org"
          required
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            {orgsStatus === 'pending' ? 'Carregando…' : 'Selecione'}
          </option>
          {orgs?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.razao_social}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="nova-sol-tipo" className="block text-xs text-muted-foreground">
          Direito solicitado (Art. 18 LGPD)
        </label>
        <select
          id="nova-sol-tipo"
          required
          value={tipoDireito}
          onChange={(e) => setTipoDireito(e.target.value as SolicitacaoTitular['tipo_direito'])}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>
            Selecione
          </option>
          {TIPOS_DIREITO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {labelTipoDireito(tipo)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="nova-sol-data" className="block text-xs text-muted-foreground">
          Recebida em
        </label>
        <input
          id="nova-sol-data"
          type="datetime-local"
          required
          value={recebidaEm}
          onChange={(e) => setRecebidaEm(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="nova-sol-conteudo" className="block text-xs text-muted-foreground">
          Conteúdo da solicitação (ilha sensível — cifrado em repouso)
        </label>
        <textarea
          id="nova-sol-conteudo"
          required
          rows={3}
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Registrar solicitação
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-muted-foreground underline underline-offset-4"
        >
          Cancelar
        </button>
      </div>
      {mutation.isError && (
        <p className="text-xs font-medium text-status-critico">{(mutation.error as Error).message}</p>
      )}
    </form>
  )
}
