import { useState } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { ApiValidationError } from '@/lib/api-client'

// §4.4 da doc de frontend — "erro de validação do backend aparece no
// campo correspondente, nunca em toast genérico." zod valida no
// cliente pra feedback imediato (cada formulário chama
// useForm+zodResolver diretamente, com tipos concretos — envolver isso
// num hook genérico quebra a inferência de overload do zodResolver);
// este hook só cuida do que sobra: mapear ApiValidationError (400 do
// DRF) de volta pros campos, mesmo que o zod já tenha deixado passar.
export function useEntidadeSubmit<T extends FieldValues>(form: UseFormReturn<T>) {
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  async function enviar(acao: () => Promise<unknown>): Promise<boolean> {
    setErroGeral(null)
    try {
      await acao()
      return true
    } catch (err) {
      if (err instanceof ApiValidationError) {
        let restou = false
        for (const [campo, mensagens] of Object.entries(err.fields)) {
          if (campo === 'non_field_errors') {
            setErroGeral(mensagens[0])
          } else {
            form.setError(campo as Path<T>, { message: mensagens[0] })
            restou = true
          }
        }
        if (!restou && Object.keys(err.fields).length === 0) {
          setErroGeral('Não foi possível salvar. Verifique os dados e tente de novo.')
        }
      } else {
        setErroGeral(err instanceof Error ? err.message : 'Erro desconhecido.')
      }
      return false
    }
  }

  return { enviar, erroGeral }
}
