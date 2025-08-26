"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getClientApp } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'

type Item = {
  id: string
  imageUrl: string
  artistKey: string
  styleKey: string
  size?: string
  createdAt?: string
}

export default function MyGalleryPage() {
  const client = getClientApp()
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
        setError('Authentication not available')
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
    const unsub = auth.onAuthStateChanged((_: any) => fetchItems())
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="space-y-2">
            {/* Image without frame for personal gallery */}
            <div className="border-2 border-gray-300 rounded-lg shadow-md overflow-hidden bg-white">
              <div className="relative overflow-hidden" style={{ aspectRatio: (() => { const s=it.size||'1024x1536'; const [w,h]=String(s).split('x').map((n)=>parseInt(n,10)); return (w&&h)? `${w} / ${h}` : '2 / 3' })() }}>
                <Image 
                  src={it.imageUrl} 
                  alt={`${it.artistKey}-${it.styleKey}`} 
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-contain" 
                />
              </div>
            </div>
            {/* Gallery-style plaque */}
            <div className="bg-white border shadow-sm rounded-lg p-3 mx-2">
              <div className="text-center space-y-1">
                <div className="font-serif text-sm font-medium text-gray-900">
                  {formatArtistName(it.artistKey)}
                </div>
                <div className="text-xs text-gray-600 italic">
                  {formatStyleName(it.styleKey)}
                </div>
                {it.createdAt && (
                  <div className="text-xs text-gray-500 border-t pt-1 mt-2">
                    {new Date(it.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
