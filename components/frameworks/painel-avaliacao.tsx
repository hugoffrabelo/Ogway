'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAvaliacoes, fetchControles, fetchFrameworks, fetchNota } from '@/lib/frameworks/api'
import { descricaoNota, GRAU_LABEL } from '@/lib/frameworks/labels'
import type { AvaliacaoControle, Controle, Perfil } from '@/lib/frameworks/types'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'
import { ControleAvaliacao } from './controle-avaliacao'

const PERFIS: Perfil[] = ['basico', 'intermediario', 'avancado']

interface PainelAvaliacaoProps {
  org: number
}

// docs/frontend-cockpit-portal.md §4.2 — ControleAvaliacao. Perfis são
// cumulativos (básico ⊂ intermediário ⊂ avançado) — trocar o perfil
// troca o corte de controles exibidos, calculado pelo backend
// (controles_do_perfil), nunca refeito aqui.
export function PainelAvaliacao({ org }: PainelAvaliacaoProps) {
  const [frameworkCodigo, setFrameworkCodigo] = useState('lgpd')
  const [perfil, setPerfil] = useState<Perfil>('basico')

  const frameworks = useQuery({ queryKey: ['frameworks', 'frameworks'], queryFn: fetchFrameworks })
  const controles = useQuery({
    queryKey: ['frameworks', 'controles', frameworkCodigo, perfil],
    queryFn: () => fetchControles(frameworkCodigo, perfil),
  })
  // Trocar de cliente invalida esta chave (org faz parte dela) — nunca
  // mostra avaliação da organização anterior (docs §7.2).
  const avaliacoes = useQuery({
    queryKey: ['frameworks', 'avaliacoes', org],
    queryFn: () => fetchAvaliacoes(org),
  })
  const nota = useQuery({
    queryKey: ['frameworks', 'nota', org, frameworkCodigo, perfil],
    queryFn: () => fetchNota(frameworkCodigo, perfil, org),
  })

  const frameworkAtual = frameworks.data?.find((f) => f.codigo === frameworkCodigo)
  const statusLista =
    controles.status === 'error' || avaliacoes.status === 'error'
      ? 'error'
      : controles.status === 'pending' || avaliacoes.status === 'pending'
        ? 'pending'
        : 'success'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="painel-framework" className="block text-xs text-muted-foreground">
              Framework
            </label>
            <select
              id="painel-framework"
              value={frameworkCodigo}
              onChange={(e) => setFrameworkCodigo(e.target.value)}
              className="mt-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(frameworks.data ?? []).map((f) => (
                <option key={f.codigo} value={f.codigo}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="painel-perfil" className="block text-xs text-muted-foreground">
              Perfil
            </label>
            <select
              id="painel-perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as Perfil)}
              className="mt-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PERFIS.map((p) => (
                <option key={p} value={p}>
                  {GRAU_LABEL[p]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <NotaDisplay
          framework={frameworkAtual?.nome ?? frameworkCodigo}
          nota={nota.data?.nota ?? null}
          avaliados={nota.data?.controles_avaliados ?? 0}
          total={nota.data?.controles_total ?? 0}
          carregando={nota.status === 'pending'}
        />
      </div>

      <ListaControles
        controles={controles.data}
        avaliacoes={avaliacoes.data}
        status={statusLista}
        org={org}
        onRetry={() => {
          controles.refetch()
          avaliacoes.refetch()
        }}
      />
    </div>
  )
}

function NotaDisplay({
  framework,
  nota,
  avaliados,
  total,
  carregando,
}: {
  framework: string
  nota: number | null
  avaliados: number
  total: number
  carregando: boolean
}) {
  if (carregando) {
    return <p className="text-sm text-muted-foreground">Calculando nota…</p>
  }
  const { texto, cobertura } = descricaoNota({ nota, avaliados, total })
  return (
    <div className="text-right">
      <p className="text-xs text-muted-foreground">{framework}</p>
      <p className="font-serif text-2xl text-foreground">{texto}</p>
      {cobertura && <p className="text-xs text-muted-foreground">{cobertura}</p>}
    </div>
  )
}

function ListaControles({
  controles,
  avaliacoes,
  status,
  org,
  onRetry,
}: {
  controles: Controle[] | undefined
  avaliacoes: AvaliacaoControle[] | undefined
  status: 'pending' | 'error' | 'success'
  org: number
  onRetry: () => void
}) {
  if (status === 'pending') return <LoadingState label="Carregando controles…" />
  if (status === 'error') {
    return <ErrorState descricao="Não foi possível carregar os controles ou as avaliações." onRetry={onRetry} />
  }
  if (!controles || controles.length === 0) {
    return (
      <EmptyState
        titulo="Nenhum controle carregado para este framework/perfil"
        descricao="Esse pacote ainda não tem biblioteca de controles cadastrada."
      />
    )
  }

  const avaliacaoPorControle = new Map(
    (avaliacoes ?? []).map((a): [number, AvaliacaoControle] => [a.controle, a])
  )
  const grupos = new Map<string, Controle[]>()
  for (const controle of controles) {
    const lista = grupos.get(controle.grupo) ?? []
    lista.push(controle)
    grupos.set(controle.grupo, lista)
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(grupos.entries()).map(([grupo, itensDoGrupo]) => (
        <div key={grupo}>
          <h3 className="text-sm font-medium text-muted-foreground">{grupo}</h3>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
            {itensDoGrupo.map((controle) => (
              <ControleAvaliacao
                key={controle.id}
                controle={controle}
                avaliacao={avaliacaoPorControle.get(controle.id)}
                org={org}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
