"use client"
import { getClientApp } from '@/lib/firebaseClient'
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

export default function AuthButtons() {
  const [client, setClient] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [showEmail, setShowEmail] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Firebase client after component mounts
    const initClient = () => {
      try {
        const clientApp = getClientApp()
        setClient(clientApp)
        if (clientApp?.auth) {
          setUser(clientApp.auth.currentUser)
          return clientApp.auth.onAuthStateChanged((u: any) => {
            setUser(u)
            setLoading(false)
          })
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        setLoading(false)
      }
    }

    const unsubscribe = initClient()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (!client) {
    return <div className="text-sm text-red-500">Auth unavailable</div>
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={async () => {
            try {
              if (client?.auth && client?.GoogleProvider) {
                await signInWithPopup(client.auth, client.GoogleProvider)
              }
            } catch (error) {
              console.error('Google sign-in error:', error)
              setErr('Failed to sign in with Google')
            }
          }}
        >
          Google
        </Button>
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
                    if (!client?.auth) throw new Error('Authentication not available')
                    if (mode === 'signin') await signInWithEmailAndPassword(client.auth, email, password)
                    else await createUserWithEmailAndPassword(client.auth, email, password)
                    setShowEmail(false)
                    setEmail('')
                    setPassword('')
                  } catch (e: any) {
                    console.error('Email auth error:', e)
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
      <Button 
        variant="outline" 
        onClick={async () => {
          try {
            if (client?.auth) {
              await signOut(client.auth)
            }
          } catch (error) {
            console.error('Sign out error:', error)
          }
        }}
      >
        Sign out
      </Button>
    </div>
  )
}
