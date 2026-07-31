'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'

interface ConfirmacaoDestrutivaProps {
  titulo: string
  descricao: string
  onConfirmar: () => void
  confirmando?: boolean
  labelConfirmar?: string
  trigger: React.ReactNode
}

// §4.4 da doc de frontend — diálogo obrigatório pra qualquer ação
// irreversível (ex.: excluir Operador/AtividadeTratamento).
export function ConfirmacaoDestrutiva({
  titulo,
  descricao,
  onConfirmar,
  confirmando,
  labelConfirmar = 'Excluir',
  trigger,
}: ConfirmacaoDestrutivaProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="text-xs font-medium text-status-critico underline underline-offset-4">
        {trigger}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 bg-overlay" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
          <AlertDialog.Title className="font-serif text-lg text-foreground">{titulo}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            {descricao}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Close className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted">
              Cancelar
            </AlertDialog.Close>
            <button
              type="button"
              onClick={onConfirmar}
              disabled={confirmando}
              className="rounded-md bg-status-critico px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {confirmando ? 'Aguarde…' : labelConfirmar}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
