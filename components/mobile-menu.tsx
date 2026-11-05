'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

// Menu abaixo de lg: <details> nativo (abre com teclado e funciona sem JS);
// o script só fecha o menu ao escolher um link, ao clicar fora ou com Esc.
export function MobileMenu({ items }: { items: { label: string; href: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const fechar = () => ref.current?.removeAttribute('open')
    const fora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fechar()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
    }
    document.addEventListener('click', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('click', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  return (
    <details ref={ref} className="group relative lg:hidden">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-[var(--lovisa-navy)] focus-visible:outline-none [&::-webkit-details-marker]:hidden"
        aria-label="Abrir menu"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path className="group-open:hidden" d="M4 7h16M4 12h16M4 17h16" />
          <path className="hidden group-open:block" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>
      {/* sombra: é um menu que flutua de verdade sobre a página. taste-skill-ignore */}
      <nav
        aria-label="Seções"
        className="absolute top-12 right-0 flex w-64 flex-col rounded-2xl bg-card p-3 shadow-[0_18px_40px_-20px_rgba(4,60,83,0.45)]"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => ref.current?.removeAttribute('open')}
            className="rounded-xl px-4 py-3 text-base text-foreground transition-colors hover:bg-secondary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  )
}
