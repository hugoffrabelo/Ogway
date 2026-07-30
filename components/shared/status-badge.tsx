import { cn } from '@/lib/utils'
import { STATUS_CONFIG, type StatusTom } from '@/lib/status'

interface StatusBadgeProps {
  status: StatusTom
  /** Obrigatório — nunca comunicar urgência só por cor (CLAUDE.md). */
  label: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { icon: Icon, badge } = STATUS_CONFIG[status]
  return (
    <span
      data-slot="status-badge"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        badge,
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}
