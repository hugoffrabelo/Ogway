import type { UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

// Campos de formulário compartilhados — §4.4 da doc de frontend.
// Erro de validação sempre no campo, nunca em toast genérico.

interface CampoBaseProps {
  label: string
  erro?: string
  className?: string
}

function Rotulo({ label, erro, htmlFor }: { label: string; erro?: string; htmlFor: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <label htmlFor={htmlFor} className="block text-xs text-muted-foreground">
        {label}
      </label>
      {erro && <span className="text-[11px] font-medium text-status-critico">{erro}</span>}
    </div>
  )
}

const inputClasses =
  'mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface CampoTextoProps extends CampoBaseProps {
  registro: UseFormRegisterReturn
  type?: 'text' | 'date' | 'number'
  placeholder?: string
}

export function CampoTexto({ label, registro, erro, type = 'text', placeholder, className }: CampoTextoProps) {
  return (
    <div className={className}>
      <Rotulo label={label} erro={erro} htmlFor={registro.name} />
      <input
        id={registro.name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!erro}
        {...registro}
        className={cn(inputClasses, erro && 'border-status-critico')}
      />
    </div>
  )
}

interface CampoTextareaProps extends CampoBaseProps {
  registro: UseFormRegisterReturn
  rows?: number
  placeholder?: string
}

export function CampoTextarea({ label, registro, erro, rows = 3, placeholder, className }: CampoTextareaProps) {
  return (
    <div className={className}>
      <Rotulo label={label} erro={erro} htmlFor={registro.name} />
      <textarea
        id={registro.name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!erro}
        {...registro}
        className={cn(inputClasses, erro && 'border-status-critico')}
      />
    </div>
  )
}

interface CampoSelectProps extends CampoBaseProps {
  registro: UseFormRegisterReturn
  opcoes: { valor: string | number; rotulo: string }[]
  placeholder?: string
}

export function CampoSelect({ label, registro, erro, opcoes, placeholder, className }: CampoSelectProps) {
  return (
    <div className={className}>
      <Rotulo label={label} erro={erro} htmlFor={registro.name} />
      <select
        id={registro.name}
        aria-invalid={!!erro}
        {...registro}
        className={cn(inputClasses, erro && 'border-status-critico')}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder ?? 'Selecione'}
        </option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </div>
  )
}

interface CampoCheckboxProps extends CampoBaseProps {
  registro: UseFormRegisterReturn
}

export function CampoCheckbox({ label, registro, erro, className }: CampoCheckboxProps) {
  return (
    <div className={className}>
      <label htmlFor={registro.name} className="flex items-center gap-2 text-sm text-foreground">
        <input id={registro.name} type="checkbox" {...registro} className="size-4" />
        {label}
      </label>
      {erro && <p className="mt-1 text-[11px] font-medium text-status-critico">{erro}</p>}
    </div>
  )
}

interface CampoMultiSelectProps extends CampoBaseProps {
  registro: UseFormRegisterReturn
  opcoes: { valor: string | number; rotulo: string }[]
}

// M2M como lista de checkboxes (mais legível que <select multiple> pra
// menos de ~20 opções). Todas as checkboxes usam o mesmo `register(name)`
// — react-hook-form junta os marcados num array automaticamente.
export function CampoMultiSelect({ label, registro, erro, opcoes, className }: CampoMultiSelectProps) {
  return (
    <fieldset className={className}>
      <legend className="text-xs text-muted-foreground">{label}</legend>
      <div className="mt-1 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-input bg-background p-2">
        {opcoes.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma opção disponível.</p>}
        {opcoes.map((o) => (
          <label
            key={o.valor}
            htmlFor={`${registro.name}-${o.valor}`}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <input
              id={`${registro.name}-${o.valor}`}
              type="checkbox"
              value={o.valor}
              {...registro}
              className="size-4"
            />
            {o.rotulo}
          </label>
        ))}
      </div>
      {erro && <p className="mt-1 text-[11px] font-medium text-status-critico">{erro}</p>}
    </fieldset>
  )
}
