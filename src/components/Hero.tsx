"use client"
import { useEffect, useState } from 'react'

type Generation = {
  id: string
  imageUrl: string
  originalImageUrl: string
  artistKey: string
  styleKey: string
}

export default function Hero() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestGenerations = async () => {
      try {
        const response = await fetch('/api/latest-generations')
        if (response.ok) {
          const data = await response.json()
          setGenerations(data.generations || [])
        }
      } catch (error) {
        console.error('Failed to fetch latest generations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestGenerations()
  }, [])
  return (
    <section className="relative overflow-hidden rounded-xl border bg-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-100" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-blue-50" />
      </div>
      <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Museum‑Quality Dog Portraits
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-prose">
            Transform your dog photos into stunning portraits in the styles of the great masters — from Van Gogh to Hokusai. Generate, share, and order framed prints.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#create" className="inline-flex items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-white font-medium hover:bg-blue-800">Create Your Portrait</a>
            <a href="/gallery" className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 font-medium hover:bg-gray-50">Explore Gallery</a>
          </div>
          <div className="text-sm text-gray-600">No design skills needed. Keep your dog's unique markings — just add art.</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 self-center">
          {loading ? (
            // Loading placeholders
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg border bg-gray-100 animate-pulse shadow-sm" />
            ))
          ) : generations.length > 0 ? (
            // Live generations
            generations.slice(0, 6).map((gen, i) => (
              <div key={gen.id} className="aspect-square rounded-lg border overflow-hidden shadow-sm group relative">
                <img 
                  src={gen.imageUrl} 
                  alt={`${gen.artistKey} style`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-1 left-1 right-1 bg-white/90 text-xs px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {gen.artistKey} • {gen.styleKey}
                </div>
              </div>
            ))
          ) : (
            // Fallback to placeholder images if no generations available
            [
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1542060748-10c28b62716d?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop'
            ].map((url, i) => (
              <div key={i} className="aspect-square rounded-lg border shadow-sm" style={{backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

