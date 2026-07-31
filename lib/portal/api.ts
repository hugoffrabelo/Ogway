import { API_URL } from '@/lib/api-url'
import { apiPost } from '@/lib/api-post'
import type { DashboardData, DiagramaProcesso, Documento, MapaLinhagem, Risco } from './types'

// `org` é opcional em toda função abaixo: cliente_leitor não precisa
// passar (o TenantMiddleware já prende à própria org automaticamente —
// apps/core/middleware.py); encarregado/substituto/equipe usando o
// DrilldownCliente do cockpit passam o org escolhido, já que são
// cross-cliente por natureza.
function comOrg(path: string, org?: number): string {
  return org ? `${path}?org=${org}` : path
}

export async function fetchDashboard(org?: number): Promise<DashboardData> {
  const res = await fetch(`${API_URL}${comOrg('/api/portal/dashboard/', org)}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Não foi possível carregar o dashboard.')
  }
  return res.json()
}

export async function fetchRiscos(org?: number): Promise<Risco[]> {
  const res = await fetch(`${API_URL}${comOrg('/api/riscos/', org)}`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os riscos.')
  }
  return res.json()
}

// Único ponto de escrita do cliente_leitor no portal (RACI — o
// controlador é sempre o "A"). Só move um risco pendente pra aceito.
export function aceitarRisco(id: number, org?: number): Promise<Risco> {
  return apiPost<Risco>(comOrg(`/api/riscos/${id}/aceitar/`, org))
}

export async function fetchDocumentosPublicados(org?: number): Promise<Documento[]> {
  const res = await fetch(`${API_URL}${comOrg('/api/documentos/', org)}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os documentos.')
  }
  return res.json()
}

export async function fetchMapaLinhagem(org?: number): Promise<MapaLinhagem> {
  const res = await fetch(`${API_URL}${comOrg('/api/linhagem/fluxos/mapa/', org)}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Não foi possível carregar o mapa de fluxo de dados.')
  }
  return res.json()
}

export async function fetchDiagramasProcesso(org?: number): Promise<DiagramaProcesso[]> {
  const res = await fetch(`${API_URL}${comOrg('/api/processos/diagramas/', org)}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os diagramas de processo.')
  }
  return res.json()
}
