import type { StatusTom } from '@/lib/status'
import type { NivelRisco } from './types'

export const NIVEL_RISCO_LABEL: Record<NivelRisco, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
  critico: 'Crítico',
}

// alto e crítico usam o mesmo tom (não há um quinto tom de status) —
// o texto do label já diferencia os dois, que é a regra de acessibilidade
// (nunca só cor).
export function tomPorNivelRisco(nivel: NivelRisco): StatusTom {
  if (nivel === 'baixo') return 'ok'
  if (nivel === 'medio') return 'atencao'
  return 'critico'
}
