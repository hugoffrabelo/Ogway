'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface OrgAtivo {
  id: number
  nome: string
}

interface OrgContextValue {
  orgAtivo: OrgAtivo | null
  setOrgAtivo: (org: OrgAtivo | null) => void
}

const OrgContext = createContext<OrgContextValue | null>(null)

// docs/frontend-cockpit-portal.md §7.2 — "o cliente ativo precisa estar
// visível e persistente no layout." Vive no layout de /cockpit/cliente,
// não em estado local de página — trocar de página sem trocar de
// cliente mantém a seleção.
export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgAtivo, setOrgAtivo] = useState<OrgAtivo | null>(null)
  return <OrgContext.Provider value={{ orgAtivo, setOrgAtivo }}>{children}</OrgContext.Provider>
}

export function useOrgAtivo() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrgAtivo precisa estar dentro de <OrgProvider>.')
  return ctx
}
