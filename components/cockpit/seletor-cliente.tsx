'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchOrganizacoes } from '@/lib/cockpit/api'
import { useOrgAtivo } from '@/lib/cockpit/org-context'

// docs/frontend-cockpit-portal.md §4.2/§7.2 — troca de contexto de
// organização. Fica no layout, sempre visível, nunca escondido em menu.
export function SeletorCliente() {
  const { data: orgs, status } = useQuery({
    queryKey: ['cockpit', 'organizacoes'],
    queryFn: fetchOrganizacoes,
  })
  const { orgAtivo, setOrgAtivo } = useOrgAtivo()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="seletor-cliente" className="text-xs font-medium text-muted-foreground">
        Cliente ativo:
      </label>
      <select
        id="seletor-cliente"
        value={orgAtivo?.id ?? ''}
        onChange={(e) => {
          const id = e.target.value ? Number(e.target.value) : null
          const org = orgs?.find((o) => o.id === id)
          setOrgAtivo(org ? { id: org.id, nome: org.razao_social } : null)
        }}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">{status === 'pending' ? 'Carregando…' : 'Selecione um cliente'}</option>
        {orgs?.map((o) => (
          <option key={o.id} value={o.id}>
            {o.razao_social}
          </option>
        ))}
      </select>
    </div>
  )
}
