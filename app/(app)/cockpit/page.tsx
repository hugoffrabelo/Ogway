'use client'

import { useAuth } from '@/lib/auth/context'
import { PrazoBadge, KpiCard, ClienteTag, EmptyState } from '@/components/shared'

// Placeholder — Fase B do doc de frontend substitui isto por FilaPorPrazo
// consumindo a API real. Serve por ora pra validar os componentes do §4.1
// visualmente, com dado fictício (nunca real, nunca da ilha sensível).
const FILA_EXEMPLO = [
  { id: 1, cliente: 'Clínica Vitalis', item: 'Notificação ANPD — incidente #204', diasUteisRestantes: 1 },
  { id: 2, cliente: 'Hospital Bem Cuidar', item: 'Resposta Art. 18 — solicitação #58', diasUteisRestantes: 4 },
  { id: 3, cliente: 'Consultório Dr. Aoki', item: 'Complementação ANPD — incidente #201', diasUteisRestantes: 12 },
]

export default function CockpitPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Cockpit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.username} · {user?.papel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Sair
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Prazos em aberto" valor={FILA_EXEMPLO.length} />
        <KpiCard label="Vencendo em até 3 dias úteis" valor={2} variacao={{ texto: 'atenção', tom: 'atencao' }} />
        <KpiCard label="Clientes atendidos" valor={12} variacao={{ texto: '+1 no mês', tom: 'ok' }} />
      </div>

      <h2 className="mt-10 text-sm font-medium text-muted-foreground">Fila por prazo</h2>
      {FILA_EXEMPLO.length === 0 ? (
        <EmptyState titulo="Sem prazos em aberto" descricao="Nenhum incidente ou solicitação pendente no momento." />
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
          {FILA_EXEMPLO.map((linha) => (
            <li key={linha.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <ClienteTag nome={linha.cliente} />
                <span className="text-sm text-foreground">{linha.item}</span>
              </div>
              <PrazoBadge diasUteisRestantes={linha.diasUteisRestantes} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
