'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { login, AuthError } from '@/lib/auth/api'
import { PAPEIS_COCKPIT } from '@/lib/auth/types'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      const usuario = await login(username, password)
      router.push(PAPEIS_COCKPIT.includes(usuario.papel) ? '/cockpit' : '/portal')
    } catch (err) {
      setErro(err instanceof AuthError ? err.message : 'Não foi possível entrar. Tente de novo.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-md"
      >
        <h1 className="font-serif text-2xl text-foreground">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ogway — encarregado e clientes</p>

        <label htmlFor="username" className="mt-6 block text-sm font-medium text-foreground">
          Usuário
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <label htmlFor="password" className="mt-4 block text-sm font-medium text-foreground">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {erro && (
          <p role="alert" className="mt-4 text-sm font-medium text-status-critico">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="mt-6 w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {carregando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
