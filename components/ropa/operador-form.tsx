'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEntidadeSubmit } from '@/lib/forms/use-entidade-form'
import { operadorSchema, type OperadorFormValues } from '@/lib/ropa/schemas'
import { atualizarOperador, criarOperador } from '@/lib/ropa/api'
import type { Operador } from '@/lib/ropa/types'
import { CampoCheckbox, CampoSelect, CampoTexto } from '@/components/forms/campos'

const NIVEL_RISCO_OPCOES = [
  { valor: 'baixo', rotulo: 'Baixo' },
  { valor: 'medio', rotulo: 'Médio' },
  { valor: 'alto', rotulo: 'Alto' },
]

interface OperadorFormProps {
  org: number
  operador?: Operador
  onSalvo: () => void
  onCancelar: () => void
}

export function OperadorForm({ org, operador, onSalvo, onCancelar }: OperadorFormProps) {
  const queryClient = useQueryClient()
  const form = useForm<OperadorFormValues>({
    resolver: zodResolver(operadorSchema),
    defaultValues: operador
      ? {
          nome: operador.nome,
          servico: operador.servico,
          dpa_assinado: operador.dpa_assinado,
          dpa_vencimento: operador.dpa_vencimento ?? '',
          pais: operador.pais,
          nivel_risco: operador.nivel_risco,
        }
      : {
          nome: '',
          servico: '',
          dpa_assinado: false,
          dpa_vencimento: '',
          pais: 'BR',
          nivel_risco: undefined,
        },
  })
  const { enviar, erroGeral } = useEntidadeSubmit(form)

  const mutation = useMutation({
    mutationFn: (dados: OperadorFormValues) => {
      const payload = { ...dados, dpa_vencimento: dados.dpa_vencimento || null }
      return operador ? atualizarOperador(operador.id, org, payload) : criarOperador(org, payload)
    },
  })

  async function onSubmit(dados: OperadorFormValues) {
    const ok = await enviar(() => mutation.mutateAsync(dados))
    if (ok) {
      queryClient.invalidateQueries({ queryKey: ['ropa', 'operadores', org] })
      onSalvo()
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <CampoTexto label="Nome" registro={form.register('nome')} erro={form.formState.errors.nome?.message} />
      <CampoTexto
        label="Serviço prestado"
        registro={form.register('servico')}
        erro={form.formState.errors.servico?.message}
      />
      <CampoSelect
        label="Nível de risco"
        registro={form.register('nivel_risco')}
        opcoes={NIVEL_RISCO_OPCOES}
        erro={form.formState.errors.nivel_risco?.message}
      />
      <CampoCheckbox label="DPA assinado" registro={form.register('dpa_assinado')} />
      <CampoTexto
        label="Vencimento do DPA"
        type="date"
        registro={form.register('dpa_vencimento')}
        erro={form.formState.errors.dpa_vencimento?.message}
      />
      <CampoTexto
        label="País (código de 2 letras)"
        registro={form.register('pais')}
        erro={form.formState.errors.pais?.message}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          {operador ? 'Salvar' : 'Criar operador'}
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
