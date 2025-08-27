"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getClientApp } from '@/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import FavoriteHeart from '@/components/FavoriteHeart'

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
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [myFavorites, setMyFavorites] = useState<Set<string>>(new Set())
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
      const all = json.items as Item[]
      let filtered = all
      if (favoritesOnly) {
        const favIds = await fetchMyFavorites()
        filtered = all.filter((it) => favIds.has(it.id))
      }
      setItems(filtered)
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyFavorites = async (): Promise<Set<string>> => {
    try {
      if (!auth?.currentUser) return new Set()
      const idToken = await auth.currentUser.getIdToken()
      const resp = await fetch('/api/my-favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) })
      if (!resp.ok) return new Set()
      const json = await resp.json()
      const ids = new Set<string>((json.imageIds as string[]) || [])
      setMyFavorites(ids)
      return ids
    } catch {
      return new Set()
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
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={favoritesOnly} onChange={async (e) => { setFavoritesOnly(e.target.checked); await fetchItems() }} />
            Favorites only
          </label>
          <Button variant="outline" onClick={fetchItems}>Refresh</Button>
        </div>
      </div>
      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {!loading && items.length === 0 && <div className="text-gray-600">No items yet. Publish some results to see them here.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="space-y-2">
            {/* Image without frame for personal gallery */}
            {/* Wall box keeps plaques aligned; inner frame follows true image aspect */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '2 / 3' }}>
              {(() => {
                const s = it.size || '1024x1536'
                const [w, h] = String(s).split('x').map((n) => parseInt(n, 10))
                const isLandscape = (w && h) ? w > h : false
                const frameStyle: React.CSSProperties = {
                  aspectRatio: (w && h) ? `${w} / ${h}` : '2 / 3',
                  width: isLandscape ? '100%' : 'auto',
                  height: isLandscape ? 'auto' : '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }
                return (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-gray-300 rounded-lg shadow-md bg-white" style={frameStyle}>
                      <div className="relative w-full h-full">
                        <Image
                          src={it.imageUrl}
                          alt={`${formatArtistName(it.artistKey)} — ${formatStyleName(it.styleKey)}`}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                          className="object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>
                )
              })()}
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
                <div className="pt-2">
                  <FavoriteHeart imageId={it.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
