import type { StatusTom } from '@/lib/status'
import type { Perfil, StatusAvaliacao } from './types'

export const STATUS_AVALIACAO_LABEL: Record<StatusAvaliacao, string> = {
  aplicado: 'Aplicado',
  parcial: 'Parcial',
  nao_aplicado: 'Não aplicado',
  nao_se_aplica: 'Não se aplica',
}

// Ordem de exibição do controle segmentado — não é a ordem alfabética
// nem a do enum do model, é a ordem de leitura (melhor -> pior -> N/A).
export const ORDEM_STATUS_AVALIACAO: StatusAvaliacao[] = [
  'aplicado',
  'parcial',
  'nao_aplicado',
  'nao_se_aplica',
]

export function tomPorStatusAvaliacao(status: StatusAvaliacao): StatusTom {
  switch (status) {
    case 'aplicado':
      return 'ok'
    case 'parcial':
      return 'atencao'
    case 'nao_aplicado':
      return 'critico'
    case 'nao_se_aplica':
      return 'neutro'
  }
}

export const GRAU_LABEL: Record<Perfil, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export interface NotaCobertura {
  nota: number | null
  avaliados: number
  total: number
}

// Regra combinada (revisão do plano): avaliados === 0 nunca mostra
// número — "0/100" com zero avaliação parece nota real e não é. Só
// aparece número quando há avaliação de verdade por trás; cobertura
// parcial some quando 100% do perfil já foi avaliado (nota deixa de ser
// provisória).
export function descricaoNota(info: NotaCobertura): { texto: string; cobertura?: string } {
  if (info.avaliados === 0) {
    return { texto: 'Não avaliado' }
  }
  const texto = info.nota === null ? '—' : `${info.nota.toFixed(0)}/100`
  const cobertura =
    info.avaliados < info.total
      ? `${info.avaliados} de ${info.total} controles avaliados`
      : undefined
  return { texto, cobertura }
}
