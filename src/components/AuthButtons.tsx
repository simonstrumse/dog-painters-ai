"use client"
import { getClientApp } from '@/lib/firebaseClient'
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { Button } from './ui/button'
import { useEffect, useMemo, useState } from 'react'

export default function AuthButtons() {
  const client = useMemo(() => (typeof window !== 'undefined' ? getClientApp() : null), [])
  const auth = client?.auth
  const GoogleProvider = client?.GoogleProvider
  const [user, setUser] = useState(auth?.currentUser ?? null)
  const [showEmail, setShowEmail] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    if (!auth) return
    return auth.onAuthStateChanged((u) => setUser(u))
  }, [auth])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => auth && GoogleProvider && signInWithPopup(auth, GoogleProvider)}>Google</Button>
        <Button variant="outline" onClick={() => setShowEmail((v) => !v)}>Email</Button>
        {showEmail && (
          <div className="absolute right-4 top-14 z-50 w-64 rounded-md border bg-white p-3 shadow">
            <div className="flex items-center gap-3 mb-2 text-sm">
              <button className={`px-2 py-1 rounded ${mode==='signin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode('signin')}>Sign in</button>
              <button className={`px-2 py-1 rounded ${mode==='signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode('signup')}>Sign up</button>
            </div>
            <div className="space-y-2">
              <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="w-full rounded border px-2 py-1 text-sm" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {err && <div className="text-xs text-red-600">{err}</div>}
              <Button
                className="w-full"
                onClick={async () => {
                  setErr(null)
                  try {
                    if (!auth) throw new Error('Auth not ready')
                    if (mode === 'signin') await signInWithEmailAndPassword(auth, email, password)
                    else await createUserWithEmailAndPassword(auth, email, password)
                    setShowEmail(false)
                  } catch (e: any) {
                    setErr(e?.message || 'Auth error')
                  }
                }}
              >{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
            </div>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-700">{user.displayName || user.email}</div>
      <Button variant="outline" onClick={() => auth && signOut(auth)}>Sign out</Button>
    </div>
  )
}
