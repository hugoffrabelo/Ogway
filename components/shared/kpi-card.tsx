import { cn } from '@/lib/utils'
import { STATUS_CONFIG, type StatusTom } from '@/lib/status'

interface KpiCardProps {
  label: string
  valor: string | number
  /** Ex.: { texto: '+12% no mês', tom: 'ok' } — sempre com texto, nunca só a cor. */
  variacao?: { texto: string; tom: StatusTom }
  className?: string
}

// Base do dashboard do portal e da triagem do cockpit
// (docs/frontend-cockpit-portal.md §4.1).
export function KpiCard({ label, valor, variacao, className }: KpiCardProps) {
  return (
    <div
      data-slot="kpi-card"
      className={cn('rounded-lg border border-border bg-card p-6', className)}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl text-foreground">{valor}</p>
      {variacao && (
        <p className={cn('mt-1 text-sm font-medium', STATUS_CONFIG[variacao.tom].texto)}>
          {variacao.texto}
        </p>
      )}
    </div>
  )
}
