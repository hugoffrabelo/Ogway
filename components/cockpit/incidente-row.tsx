'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  avaliarRisco,
  avancarComplementando,
  comunicarAnpd,
  comunicarTitular,
  confirmarMarco,
  encerrarIncidente,
} from '@/lib/cockpit/api'
import { labelEtapa } from '@/lib/cockpit/labels'
import type { IncidenteCockpit } from '@/lib/cockpit/types'
import { ClienteTag, PrazoBadge } from '@/components/shared'
import { cn } from '@/lib/utils'

interface IncidenteRowProps {
  incidente: IncidenteCockpit
}

// Cada bloco de ação abaixo corresponde 1:1 a uma guarda de
// apps/incidentes/maquina_estados.py — a UI só oferece a ação válida
// para a etapa atual; a validação de verdade continua no backend.
export function IncidenteRow({ incidente }: IncidenteRowProps) {
  const queryClient = useQueryClient()
  const invalidar = () => {
    queryClient.invalidateQueries({ queryKey: ['cockpit', 'incidentes'] })
    queryClient.invalidateQueries({ queryKey: ['cockpit', 'fila-hoje'] })
  }

  return (
    <li className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <ClienteTag nome={incidente.org_nome} />
          <span className="text-sm text-foreground">
            Incidente #{incidente.id} — {labelEtapa(incidente.etapa)}
          </span>
        </div>
        {incidente.etapa === 'comunicando' && incidente.dias_uteis_prazo_complementacao !== null && (
          <PrazoBadge diasUteisRestantes={incidente.dias_uteis_prazo_complementacao} />
        )}
        {incidente.etapa === 'complementando' && incidente.dias_uteis_prazo_complementacao !== null && (
          <PrazoBadge diasUteisRestantes={incidente.dias_uteis_prazo_complementacao} />
        )}
      </div>

      <p className="text-sm text-muted-foreground">{incidente.descricao}</p>

      {incidente.etapa === 'registrado' && (
        <ConfirmarMarcoForm incidenteId={incidente.id} org={incidente.org} onDone={invalidar} />
      )}
      {incidente.etapa === 'avaliando_risco' && (
        <AvaliarRiscoForm incidenteId={incidente.id} org={incidente.org} onDone={invalidar} />
      )}
      {incidente.etapa === 'comunicando' && (
        <AcoesComunicando incidente={incidente} onDone={invalidar} />
      )}
      {incidente.etapa === 'complementando' && (
        <EncerrarButton incidenteId={incidente.id} org={incidente.org} onDone={invalidar} />
      )}
    </li>
  )
}

function ErroAcao({ mensagem }: { mensagem: string }) {
  return <p className="text-xs font-medium text-status-critico">{mensagem}</p>
}

function ConfirmarMarcoForm({
  incidenteId,
  org,
  onDone,
}: {
  incidenteId: number
  org: number
  onDone: () => void
}) {
  const [data, setData] = useState('')
  const mutation = useMutation({
    mutationFn: () => confirmarMarco(incidenteId, org, data),
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
        <label htmlFor={`marco-${incidenteId}`} className="block text-xs text-muted-foreground">
          Data em que se confirmou que os dados foram afetados
        </label>
        <input
          id={`marco-${incidenteId}`}
          type="date"
          required
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="mt-1 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
      >
        Confirmar marco
      </button>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </form>
  )
}

function AvaliarRiscoForm({
  incidenteId,
  org,
  onDone,
}: {
  incidenteId: number
  org: number
  onDone: () => void
}) {
  const [riscoRelevante, setRiscoRelevante] = useState<boolean | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const mutation = useMutation({
    mutationFn: () => avaliarRisco(incidenteId, org, riscoRelevante!, justificativa),
    onSuccess: onDone,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-4 text-sm text-foreground">
        <span className="text-xs text-muted-foreground">Risco/dano relevante ao titular?</span>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name={`risco-${incidenteId}`}
            required
            checked={riscoRelevante === true}
            onChange={() => setRiscoRelevante(true)}
          />
          Sim — notificar
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name={`risco-${incidenteId}`}
            required
            checked={riscoRelevante === false}
            onChange={() => setRiscoRelevante(false)}
          />
          Não — não notificar
        </label>
      </div>
      <textarea
        required
        placeholder="Justificativa da avaliação (obrigatória nos dois ramos — prova de análise, não omissão)"
        value={justificativa}
        onChange={(e) => setJustificativa(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div>
        <button
          type="submit"
          disabled={mutation.isPending || riscoRelevante === null}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Registrar avaliação
        </button>
      </div>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </form>
  )
}

function AcoesComunicando({
  incidente,
  onDone,
}: {
  incidente: IncidenteCockpit
  onDone: () => void
}) {
  const anpdMutation = useMutation({
    mutationFn: () => comunicarAnpd(incidente.id, incidente.org),
    onSuccess: onDone,
  })
  const titularMutation = useMutation({
    mutationFn: () => comunicarTitular(incidente.id, incidente.org),
    onSuccess: onDone,
  })
  const avancarMutation = useMutation({
    mutationFn: () => avancarComplementando(incidente.id, incidente.org),
    onSuccess: onDone,
  })

  const anpdFeito = !!incidente.comunicacao_anpd
  const titularFeito = !!incidente.comunicacao_titular
  const podeAvancar = anpdFeito && titularFeito

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={anpdFeito || anpdMutation.isPending}
          onClick={() => anpdMutation.mutate()}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-60',
            anpdFeito
              ? 'border-status-ok/30 bg-status-ok/10 text-status-ok'
              : 'border-border bg-background text-foreground'
          )}
        >
          {anpdFeito ? '✓ ANPD notificada' : 'Registrar comunicação à ANPD'}
        </button>
        <button
          type="button"
          disabled={titularFeito || titularMutation.isPending}
          onClick={() => titularMutation.mutate()}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-60',
            titularFeito
              ? 'border-status-ok/30 bg-status-ok/10 text-status-ok'
              : 'border-border bg-background text-foreground'
          )}
        >
          {titularFeito ? '✓ Titular notificado' : 'Registrar comunicação ao titular'}
        </button>
      </div>
      <div>
        <button
          type="button"
          disabled={!podeAvancar || avancarMutation.isPending}
          onClick={() => avancarMutation.mutate()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Avançar para complementação
        </button>
      </div>
      {(anpdMutation.isError || titularMutation.isError || avancarMutation.isError) && (
        <ErroAcao
          mensagem={
            ((anpdMutation.error || titularMutation.error || avancarMutation.error) as Error)
              .message
          }
        />
      )}
    </div>
  )
}

function EncerrarButton({
  incidenteId,
  org,
  onDone,
}: {
  incidenteId: number
  org: number
  onDone: () => void
}) {
  const mutation = useMutation({
    mutationFn: () => encerrarIncidente(incidenteId, org),
    onSuccess: onDone,
  })

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          Encerrar incidente
        </button>
      </div>
      {mutation.isError && <ErroAcao mensagem={(mutation.error as Error).message} />}
    </div>
  )
}
