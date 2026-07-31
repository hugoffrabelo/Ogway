'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/shared'

export interface ColunaEntidade<T> {
  cabecalho: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface EntidadeListaProps<T> {
  itens: T[]
  colunas: ColunaEntidade<T>[]
  chave: (item: T) => string | number
  onNovo?: () => void
  novoLabel?: string
  filtrar?: (item: T, busca: string) => boolean
  buscaPlaceholder?: string
  emptyTitulo?: string
  emptyDescricao?: string
  porPagina?: number
}

// §4.4 da doc de frontend — tabela com busca, paginação e ação de
// criar. Paginação é client-side de propósito: os endpoints tenant-
// scoped do backend (/api/ropa/atividades/ etc.) não têm paginação
// configurada, e o volume por cliente não justifica pedir isso agora.
export function EntidadeLista<T>({
  itens,
  colunas,
  chave,
  onNovo,
  novoLabel = '+ Novo',
  filtrar,
  buscaPlaceholder = 'Buscar…',
  emptyTitulo = 'Nada cadastrado ainda',
  emptyDescricao,
  porPagina = 20,
}: EntidadeListaProps<T>) {
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    if (!filtrar || !busca.trim()) return itens
    return itens.filter((item) => filtrar(item, busca.trim().toLowerCase()))
  }, [itens, busca, filtrar])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtrados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {filtrar ? (
          <input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setPagina(1)
            }}
            placeholder={buscaPlaceholder}
            className="w-full max-w-xs rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        ) : (
          <span />
        )}
        {onNovo && (
          <button
            type="button"
            onClick={onNovo}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            {novoLabel}
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState titulo={emptyTitulo} descricao={emptyDescricao} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  {colunas.map((col) => (
                    <th key={col.cabecalho} className={`px-3 py-2 font-medium ${col.className ?? ''}`}>
                      {col.cabecalho}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiveis.map((item) => (
                  <tr key={chave(item)} className="border-b border-border last:border-0">
                    {colunas.map((col) => (
                      <td key={col.cabecalho} className={`px-3 py-2 text-foreground ${col.className ?? ''}`}>
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Página {paginaAtual} de {totalPaginas} · {filtrados.length} registro
                {filtrados.length === 1 ? '' : 's'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="rounded border border-border px-2 py-1 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="rounded border border-border px-2 py-1 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
