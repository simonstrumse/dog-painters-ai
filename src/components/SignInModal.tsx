"use client"
import { useEffect, useState } from 'react'
import { getClientApp } from '@/lib/firebaseClient'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { Button } from './ui/button'

type Props = {
  onSuccess?: () => void
}

export default function SignInModal({ onSuccess }: Props) {
  const [client, setClient] = useState<any>(null)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [resetStatus, setResetStatus] = useState<string | null>(null)

  useEffect(() => {
    try { setClient(getClientApp()) } catch {}
  }, [])

  useEffect(() => {
    const auth = client?.auth
    if (!auth) return
    const unsub = auth.onAuthStateChanged((u: any) => { if (u && onSuccess) onSuccess() })
    return () => unsub && unsub()
  }, [client, onSuccess])

  const googleSignIn = async () => {
    if (!client?.auth || !client?.GoogleProvider) return
    setBusy(true); setError(null)
    try {
      await signInWithPopup(client.auth, client.GoogleProvider)
      onSuccess && onSuccess()
    } catch (e: any) {
      setError(e?.message || 'Failed to sign in')
    } finally { setBusy(false) }
  }

  const emailAction = async () => {
    if (!client?.auth) return
    setBusy(true); setError(null)
    try {
      if (mode === 'signin') await signInWithEmailAndPassword(client.auth, email, password)
      else await createUserWithEmailAndPassword(client.auth, email, password)
      onSuccess && onSuccess()
    } catch (e: any) {
      setError(e?.message || 'Authentication error')
    } finally { setBusy(false) }
  }

  const resetPassword = async () => {
    if (!client?.auth) return
    setBusy(true); setError(null); setResetStatus(null)
    try {
      if (!email) {
        setError('Enter your email to reset your password')
        return
      }
      await sendPasswordResetEmail(client.auth, email)
      setResetStatus('Password reset email sent. Check your inbox.')
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset email')
    } finally { setBusy(false) }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Sign in to create your painting</h3>
        <p className="text-sm text-gray-600">Save your progress, publish to the gallery, and request framed prints.</p>
        <Button className="w-full" disabled={busy} onClick={googleSignIn}>Continue with Google</Button>
        <div className="relative text-center">
          <span className="px-2 bg-white text-xs text-gray-500">or</span>
          <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-gray-200" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            className={`px-3 py-1.5 rounded ${mode==='signin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('signin')}
            disabled={busy}
          >Sign in</button>
          <button
            className={`px-3 py-1.5 rounded ${mode==='signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('signup')}
            disabled={busy}
          >Create account</button>
        </div>
        <div className="space-y-2">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
          />
          <input
            type="password"
            autoComplete={mode==='signin' ? 'current-password' : 'new-password'}
            placeholder="Password"
            className="w-full rounded border px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
          />
          <div className="flex items-center justify-between text-xs">
            {error ? <div className="text-red-600">{error}</div> : <span />}
            {mode === 'signin' && (
              <button
                type="button"
                onClick={resetPassword}
                disabled={busy}
                className="text-blue-700 hover:underline disabled:opacity-50"
              >Forgot password?</button>
            )}
          </div>
          {resetStatus && <div className="text-xs text-green-700">{resetStatus}</div>}
          <Button className="w-full" disabled={busy || !email || !password} onClick={emailAction}>
            {mode === 'signin' ? 'Sign in with email' : 'Create account with email'}
          </Button>
          <div className="text-[11px] text-gray-500">By continuing, you agree to our terms and acknowledge our privacy policy.</div>
        </div>
      </div>
      <div className="hidden md:block border-l pl-6 text-sm text-gray-700">
        <div className="font-medium mb-2">You’ll be able to:</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Publish to the public gallery</li>
          <li>Save and favorite portraits</li>
          <li>Request framed prints</li>
        </ul>
      </div>
    </div>
  )
}
