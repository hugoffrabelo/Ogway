import { AlertOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  titulo?: string
  descricao?: string
  onRetry?: () => void
  className?: string
}

// Visualmente distinto de EmptyState de propósito — "falha ao carregar"
// nunca deve parecer "sem dados" (docs/frontend-cockpit-portal.md §4.1).
export function ErrorState({
  titulo = 'Não foi possível carregar',
  descricao,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-status-critico/30 bg-status-critico/5 p-12 text-center',
        className
      )}
    >
      <AlertOctagon className="size-8 text-status-critico" aria-hidden="true" />
      <p className="font-medium text-status-critico">{titulo}</p>
      {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-primary underline underline-offset-4"
        >
          Tentar de novo
        </button>
      )}
    </div>
  )
}
