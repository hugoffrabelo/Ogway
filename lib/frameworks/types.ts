// Espelha apps/frameworks/serializers.py FrameworkSerializer.
export interface Framework {
  id: number
  codigo: string
  nome: string
  versao: string
}

export type Perfil = 'basico' | 'intermediario' | 'avancado'
export type StatusConteudo = 'provisorio' | 'validado'

// Espelha apps/frameworks/serializers.py ControleSerializer. Framework e
// Controle não são TenantModel (biblioteca compartilhada) — nunca ?org=.
export interface Controle {
  id: number
  framework: number
  codigo: string
  grupo: string
  descricao: string
  fonte: string
  status: StatusConteudo
  perfil_minimo: Perfil
}

export type StatusAvaliacao = 'aplicado' | 'parcial' | 'nao_aplicado' | 'nao_se_aplica'

// Espelha apps/frameworks/serializers.py AvaliacaoControleSerializer.
// AvaliacaoControle é TenantModel — toda chamada carrega ?org=.
export interface AvaliacaoControle {
  id: number
  controle: number
  status: StatusAvaliacao
  evidencia: string
  responsavel: number | null
  atualizado_em: string
}

// Espelha a resposta de GET /api/frameworks/avaliacoes/nota/. `nota` é
// sempre calculada pelo backend (apps.frameworks.services.calcular_nota)
// — o front nunca recalcula. avaliados/total existem só pra distinguir
// "não avaliado" de "avaliado como zero"; calcular_nota() continua
// tratando controle sem avaliação como não_aplicado de propósito
// (conservador — não infla nota de quem avaliou pouco).
export interface NotaResponse {
  framework: string
  perfil: Perfil
  nota: number | null
  controles_avaliados: number
  controles_total: number
}
