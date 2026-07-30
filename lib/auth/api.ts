import { API_URL } from '@/lib/api-url'
import type { Usuario } from './types'

export class AuthError extends Error {}

// Django exige um X-CSRFToken válido em toda requisição que muda estado
// (login/logout). O endpoint /csrf/ define o cookie e devolve o mesmo
// valor no corpo — buscamos um token fresco antes de cada chamada que
// muda estado em vez de fazer parsing de cookie no cliente.
async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/csrf/`, { credentials: 'include' })
  if (!res.ok) throw new AuthError('Não foi possível preparar o login (CSRF).')
  const data = (await res.json()) as { csrfToken: string }
  return data.csrfToken
}

export async function login(username: string, password: string): Promise<Usuario> {
  const csrfToken = await getCsrfToken()
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    throw new AuthError('Usuário ou senha inválidos.')
  }
  return (await res.json()) as Usuario
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken()
  await fetch(`${API_URL}/api/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRFToken': csrfToken },
  })
}

// Fail-closed: qualquer coisa que não seja um 200 com corpo válido vira
// "não autenticado" — nunca assumimos sessão válida na dúvida (rede fora,
// 401, 403, JSON malformado etc. tratam-se todos como null).
export async function fetchMe(): Promise<Usuario | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/me/`, { credentials: 'include' })
    if (!res.ok) return null
    return (await res.json()) as Usuario
  } catch {
    return null
  }
}
