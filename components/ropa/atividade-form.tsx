'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEntidadeSubmit } from '@/lib/forms/use-entidade-form'
import { atividadeSchema, type AtividadeFormValues } from '@/lib/ropa/schemas'
import {
  atualizarAtividade,
  criarAtividade,
  fetchBasesLegais,
  fetchCategoriasDados,
  fetchCategoriasTitulares,
  fetchOperadores,
} from '@/lib/ropa/api'
import type { AtividadeTratamento } from '@/lib/ropa/types'
import {
  CampoCheckbox,
  CampoMultiSelect,
  CampoSelect,
  CampoTexto,
  CampoTextarea,
} from '@/components/forms/campos'
import { ErrorState, LoadingState } from '@/components/shared'

const NIVEL_RISCO_OPCOES = [
  { valor: 'baixo', rotulo: 'Baixo' },
  { valor: 'medio', rotulo: 'Médio' },
  { valor: 'alto', rotulo: 'Alto' },
]

interface AtividadeFormProps {
  org: number
  atividade?: AtividadeTratamento
  onSalvo: () => void
  onCancelar: () => void
}

export function AtividadeForm({ org, atividade, onSalvo, onCancelar }: AtividadeFormProps) {
  const queryClient = useQueryClient()

  const basesLegais = useQuery({ queryKey: ['ropa', 'bases-legais'], queryFn: fetchBasesLegais })
  const categoriasDados = useQuery({
    queryKey: ['ropa', 'categorias-dados'],
    queryFn: fetchCategoriasDados,
  })
  const categoriasTitulares = useQuery({
    queryKey: ['ropa', 'categorias-titulares'],
    queryFn: fetchCategoriasTitulares,
  })
  const operadores = useQuery({
    queryKey: ['ropa', 'operadores', org],
    queryFn: () => fetchOperadores(org),
  })

  const form = useForm<AtividadeFormValues>({
    resolver: zodResolver(atividadeSchema),
    defaultValues: atividade
      ? {
          nome: atividade.nome,
          finalidade: atividade.finalidade,
          base_legal: String(atividade.base_legal),
          categorias_dados: atividade.categorias_dados.map(String),
          categorias_titulares: atividade.categorias_titulares.map(String),
          retencao: atividade.retencao,
          nivel_risco: atividade.nivel_risco,
          operadores: atividade.operadores.map(String),
          transferencia_internacional: atividade.transferencia_internacional,
          ativo: atividade.ativo,
        }
      : {
          nome: '',
          finalidade: '',
          base_legal: '',
          categorias_dados: [],
          categorias_titulares: [],
          retencao: '',
          nivel_risco: undefined,
          operadores: [],
          transferencia_internacional: false,
          ativo: true,
        },
  })
  const { enviar, erroGeral } = useEntidadeSubmit(form)

  const mutation = useMutation({
    mutationFn: (dados: AtividadeFormValues) => {
      const payload = {
        ...dados,
        base_legal: Number(dados.base_legal),
        categorias_dados: dados.categorias_dados.map(Number),
        categorias_titulares: dados.categorias_titulares.map(Number),
        operadores: dados.operadores.map(Number),
      }
      return atividade
        ? atualizarAtividade(atividade.id, org, payload)
        : criarAtividade(org, payload)
    },
  })

  async function onSubmit(dados: AtividadeFormValues) {
    const ok = await enviar(() => mutation.mutateAsync(dados))
    if (ok) {
      queryClient.invalidateQueries({ queryKey: ['ropa', 'atividades', org] })
      onSalvo()
    }
  }

  const carregandoOpcoes =
    basesLegais.status === 'pending' ||
    categoriasDados.status === 'pending' ||
    categoriasTitulares.status === 'pending' ||
    operadores.status === 'pending'
  const erroOpcoes =
    basesLegais.status === 'error' ||
    categoriasDados.status === 'error' ||
    categoriasTitulares.status === 'error' ||
    operadores.status === 'error'

  if (carregandoOpcoes) return <LoadingState label="Carregando opções…" />
  if (erroOpcoes) return <ErrorState descricao="Não foi possível carregar as opções do formulário." />

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <CampoTexto label="Nome" registro={form.register('nome')} erro={form.formState.errors.nome?.message} />
      <CampoTextarea
        label="Finalidade"
        registro={form.register('finalidade')}
        erro={form.formState.errors.finalidade?.message}
      />
      <CampoSelect
        label="Base legal"
        registro={form.register('base_legal')}
        opcoes={(basesLegais.data ?? []).map((b) => ({ valor: b.id, rotulo: `${b.tipo} (${b.artigo})` }))}
        erro={form.formState.errors.base_legal?.message}
      />
      <CampoMultiSelect
        label="Categorias de dados tratados"
        registro={form.register('categorias_dados')}
        opcoes={(categoriasDados.data ?? []).map((c) => ({
          valor: c.id,
          rotulo: c.sensivel ? `${c.nome} (sensível)` : c.nome,
        }))}
        erro={form.formState.errors.categorias_dados?.message}
      />
      <CampoMultiSelect
        label="Categorias de titulares"
        registro={form.register('categorias_titulares')}
        opcoes={(categoriasTitulares.data ?? []).map((c) => ({ valor: c.id, rotulo: c.nome }))}
        erro={form.formState.errors.categorias_titulares?.message}
      />
      <CampoTexto
        label="Retenção"
        placeholder="Ex.: 20 anos"
        registro={form.register('retencao')}
        erro={form.formState.errors.retencao?.message}
      />
      <CampoSelect
        label="Nível de risco"
        registro={form.register('nivel_risco')}
        opcoes={NIVEL_RISCO_OPCOES}
        erro={form.formState.errors.nivel_risco?.message}
      />
      <CampoMultiSelect
        label="Operadores envolvidos (opcional)"
        registro={form.register('operadores')}
        opcoes={(operadores.data ?? []).map((o) => ({ valor: o.id, rotulo: o.nome }))}
      />
      <CampoCheckbox
        label="Envolve transferência internacional de dados"
        registro={form.register('transferencia_internacional')}
      />
      <CampoCheckbox label="Atividade ativa" registro={form.register('ativo')} />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          {atividade ? 'Salvar' : 'Criar atividade'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="text-xs text-muted-foreground underline underline-offset-4"
        >
          Cancelar
        </button>
      </div>
      {erroGeral && <p className="text-xs font-medium text-status-critico">{erroGeral}</p>}
    </form>
  )
}
