import { apiGet, apiPost, comOrg } from '@/lib/api-client'
import type { AvaliacaoControle, Controle, Framework, NotaResponse, Perfil } from './types'

// Framework/Controle são biblioteca compartilhada (não TenantModel) —
// nunca ?org=. AvaliacaoControle é por cliente — sempre ?org=.

export const fetchFrameworks = () => apiGet<Framework[]>('/api/frameworks/frameworks/')

export const fetchControles = (frameworkCodigo: string, perfil: Perfil) =>
  apiGet<Controle[]>(
    `/api/frameworks/controles/?framework=${frameworkCodigo}&perfil=${perfil}`
  )

export const fetchAvaliacoes = (org: number) =>
  apiGet<AvaliacaoControle[]>(comOrg('/api/frameworks/avaliacoes/', org))

export const fetchNota = (frameworkCodigo: string, perfil: Perfil, org: number) =>
  apiGet<NotaResponse>(
    comOrg(`/api/frameworks/avaliacoes/nota/?framework=${frameworkCodigo}&perfil=${perfil}`, org)
  )

export interface RegistrarAvaliacaoInput {
  controle: number
  status: AvaliacaoControle['status']
  evidencia?: string
  responsavel?: number | null
}

// Sempre POST: o backend faz upsert (apps.frameworks.services.
// registrar_avaliacao) — cria na primeira marcação, atualiza nas
// seguintes. O front não precisa decidir POST vs PATCH nem rastrear se
// já existe avaliação; isso também fecha a corrida de clique duplo no
// mesmo controle (o backend resolve como "o último clique vence", nunca
// duplicata nem 500).
export const registrarAvaliacao = (org: number, dados: RegistrarAvaliacaoInput) =>
  apiPost<AvaliacaoControle>(comOrg('/api/frameworks/avaliacoes/', org), dados)
