'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { fetchIncidentesCockpit, fetchSolicitacoesCockpit } from '@/lib/cockpit/api'
import type { IncidenteCockpit, SolicitacaoTitularCockpit } from '@/lib/cockpit/types'
import { useOrgAtivo } from '@/lib/cockpit/org-context'
import { EmptyState } from '@/components/shared'
import { DashboardConformidade } from '@/components/portal/dashboard-conformidade'
import { MatrizRiscoRaci } from '@/components/portal/matriz-risco-raci'
import { RepositorioDocumentos } from '@/components/portal/repositorio-documentos'
import { DiagramaDFD } from '@/components/portal/diagrama-dfd'
import { DiagramaBPMN } from '@/components/portal/diagrama-bpmn'
import { IncidenteRow } from './incidente-row'
import { SolicitacaoRow } from './solicitacao-row'

// docs/frontend-cockpit-portal.md §4.2 — "tudo de um org_id: espelha o
// que o cliente vê no portal, mais a camada de trabalho." O cliente
// ativo vem do OrgContext (layout de /cockpit/cliente, §7.2) — não é
// mais estado local desta página, então sobrevive à navegação entre
// "visão geral" e "RoPA".
//
// De propósito NÃO reaproveita PendenteDecisao: "aceitar risco" é
// decisão do cliente (RACI, CLAUDE.md) — aqui é só leitura, via
// MatrizRiscoRaci.
export function DrilldownCliente() {
  const { orgAtivo } = useOrgAtivo()

  const { data: incidentes } = useQuery({
    queryKey: ['cockpit', 'incidentes'],
    queryFn: fetchIncidentesCockpit,
    enabled: orgAtivo !== null,
  })
  const { data: solicitacoes } = useQuery({
    queryKey: ['cockpit', 'solicitacoes'],
    queryFn: fetchSolicitacoesCockpit,
    enabled: orgAtivo !== null,
  })

  if (orgAtivo === null) {
    return (
      <EmptyState
        titulo="Escolha um cliente"
        descricao="Selecione um cliente no seletor acima para ver tudo sobre ele: conformidade, riscos, documentos, diagramas, RoPA e a fila de trabalho."
      />
    )
  }

  return (
    <DrilldownConteudo
      orgId={orgAtivo.id}
      incidentes={incidentes?.filter((i) => i.org === orgAtivo.id) ?? []}
      solicitacoes={solicitacoes?.filter((s) => s.org === orgAtivo.id) ?? []}
    />
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
      <div className="flex flex-wrap gap-4">
        <Link
          href="/cockpit/cliente/ropa"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Gerenciar RoPA deste cliente →
        </Link>
        <Link
          href="/cockpit/cliente/frameworks"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Avaliar controles (SoA) →
        </Link>
      </div>

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
