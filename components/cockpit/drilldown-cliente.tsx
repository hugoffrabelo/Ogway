'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchIncidentesCockpit, fetchOrganizacoes, fetchSolicitacoesCockpit } from '@/lib/cockpit/api'
import type { IncidenteCockpit, SolicitacaoTitularCockpit } from '@/lib/cockpit/types'
import { EmptyState } from '@/components/shared'
import { DashboardConformidade } from '@/components/portal/dashboard-conformidade'
import { MatrizRiscoRaci } from '@/components/portal/matriz-risco-raci'
import { RepositorioDocumentos } from '@/components/portal/repositorio-documentos'
import { DiagramaDFD } from '@/components/portal/diagrama-dfd'
import { DiagramaBPMN } from '@/components/portal/diagrama-bpmn'
import { IncidenteRow } from './incidente-row'
import { SolicitacaoRow } from './solicitacao-row'

// docs/frontend-cockpit-portal.md §4.2 — "tudo de um org_id: espelha o
// que o cliente vê no portal, mais a camada de trabalho." Reaproveita os
// componentes do portal (agora com `org` opcional) e as linhas de
// incidente/solicitação já construídas — filtradas pro cliente escolhido,
// usando as mesmas queries ['cockpit','incidentes']/['cockpit','solicitacoes']
// que a FilaPorPrazo/PainelIncidente/PainelSolicitacao já populam (mesmo
// cache, sem refetch se o usuário já visitou essas seções).
//
// De propósito NÃO reaproveita PendenteDecisao: "aceitar risco" é
// decisão do cliente (RACI, CLAUDE.md) — aqui é só leitura, via
// MatrizRiscoRaci.
export function DrilldownCliente() {
  const { data: orgs, status: orgsStatus } = useQuery({
    queryKey: ['cockpit', 'organizacoes'],
    queryFn: fetchOrganizacoes,
  })
  const [orgId, setOrgId] = useState<number | null>(null)

  const { data: incidentes } = useQuery({
    queryKey: ['cockpit', 'incidentes'],
    queryFn: fetchIncidentesCockpit,
    enabled: orgId !== null,
  })
  const { data: solicitacoes } = useQuery({
    queryKey: ['cockpit', 'solicitacoes'],
    queryFn: fetchSolicitacoesCockpit,
    enabled: orgId !== null,
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="drilldown-org" className="block text-xs text-muted-foreground">
          Cliente
        </label>
        <select
          id="drilldown-org"
          value={orgId ?? ''}
          onChange={(e) => setOrgId(e.target.value ? Number(e.target.value) : null)}
          className="mt-1 w-full max-w-sm rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">{orgsStatus === 'pending' ? 'Carregando…' : 'Selecione um cliente'}</option>
          {orgs?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.razao_social}
            </option>
          ))}
        </select>
      </div>

      {orgId === null ? (
        <EmptyState
          titulo="Escolha um cliente"
          descricao="Selecione um cliente acima para ver tudo sobre ele: conformidade, riscos, documentos, diagramas e a fila de trabalho."
        />
      ) : (
        <DrilldownConteudo
          orgId={orgId}
          incidentes={incidentes?.filter((i) => i.org === orgId) ?? []}
          solicitacoes={solicitacoes?.filter((s) => s.org === orgId) ?? []}
        />
      )}
    </div>
  )
}

function DrilldownConteudo({
  orgId,
  incidentes,
  solicitacoes,
}: {
  orgId: number
  incidentes: IncidenteCockpit[]
  solicitacoes: SolicitacaoTitularCockpit[]
}) {
  return (
    <div className="flex flex-col gap-8">
      <Secao titulo="Conformidade">
        <DashboardConformidade org={orgId} />
      </Secao>

      <Secao titulo="Matriz de risco (RACI)">
        <MatrizRiscoRaci org={orgId} />
      </Secao>

      <Secao titulo="Documentos">
        <RepositorioDocumentos org={orgId} />
      </Secao>

      <Secao titulo="Fluxo de dados (DFD)">
        <DiagramaDFD org={orgId} />
      </Secao>

      <Secao titulo="Diagrama de processo (BPMN)">
        <DiagramaBPMN org={orgId} />
      </Secao>

      <Secao titulo="Incidentes — camada de trabalho">
        {incidentes.length === 0 ? (
          <EmptyState titulo="Nenhum incidente deste cliente" />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {incidentes.map((i) => (
              <IncidenteRow key={i.id} incidente={i} />
            ))}
          </ul>
        )}
      </Secao>

      <Secao titulo="Solicitações de titulares — camada de trabalho">
        {solicitacoes.length === 0 ? (
          <EmptyState titulo="Nenhuma solicitação deste cliente" />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {solicitacoes.map((s) => (
              <SolicitacaoRow key={s.id} solicitacao={s} />
            ))}
          </ul>
        )}
      </Secao>
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-medium text-muted-foreground">{titulo}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}
