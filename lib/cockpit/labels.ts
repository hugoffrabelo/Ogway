import type { ItemFila } from './types'

const TIPO_DIREITO_LABEL: Record<string, string> = {
  acesso: 'Acesso',
  confirmacao: 'Confirmação de tratamento',
  correcao: 'Correção',
  eliminacao: 'Eliminação',
  portabilidade: 'Portabilidade',
  oposicao: 'Oposição',
  informacao_compartilhamento: 'Informação sobre compartilhamento',
  revogacao: 'Revogação de consentimento',
}

// Espelha apps/incidentes/models.py Etapa — mesmos 6 estágios.
export const ETAPA_LABEL: Record<string, string> = {
  registrado: 'Registrado',
  avaliando_risco: 'Avaliando risco',
  comunicando: 'Comunicando ANPD/titular',
  complementando: 'Complementando',
  encerrado: 'Encerrado',
  encerrado_sem_notificacao: 'Encerrado sem notificação',
}

export function labelEtapa(etapa: string): string {
  return ETAPA_LABEL[etapa] ?? etapa
}

export function labelTipoDireito(tipo: string): string {
  return TIPO_DIREITO_LABEL[tipo] ?? tipo
}

// Espelha apps/solicitacoes/models.py SolicitacaoTitular.Status.
export const STATUS_SOLICITACAO_LABEL: Record<string, string> = {
  recebida: 'Recebida',
  em_analise: 'Em análise',
  respondida: 'Respondida',
  negada: 'Negada',
}

export function labelStatusSolicitacao(status: string): string {
  return STATUS_SOLICITACAO_LABEL[status] ?? status
}

export function labelItemFila(item: ItemFila): string {
  if (item.tipo === 'incidente') {
    return `Incidente #${item.objeto.id} — ${labelEtapa(item.objeto.etapa)}`
  }
  return `Solicitação #${item.objeto.id} — ${labelTipoDireito(item.objeto.tipo_direito)}`
}
