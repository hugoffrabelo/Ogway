import { formatarPrazo, tomPorPrazo } from '@/lib/status'
import { StatusBadge } from './status-badge'

interface PrazoBadgeProps {
  /** Dias úteis restantes, do motor de prazos da API — negativo = vencido. */
  diasUteisRestantes: number
  className?: string
}

// Variante do StatusBadge especializada em contagem de dias úteis
// (docs/frontend-cockpit-portal.md §4.1). Não calcula prazo — só formata
// o que a API já devolveu, pra não duplicar o motor de prazos central.
export function PrazoBadge({ diasUteisRestantes, className }: PrazoBadgeProps) {
  return (
    <StatusBadge
      status={tomPorPrazo(diasUteisRestantes)}
      label={formatarPrazo(diasUteisRestantes)}
      className={className}
    />
  )
}
