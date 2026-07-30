import { API_URL } from '@/lib/api-url'
import { apiPatch, apiPost } from '@/lib/api-post'
import type {
  Incidente,
  IncidenteCockpit,
  ItemFila,
  Organizacao,
  SolicitacaoTitular,
  SolicitacaoTitularCockpit,
} from './types'

export async function fetchFilaHoje(): Promise<ItemFila[]> {
  const res = await fetch(`${API_URL}/api/cockpit/fila-hoje/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar a fila.')
  }
  return res.json()
}

export async function fetchIncidentesCockpit(): Promise<IncidenteCockpit[]> {
  const res = await fetch(`${API_URL}/api/cockpit/incidentes/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar os incidentes.')
  }
  return res.json()
}

export async function fetchOrganizacoes(): Promise<Organizacao[]> {
  const res = await fetch(`${API_URL}/api/cockpit/organizacoes/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar a lista de clientes.')
  }
  return res.json()
}

// As chamadas abaixo consomem /api/incidentes/ diretamente (tenant-scoped
// — precisa de ?org=), não /api/cockpit/incidentes/ (só leitura
// cross-cliente). Toda transição passa por apps.incidentes.maquina_estados
// no backend; aqui só chamamos a action certa, nunca escrevemos `etapa`.

export interface RegistrarIncidenteInput {
  org: number
  detectado_em: string
  descricao: string
  dados_afetados?: string
}

export function registrarIncidente(input: RegistrarIncidenteInput): Promise<Incidente> {
  const { org, ...body } = input
  return apiPost<Incidente>(`/api/incidentes/registrar/?org=${org}`, body)
}

export function confirmarMarco(
  id: number,
  org: number,
  confirmadoAfetouDadosEm: string
): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/confirmar_marco/?org=${org}`, {
    confirmado_afetou_dados_em: confirmadoAfetouDadosEm,
  })
}

export function avaliarRisco(
  id: number,
  org: number,
  riscoRelevante: boolean,
  justificativa: string
): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/avaliar-risco/?org=${org}`, {
    risco_relevante: riscoRelevante,
    justificativa,
  })
}

export function comunicarAnpd(id: number, org: number): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/comunicar-anpd/?org=${org}`)
}

export function comunicarTitular(id: number, org: number): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/comunicar-titular/?org=${org}`)
}

export function avancarComplementando(id: number, org: number): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/avancar-complementando/?org=${org}`)
}

export function encerrarIncidente(id: number, org: number): Promise<Incidente> {
  return apiPost<Incidente>(`/api/incidentes/${id}/encerrar/?org=${org}`)
}

export async function fetchSolicitacoesCockpit(): Promise<SolicitacaoTitularCockpit[]> {
  const res = await fetch(`${API_URL}/api/cockpit/solicitacoes/`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Não foi possível carregar as solicitações.')
  }
  return res.json()
}

// apps.solicitacoes não tem máquina de estados dedicada (ao contrário de
// Incidente) — é ModelViewSet padrão, então triagem/resposta são PATCH
// direto em /api/solicitacoes/{id}/, tenant-scoped (precisa de ?org=).

export interface RegistrarSolicitacaoInput {
  org: number
  tipo_direito: SolicitacaoTitular['tipo_direito']
  recebida_em: string
  conteudo: string
  prazo_sla?: string
}

export function registrarSolicitacao(input: RegistrarSolicitacaoInput): Promise<SolicitacaoTitular> {
  const { org, ...body } = input
  return apiPost<SolicitacaoTitular>(`/api/solicitacoes/?org=${org}`, body)
}

// Define o prazo (ex.: solicitação chegou pelo canal público sem
// triagem ainda) e move pra em_analise.
export function triarSolicitacao(
  id: number,
  org: number,
  prazoSla: string
): Promise<SolicitacaoTitular> {
  return apiPatch<SolicitacaoTitular>(`/api/solicitacoes/${id}/?org=${org}`, {
    status: 'em_analise',
    prazo_sla: prazoSla,
  })
}

export function responderSolicitacao(
  id: number,
  org: number,
  resposta: string,
  status: 'respondida' | 'negada'
): Promise<SolicitacaoTitular> {
  return apiPatch<SolicitacaoTitular>(`/api/solicitacoes/${id}/?org=${org}`, { resposta, status })
}

// Único ponto de leitura do conteúdo sensível (ilha sensível) — RBAC +
// auditoria aplicados no backend a cada chamada (CLAUDE.md). Nunca
// cachear o retorno além do estado local do componente que exibe.
export function lerConteudoSolicitacao(id: number, org: number): Promise<{ conteudo: string }> {
  return apiPost<{ conteudo: string }>(`/api/solicitacoes/${id}/ler_conteudo/?org=${org}`)
}
