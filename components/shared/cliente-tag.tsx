import { cn } from '@/lib/utils'

interface ClienteTagProps {
  nome: string
  className?: string
}

// Identidade de organização, não urgência — usa --secondary, nunca as
// cores de --status-* (docs/frontend-cockpit-portal.md §4.1: "usada em
// toda linha cross-cliente do cockpit").
export function ClienteTag({ nome, className }: ClienteTagProps) {
  return (
    <span
      data-slot="cliente-tag"
      className={cn(
        'inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground',
        className
      )}
    >
      {nome}
    </span>
  )
}
