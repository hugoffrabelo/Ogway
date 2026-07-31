import { z } from 'zod'

// Validação no cliente é conveniência (feedback imediato); o backend
// continua a autoridade — ApiValidationError sempre é respeitado por
// cima do que o zod deixou passar (ver lib/forms/use-entidade-form).

export const operadorSchema = z.object({
  nome: z.string().min(1, 'Obrigatório.'),
  servico: z.string(),
  dpa_assinado: z.boolean(),
  dpa_vencimento: z.string(),
  pais: z.string().length(2, 'Use o código de 2 letras (ex.: BR, US).'),
  nivel_risco: z.enum(['baixo', 'medio', 'alto'], { message: 'Selecione um nível.' }),
})
export type OperadorFormValues = z.infer<typeof operadorSchema>

export const atividadeSchema = z.object({
  nome: z.string().min(1, 'Obrigatório.'),
  finalidade: z.string().min(1, 'Obrigatório.'),
  base_legal: z.string().min(1, 'Selecione uma base legal.'),
  // M2M obrigatório no model (sem blank=True) — precisa de ao menos um.
  categorias_dados: z.array(z.string()).min(1, 'Selecione ao menos uma categoria de dado.'),
  categorias_titulares: z.array(z.string()).min(1, 'Selecione ao menos uma categoria de titular.'),
  retencao: z.string().min(1, 'Obrigatório.'),
  nivel_risco: z.enum(['baixo', 'medio', 'alto'], { message: 'Selecione um nível.' }),
  // operadores tem blank=True no model — opcional.
  operadores: z.array(z.string()),
  transferencia_internacional: z.boolean(),
  ativo: z.boolean(),
})
export type AtividadeFormValues = z.infer<typeof atividadeSchema>
