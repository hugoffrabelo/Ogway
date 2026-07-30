'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrganizacoes, registrarIncidente } from '@/lib/cockpit/api'

interface NovoIncidenteFormProps {
  onCancel: () => void
  onCriado: () => void
}

export function NovoIncidenteForm({ onCancel, onCriado }: NovoIncidenteFormProps) {
  const { data: orgs, status: orgsStatus } = useQuery({
    queryKey: ['cockpit', 'organizacoes'],
    queryFn: fetchOrganizacoes,
  })
  const queryClient = useQueryClient()

  const [org, setOrg] = useState('')
  const [detectadoEm, setDetectadoEm] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dadosAfetados, setDadosAfetados] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      registrarIncidente({
        org: Number(org),
        detectado_em: detectadoEm,
        descricao,
        dados_afetados: dadosAfetados || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cockpit', 'incidentes'] })
      onCriado()
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
        <label htmlFor="novo-inc-org" className="block text-xs text-muted-foreground">
          Cliente
        </label>
        <select
          id="novo-inc-org"
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
        <label htmlFor="novo-inc-data" className="block text-xs text-muted-foreground">
          Detectado em
        </label>
        <input
          id="novo-inc-data"
          type="datetime-local"
          required
          value={detectadoEm}
          onChange={(e) => setDetectadoEm(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="novo-inc-descricao" className="block text-xs text-muted-foreground">
          Descrição
        </label>
        <textarea
          id="novo-inc-descricao"
          required
          rows={3}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="novo-inc-dados" className="block text-xs text-muted-foreground">
          Dados afetados (opcional)
        </label>
        <textarea
          id="novo-inc-dados"
          rows={2}
          value={dadosAfetados}
          onChange={(e) => setDadosAfetados(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Registrar incidente
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
