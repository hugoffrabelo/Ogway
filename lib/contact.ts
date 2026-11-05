// Destinos do formulário de contato da landing (components/contact.tsx), da
// autoavaliação (components/autoavaliacao/questionario.tsx) e e-mail do
// encarregado no aviso de privacidade (app/privacidade/page.tsx).
// Vêm de variáveis de build porque o GitHub Pages é estático — ver
// .env.example. Vazios = os formulários mostram erro em vez de fingir envio.
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? ''
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''

/**
 * Envia um lead, em ordem de preferência:
 * 1. CONTACT_ENDPOINT — serviço de formulário (Formspree, Getform, endpoint
 *    próprio) que aceita POST JSON. Funciona no export estático.
 * 2. CONTACT_EMAIL — abre o cliente de e-mail do visitante com a mensagem
 *    já escrita (mailto:).
 * Sem nenhum dos dois, lança erro: quem chama mostra a falha em vez de
 * fingir sucesso.
 */
export async function enviarLead(
  dados: Record<string, string>,
  mailto: { assunto: string; corpo: string },
): Promise<'sent' | 'mailto'> {
  if (CONTACT_ENDPOINT) {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(dados),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return 'sent'
  }
  if (CONTACT_EMAIL) {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailto.assunto)}&body=${encodeURIComponent(mailto.corpo)}`
    return 'mailto'
  }
  throw new Error('Nenhum destino de contato configurado')
}
