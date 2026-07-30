import { Inbox, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  titulo: string
  descricao?: string
  icon?: LucideIcon
  className?: string
}

// "Sem incidentes" != "falha ao carregar" — nunca reaproveitar este
// componente pra representar erro (ver ErrorState). Numa ferramenta
// anti-perda essa distinção é crítica (docs/frontend-cockpit-portal.md §4.1).
export function EmptyState({ titulo, descricao, icon: Icon = Inbox, className }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-12 text-center',
        className
      )}
    >
      <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-medium text-foreground">{titulo}</p>
      {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
    </div>
  )
}
