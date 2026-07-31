'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { excluirAtividade, fetchAtividades } from '@/lib/ropa/api'
import type { AtividadeTratamento } from '@/lib/ropa/types'
import { EntidadeLista, type ColunaEntidade } from '@/components/forms/entidade-lista'
import { ConfirmacaoDestrutiva } from '@/components/forms/confirmacao-destrutiva'
import { ErrorState, LoadingState, StatusBadge } from '@/components/shared'
import { AtividadeForm } from './atividade-form'

interface AtividadeListaProps {
  org: number
}

const NIVEL_TOM = { baixo: 'ok', medio: 'atencao', alto: 'critico' } as const
const NIVEL_LABEL = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto' } as const

export function AtividadeLista({ org }: AtividadeListaProps) {
  const queryClient = useQueryClient()
  const { data, status, error, refetch } = useQuery({
    queryKey: ['ropa', 'atividades', org],
    queryFn: () => fetchAtividades(org),
  })
  const [editando, setEditando] = useState<AtividadeTratamento | 'novo' | null>(null)

  const exclusao = useMutation({
    mutationFn: (id: number) => excluirAtividade(id, org),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ropa', 'atividades', org] }),
  })

  if (status === 'pending') return <LoadingState label="Carregando atividades de tratamento…" />
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
      <AtividadeForm
        org={org}
        atividade={editando === 'novo' ? undefined : editando}
        onSalvo={() => setEditando(null)}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  const colunas: ColunaEntidade<AtividadeTratamento>[] = [
    { cabecalho: 'Nome', render: (a) => a.nome },
    { cabecalho: 'Retenção', render: (a) => a.retencao },
    {
      cabecalho: 'Risco',
      render: (a) => <StatusBadge status={NIVEL_TOM[a.nivel_risco]} label={NIVEL_LABEL[a.nivel_risco]} />,
    },
    {
      cabecalho: 'Status',
      render: (a) =>
        a.ativo ? (
          <StatusBadge status="ok" label="Ativa" />
        ) : (
          <StatusBadge status="neutro" label="Inativa" />
        ),
    },
    {
      cabecalho: '',
      className: 'text-right',
      render: (a) => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditando(a)}
            className="text-xs font-medium text-primary underline underline-offset-4"
          >
            Editar
          </button>
          <ConfirmacaoDestrutiva
            titulo={`Excluir "${a.nome}"?`}
            descricao="Essa ação não pode ser desfeita. Riscos e fluxos de dados vinculados a esta atividade ficam sem referência."
            onConfirmar={() => exclusao.mutate(a.id)}
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
      chave={(a) => a.id}
      onNovo={() => setEditando('novo')}
      novoLabel="+ Nova atividade"
      filtrar={(a, busca) => a.nome.toLowerCase().includes(busca)}
      buscaPlaceholder="Buscar atividade de tratamento…"
      emptyTitulo="Nenhuma atividade de tratamento cadastrada"
      emptyDescricao="AtividadeTratamento é o hub do RoPA — sem isso, incidentes e riscos não têm o que referenciar."
    />
  )
}
