'use client'

import Link from 'next/link'
import { OrgProvider } from '@/lib/cockpit/org-context'
import { SeletorCliente } from '@/components/cockpit/seletor-cliente'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgProvider>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-8 py-3 backdrop-blur">
        <Link href="/cockpit" className="text-sm text-muted-foreground underline underline-offset-4">
          ← Cockpit
        </Link>
        <SeletorCliente />
      </div>
      {children}
    </OrgProvider>
  )
}
