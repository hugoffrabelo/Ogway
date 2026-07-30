// Espelha apps/incidentes/serializers.py IncidenteSerializer.
export interface Incidente {
  id: number
  detectado_em: string
  confirmado_afetou_dados_em: string | null
  descricao: string
  dados_afetados: string
  etapa:
    | 'registrado'
    | 'avaliando_risco'
    | 'comunicando'
    | 'complementando'
    | 'encerrado'
    | 'encerrado_sem_notificacao'
  risco_relevante: boolean | null
  justificativa_avaliacao: string
  decisao_notificar: boolean | null
  prazo_anpd: string | null
  prazo_titular: string | null
  prazo_complementacao: string | null
  dias_uteis_prazo_anpd: number | null
  dias_uteis_prazo_titular: number | null
  dias_uteis_prazo_complementacao: number | null
  comunicacao_anpd: string | null
  comunicacao_titular: string | null
}

// Espelha apps/solicitacoes/serializers.py SolicitacaoTitularSerializer.
// Nunca terá `conteudo` — a ilha sensível só se lê via ação dedicada,
// nunca pela listagem (CLAUDE.md).
export interface SolicitacaoTitular {
  id: number
  tipo_direito:
    | 'acesso'
    | 'confirmacao'
    | 'correcao'
    | 'eliminacao'
    | 'portabilidade'
    | 'oposicao'
    | 'informacao_compartilhamento'
    | 'revogacao'
  recebida_em: string
  prazo_sla: string | null
  dias_uteis_prazo_sla: number | null
  status: 'recebida' | 'em_analise' | 'respondida' | 'negada'
  responsavel: number | null
  resposta: string
  evidencia: string
  eliminacao_bloqueada_por_retencao: boolean
}

// Espelha apps/cockpit/serializers.py ItemFilaSerializer, que serializa
// apps/cockpit/services.py ItemFila (fila_hoje — cross-cliente, já
// filtrada por RBAC no backend).
export type ItemFila =
  | {
      tipo: 'incidente'
      org_nome: string
      prazo: string | null
      dias_uteis_restantes: number | null
      objeto: Incidente
    }
  | {
      tipo: 'solicitacao'
      org_nome: string
      prazo: string | null
      dias_uteis_restantes: number | null
      objeto: SolicitacaoTitular
    }
