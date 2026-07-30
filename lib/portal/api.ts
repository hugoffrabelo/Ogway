import { API_URL } from '@/lib/api-url'
import { apiPost } from '@/lib/api-post'
import type { DashboardData, Documento, Risco } from './types'

// Sem ?org= em nenhuma chamada aqui: cliente_leitor é preso à própria
// org pelo TenantMiddleware automaticamente (apps/core/middleware.py) —
// diferente do cockpit, que é cross-cliente e precisa escolher a org.

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API_URL}/api/portal/dashboard/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar o dashboard.')
  }
  return res.json()
}

export async function fetchRiscos(): Promise<Risco[]> {
  const res = await fetch(`${API_URL}/api/riscos/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os riscos.')
  }
  return res.json()
}

// Único ponto de escrita do cliente_leitor no portal (RACI — o
// controlador é sempre o "A"). Só move um risco pendente pra aceito.
export function aceitarRisco(id: number): Promise<Risco> {
  return apiPost<Risco>(`/api/riscos/${id}/aceitar/`)
}

export async function fetchDocumentosPublicados(): Promise<Documento[]> {
  const res = await fetch(`${API_URL}/api/documentos/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os documentos.')
  }
  return res.json()
}
