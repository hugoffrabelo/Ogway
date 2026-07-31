'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchDocumentosPublicados } from '@/lib/portal/api'
import { API_URL } from '@/lib/api-url'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'

interface RepositorioDocumentosProps {
  org?: number
}

// docs/frontend-cockpit-portal.md §4.3 — "lista de documentos
// publicados, com download." Filtro de estado='publicado' só se aplica
// a cliente_leitor (DocumentoViewSet.get_queryset) — no DrilldownCliente
// do cockpit (com `org`), o encarregado vê todos os estados, por isso o
// rótulo de estado só aparece quando `org` está presente.
export function RepositorioDocumentos({ org }: RepositorioDocumentosProps = {}) {
  const { data, status, error, refetch } = useQuery({
    queryKey: ['portal', 'documentos', org ?? null],
    queryFn: () => fetchDocumentosPublicados(org),
  })

  if (status === 'pending') return <LoadingState label="Carregando documentos…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }
  if (data.length === 0) {
    return <EmptyState titulo="Nenhum documento publicado ainda" />
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {data.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {doc.titulo}
              {org && <span className="ml-2 text-xs text-muted-foreground">({doc.estado})</span>}
            </p>
            <p className="text-xs text-muted-foreground">v{doc.versao}</p>
          </div>
          {doc.arquivo ? (
            <a
              href={doc.arquivo.startsWith('http') ? doc.arquivo : `${API_URL}${doc.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary underline underline-offset-4"
            >
              Baixar
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">Sem arquivo</span>
          )}
        </li>
      ))}
    </ul>
  )
}
