import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  className?: string
}

export function LoadingState({ label = 'Carregando…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      data-slot="loading-state"
      className={cn('flex flex-col items-center gap-2 p-12 text-center', className)}
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
