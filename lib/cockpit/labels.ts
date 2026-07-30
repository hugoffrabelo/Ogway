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

const ETAPA_LABEL: Record<string, string> = {
  comunicando: 'Comunicando ANPD/titular',
  complementando: 'Complementando',
}

export function labelItemFila(item: ItemFila): string {
  if (item.tipo === 'incidente') {
    const etapa = ETAPA_LABEL[item.objeto.etapa] ?? item.objeto.etapa
    return `Incidente #${item.objeto.id} — ${etapa}`
  }
  const tipo = TIPO_DIREITO_LABEL[item.objeto.tipo_direito] ?? item.objeto.tipo_direito
  return `Solicitação #${item.objeto.id} — ${tipo}`
}
