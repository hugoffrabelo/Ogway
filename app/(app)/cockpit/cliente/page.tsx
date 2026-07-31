'use client'

import Link from 'next/link'
import { DrilldownCliente } from '@/components/cockpit/drilldown-cliente'

export default function DrilldownClientePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center gap-3">
        <Link href="/cockpit" className="text-sm text-muted-foreground underline underline-offset-4">
          ← Cockpit
        </Link>
      </div>
      <h1 className="mt-2 font-serif text-2xl text-foreground">Cliente</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tudo sobre um cliente específico — o que ele vê no portal, mais a fila de trabalho.
      </p>

      <div className="mt-8">
        <DrilldownCliente />
      </div>
    </div>
  )
}
