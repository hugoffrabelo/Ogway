'use client'

import Link from 'next/link'
import { useOrgAtivo } from '@/lib/cockpit/org-context'
import { EmptyState } from '@/components/shared'
import { PainelAvaliacao } from '@/components/frameworks/painel-avaliacao'

export default function FrameworksPage() {
  const { orgAtivo } = useOrgAtivo()

  return (
    <div className="min-h-screen bg-background p-8">
      <Link
        href="/cockpit/cliente"
        className="text-sm text-muted-foreground underline underline-offset-4"
      >
        ← Cliente
      </Link>
      <h1 className="mt-2 font-serif text-2xl text-foreground">Avaliação de controles</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        SoA por framework — marque o estado de cada controle pra este cliente.
      </p>

      {orgAtivo === null ? (
        <div className="mt-8">
          <EmptyState
            titulo="Escolha um cliente"
            descricao="Selecione um cliente no seletor acima para avaliar os controles dele."
          />
        </div>
      ) : (
        <div className="mt-8">
          <PainelAvaliacao org={orgAtivo.id} />
        </div>
      )}
    </div>
  )
}
