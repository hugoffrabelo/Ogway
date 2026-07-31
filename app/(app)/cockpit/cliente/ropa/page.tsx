'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useOrgAtivo } from '@/lib/cockpit/org-context'
import { EmptyState } from '@/components/shared'
import { AtividadeLista } from '@/components/ropa/atividade-lista'
import { OperadorLista } from '@/components/ropa/operador-lista'
import { cn } from '@/lib/utils'

type Aba = 'atividades' | 'operadores'

// docs/frontend-cockpit-portal.md §9 item 5 — "primeira vertical
// completa da Fase E: RoPA ponta a ponta." Hub do modelo de dados
// (CLAUDE.md) — sem isso, o resto do produto opera sobre dado
// cadastrado só por fora (admin/shell).
export default function RopaPage() {
  const { orgAtivo } = useOrgAtivo()
  const [aba, setAba] = useState<Aba>('atividades')

  return (
    <div className="min-h-screen bg-background p-8">
      <Link
        href="/cockpit/cliente"
        className="text-sm text-muted-foreground underline underline-offset-4"
      >
        ← Cliente
      </Link>
      <h1 className="mt-2 font-serif text-2xl text-foreground">RoPA</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Registro de Operações de Tratamento (Art. 37 LGPD) — hub do modelo de dados.
      </p>

      {orgAtivo === null ? (
        <div className="mt-8">
          <EmptyState
            titulo="Escolha um cliente"
            descricao="Selecione um cliente no seletor acima para gerenciar o RoPA dele."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex gap-2 border-b border-border">
            <AbaBotao
              ativo={aba === 'atividades'}
              onClick={() => setAba('atividades')}
              label="Atividades de tratamento"
            />
            <AbaBotao ativo={aba === 'operadores'} onClick={() => setAba('operadores')} label="Operadores" />
          </div>
          <div className="mt-6">
            {aba === 'atividades' ? (
              <AtividadeLista org={orgAtivo.id} />
            ) : (
              <OperadorLista org={orgAtivo.id} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function AbaBotao({ ativo, onClick, label }: { ativo: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 px-3 py-2 text-sm font-medium',
        ativo
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}
