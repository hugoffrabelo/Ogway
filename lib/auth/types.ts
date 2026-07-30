// Espelha apps/core/models.py Usuario.Papel e UsuarioSerializer no backend.
// Qualquer mudança nos dois lados precisa ser feita junto.
export type Papel = 'encarregado' | 'substituto' | 'equipe' | 'cliente_leitor'

export const PAPEIS_COCKPIT: readonly Papel[] = ['encarregado', 'substituto', 'equipe']
export const PAPEIS_PORTAL: readonly Papel[] = ['cliente_leitor']

export interface Usuario {
  id: number
  username: string
  papel: Papel
  org: number | null
  mfa_ativo: boolean
  orgs_permitidos: number[]
}
