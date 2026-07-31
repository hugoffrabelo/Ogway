'use client'

import { useMemo } from 'react'
import dagre from 'dagre'
import { useQuery } from '@tanstack/react-query'
import { fetchMapaLinhagem } from '@/lib/portal/api'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'
import type { MapaLinhagem } from '@/lib/portal/types'

const NODE_HEIGHT = 44

// docs/frontend-cockpit-portal.md §4.3 — DFD via dagre, só-leitura. O
// grafo (nós/arestas) já vem pronto de apps/linhagem/services.mapa —
// aqui só rodamos o auto-layout e desenhamos o SVG.
function calcularLayout(mapa: MapaLinhagem) {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: 20, ranksep: 56, marginx: 16, marginy: 16 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const [id, no] of Object.entries(mapa.nos)) {
    const largura = Math.max(140, no.nome.length * 7 + 32)
    g.setNode(id, { width: largura, height: NODE_HEIGHT, label: no.nome })
  }
  for (const aresta of mapa.arestas) {
    g.setEdge(aresta.origem, aresta.destino)
  }

  dagre.layout(g)
  return g
}

const COR_POR_TIPO: Record<string, string> = {
  FonteColeta: 'var(--accent)',
  Repositorio: 'var(--primary)',
  Operador: 'var(--secondary-foreground)',
}

interface DiagramaDFDProps {
  org?: number
}

export function DiagramaDFD({ org }: DiagramaDFDProps = {}) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'linhagem-mapa', org ?? null],
    queryFn: () => fetchMapaLinhagem(org),
  })

  const layout = useMemo(() => (data ? calcularLayout(data) : null), [data])

  if (status === 'pending') return <LoadingState label="Carregando fluxo de dados…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }
  if (!layout || Object.keys(data.nos).length === 0) {
    return (
      <EmptyState
        titulo="Nenhum fluxo de dado mapeado"
        descricao="O fluxo de dados (de onde vem, onde fica, pra onde vai) ainda não foi registrado."
      />
    )
  }

  const graph = layout.graph()
  const width = graph.width ?? 0
  const height = graph.height ?? 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendaItem cor="var(--accent)" label="Fonte de coleta" />
        <LegendaItem cor="var(--primary)" label="Repositório" />
        <LegendaItem cor="var(--secondary-foreground)" label="Operador" />
        <span>— • — aresta tracejada = dado sensível ou transferência internacional</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card p-4">
        <svg width={width} height={height} className="min-w-full">
          <defs>
            <marker
              id="seta-dfd"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {layout.edges().map((e) => {
            const edge = layout.edge(e)
            const arestaOriginal = data.arestas.find(
              (a) => a.origem === e.v && a.destino === e.w
            )
            const destaque = arestaOriginal?.sensivel || arestaOriginal?.internacional
            const points = edge.points.map((p) => `${p.x},${p.y}`).join(' ')
            return (
              <polyline
                key={`${e.v}->${e.w}`}
                points={points}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray={destaque ? '4 3' : undefined}
                markerEnd="url(#seta-dfd)"
              />
            )
          })}

          {layout.nodes().map((id) => {
            const node = layout.node(id)
            const meta = data.nos[id]
            const cor = COR_POR_TIPO[meta.tipo] ?? 'var(--border)'
            return (
              <g key={id} transform={`translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`}>
                <rect
                  width={node.width}
                  height={node.height}
                  rx={6}
                  fill="var(--card)"
                  stroke={meta.sem_dpa ? 'var(--status-critico)' : cor}
                  strokeWidth={meta.sem_dpa ? 2 : 1.5}
                />
                <text
                  x={node.width / 2}
                  y={node.height / 2 - (meta.sem_dpa ? 6 : 0)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--foreground)"
                >
                  {node.label}
                </text>
                {meta.sem_dpa && (
                  <text
                    x={node.width / 2}
                    y={node.height / 2 + 12}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill="var(--status-critico)"
                  >
                    sem DPA assinado
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function LegendaItem({ cor, label }: { cor: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block size-2.5 rounded-full border" style={{ borderColor: cor }} />
      {label}
    </span>
  )
}
