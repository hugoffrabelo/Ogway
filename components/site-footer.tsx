import Link from 'next/link'
import { ShellMark } from '@/components/shell-pattern'
import { CONTACT_EMAIL } from '@/lib/contact'

// Mesma referência Lovisa Malin do cabeçalho — ver components/site-header.tsx.
const cinzel = { fontFamily: 'var(--font-cinzel)' }
const poppins = { fontFamily: 'var(--font-poppins)' }
const NAVY = 'var(--lovisa-navy)'

export function SiteFooter() {
  return (
    <footer className="bg-secondary" style={poppins}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-4">
            <ShellMark className="h-12 w-12" />
            <span
              className="text-4xl leading-none font-medium tracking-wide uppercase sm:text-5xl"
              style={{ ...cinzel, color: NAVY }}
              translate="no"
            >
              Ogway
            </span>
          </div>
          <p className="mt-4 text-foreground">
            LGPD e encarregado de dados para clínicas. Porto Alegre, RS.
          </p>
        </div>

        <ul className="flex flex-col gap-2 text-foreground lg:items-end">
          {CONTACT_EMAIL && (
            <li>
              <a className="underline-offset-4 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          )}
          <li>
            <Link className="underline-offset-4 hover:underline" href="/privacidade">
              Aviso de privacidade
            </Link>
          </li>
          <li className="text-sm text-foreground/80">
            © {new Date().getFullYear()} Ogway. Feito com cuidado, para quem cuida.
          </li>
        </ul>
      </div>
    </footer>
  )
}
