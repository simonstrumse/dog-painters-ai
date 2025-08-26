"use client"
import { useEffect, useState } from 'react'
import { getClientApp } from '@/lib/firebaseClient'

type Props = {
  imageId: string
  initialCount?: number
}

export default function FavoriteHeart({ imageId, initialCount = 0 }: Props) {
  const [count, setCount] = useState(initialCount)
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const client = getClientApp()
        const u = client?.auth?.currentUser
        if (!u) return
        const idToken = await u.getIdToken()
        const resp = await fetch('/api/is-favorited', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken, imageId }) })
        if (resp.ok) {
          const json = await resp.json()
          setFav(Boolean(json.favorited))
          if (typeof json.count === 'number') setCount(json.count)
        }
      } catch {}
    }
    check()
  }, [imageId])

  const toggle = async () => {
    setLoading(true)
    try {
      const client = getClientApp()
      const u = client?.auth?.currentUser
      if (!u) {
        // no-op; favoriting requires login
        return
      }
      const idToken = await u.getIdToken()
      const resp = await fetch('/api/favorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken, imageId, action: fav ? 'remove' : 'add' }) })
      if (resp.ok) {
        const json = await resp.json()
        setFav(json.favorited)
        if (typeof json.count === 'number') setCount(json.count)
      }
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <button
      type="button"
      aria-pressed={fav}
      disabled={loading}
      onClick={(e) => { e.preventDefault(); toggle() }}
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${fav ? 'bg-rose-50 text-rose-600 border-rose-200' : 'text-gray-600 hover:bg-gray-50'}`}
      title={fav ? 'Remove favorite' : 'Add to favorites'}
    >
      <span aria-hidden>❤</span>
      <span>{count}</span>
    </button>
  )
}

