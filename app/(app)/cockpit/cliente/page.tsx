'use client'

import { DrilldownCliente } from '@/components/cockpit/drilldown-cliente'

export default function DrilldownClientePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-serif text-2xl text-foreground">Cliente</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tudo sobre um cliente específico — o que ele vê no portal, mais a fila de trabalho.
      </p>

      <div className="mt-8">
        <DrilldownCliente />
      </div>
    </div>
  )
}
