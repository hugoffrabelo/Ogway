'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { excluirOperador, fetchOperadores } from '@/lib/ropa/api'
import type { Operador } from '@/lib/ropa/types'
import { EntidadeLista, type ColunaEntidade } from '@/components/forms/entidade-lista'
import { ConfirmacaoDestrutiva } from '@/components/forms/confirmacao-destrutiva'
import { ErrorState, LoadingState, StatusBadge } from '@/components/shared'
import { OperadorForm } from './operador-form'

interface OperadorListaProps {
  org: number
}

export function OperadorLista({ org }: OperadorListaProps) {
  const queryClient = useQueryClient()
  const { data, status, error, refetch } = useQuery({
    queryKey: ['ropa', 'operadores', org],
    queryFn: () => fetchOperadores(org),
  })
  const [editando, setEditando] = useState<Operador | 'novo' | null>(null)

  const exclusao = useMutation({
    mutationFn: (id: number) => excluirOperador(id, org),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ropa', 'operadores', org] }),
  })

  if (status === 'pending') return <LoadingState label="Carregando operadores…" />
  if (status === 'error') {
    return (
      <ErrorState
        descricao={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  if (editando) {
    return (
      <OperadorForm
        org={org}
        operador={editando === 'novo' ? undefined : editando}
        onSalvo={() => setEditando(null)}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  const colunas: ColunaEntidade<Operador>[] = [
    { cabecalho: 'Nome', render: (o) => o.nome },
    { cabecalho: 'Serviço', render: (o) => o.servico || '—' },
    {
      cabecalho: 'DPA',
      render: (o) =>
        o.dpa_assinado ? (
          <StatusBadge status="ok" label="Assinado" />
        ) : (
          <StatusBadge status="critico" label="Sem DPA" />
        ),
    },
    { cabecalho: 'Risco', render: (o) => o.nivel_risco },
    {
      cabecalho: '',
      className: 'text-right',
      render: (o) => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditando(o)}
            className="text-xs font-medium text-primary underline underline-offset-4"
          >
            Editar
          </button>
          <ConfirmacaoDestrutiva
            titulo={`Excluir "${o.nome}"?`}
            descricao="Essa ação não pode ser desfeita. Atividades de tratamento que referenciam este operador precisam ser revisadas."
            onConfirmar={() => exclusao.mutate(o.id)}
            confirmando={exclusao.isPending}
            trigger="Excluir"
          />
        </div>
      ),
    },
  ]

  return (
    <EntidadeLista
      itens={data}
      colunas={colunas}
      chave={(o) => o.id}
      onNovo={() => setEditando('novo')}
      novoLabel="+ Novo operador"
      filtrar={(o, busca) => o.nome.toLowerCase().includes(busca)}
      buscaPlaceholder="Buscar operador…"
      emptyTitulo="Nenhum operador cadastrado"
      emptyDescricao="Operadores são terceiros que tratam dados em nome deste cliente."
    />
  )
}
