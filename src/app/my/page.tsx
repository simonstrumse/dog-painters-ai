"use client"
import { useEffect, useMemo, useState } from 'react'
import { getClientApp } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'

type Item = {
  id: string
  imageUrl: string
  artistKey: string
  styleKey: string
  createdAt?: string
}

export const dynamic = 'force-dynamic'

export default function MyGalleryPage() {
  const client = useMemo(() => (typeof window !== 'undefined' ? getClientApp() : null), [])
  const auth = client?.auth
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const user = auth?.currentUser ?? null

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!auth) {
        setError('Please sign in to view your gallery')
        return
      }
      const u = auth.currentUser
      if (!u) throw new Error('Please sign in to view your gallery')
      const idToken = await u.getIdToken()
      const resp = await fetch('/api/my-gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) })
      if (!resp.ok) throw new Error(await resp.text())
      const json = await resp.json()
      setItems(json.items as Item[])
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth) return
    const unsub = auth.onAuthStateChanged(() => fetchItems())
    return () => unsub()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  if (!user) {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl font-bold">My Gallery</h1>
        <div className="text-gray-600">Sign in to view your published portraits.</div>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Gallery</h1>
        <Button variant="outline" onClick={fetchItems}>Refresh</Button>
      </div>
      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {!loading && items.length === 0 && <div className="text-gray-600">No items yet. Publish some results to see them here.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="border rounded-md overflow-hidden">
            <img src={it.imageUrl} alt={`${it.artistKey}-${it.styleKey}`} className="w-full h-80 object-cover" />
            <div className="p-2 text-sm flex items-center justify-between">
              <div className="truncate">{it.artistKey} • {it.styleKey}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
