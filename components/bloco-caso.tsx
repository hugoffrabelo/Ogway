import { ShellPattern } from '@/components/shell-pattern'

// Bloco de cor da marca usado em "Qual é o seu caso?" (home) e em "Outros
// serviços" (páginas de serviço): azul (navy) ou dourado (camelo), ambos com
// o padrão de hexágonos sutil. Fica dentro de um link com a classe `group`:
// a textura cresce levemente no hover/foco da linha.
//
// Contraste: branco sobre navy ≥ 10:1; navy sobre camelo 4,6:1 (só texto
// grande, acima de 24px).
export type Fundo = 'navy' | 'camelo'

const NAVY = 'var(--lovisa-navy)'
const CAMEL = 'var(--lovisa-camel)'

export function BlocoCaso({
  fundo,
  children,
  className = 'min-h-[10rem] p-6 lg:min-h-[12rem] lg:p-8',
}: {
  fundo: Fundo
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative isolate flex items-end overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: fundo === 'camelo' ? CAMEL : NAVY, color: fundo === 'camelo' ? NAVY : 'white' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
      >
        {fundo === 'navy' ? (
          <ShellPattern className="h-full w-full text-white" opacity={0.12} size={34} />
        ) : (
          <ShellPattern className="h-full w-full text-[var(--lovisa-navy)]" opacity={0.1} size={34} />
        )}
      </div>
      {children}
    </div>
  )
}
