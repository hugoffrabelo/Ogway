'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import { fetchDiagramasProcesso } from '@/lib/portal/api'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'

// docs/frontend-cockpit-portal.md §4.3 — BPMN via bpmn-js, só-leitura
// (NavigatedViewer: pan/zoom, sem edição — a autoria não é front-end,
// ver apps/processos/models.py DiagramaProcesso).
interface DiagramaBPMNProps {
  org?: number
}

export function DiagramaBPMN({ org }: DiagramaBPMNProps = {}) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'diagramas-processo', org ?? null],
    queryFn: () => fetchDiagramasProcesso(org),
  })
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null)

  if (status === 'pending') return <LoadingState label="Carregando diagramas de processo…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }
  if (data.length === 0) {
    return <EmptyState titulo="Nenhum diagrama de processo publicado ainda" />
  }

  const selecionado = data.find((d) => d.id === selecionadoId) ?? data[0]

  return (
    <div className="flex flex-col gap-3">
      {data.length > 1 && (
        <select
          value={selecionado.id}
          onChange={(e) => setSelecionadoId(Number(e.target.value))}
          className="w-fit rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {data.map((d) => (
            <option key={d.id} value={d.id}>
              {d.titulo} v{d.versao}
            </option>
          ))}
        </select>
      )}
      <BpmnCanvas key={selecionado.id} xml={selecionado.xml_bpmn} />
    </div>
  )
}

function BpmnCanvas({ xml }: { xml: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<NavigatedViewer | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const viewer = new NavigatedViewer({ container: containerRef.current })
    viewerRef.current = viewer
    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return
    setErro(null)
    viewer
      .importXML(xml)
      .then(() => {
        const canvas = viewer.get<{ zoom: (mode: string) => void }>('canvas')
        canvas.zoom('fit-viewport')
      })
      .catch((err: Error) => {
        setErro(`Não foi possível renderizar o diagrama: ${err.message}`)
      })
  }, [xml])

  return (
    <div className="flex flex-col gap-2">
      {erro && <p className="text-xs font-medium text-status-critico">{erro}</p>}
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-lg border border-border bg-card"
      />
    </div>
  )
}
