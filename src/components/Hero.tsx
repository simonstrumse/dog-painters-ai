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
        <div className="space-y-3">
          <div className="text-xs text-gray-500 text-center">Recent transformations</div>
          <div className="grid gap-3">
            {loading ? (
              // Loading placeholders
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border bg-gray-100 animate-pulse shadow-sm" />
                  <div className="text-gray-400">→</div>
                  <div className="w-16 h-16 rounded-lg border bg-gray-100 animate-pulse shadow-sm" />
                </div>
              ))
            ) : generations.length > 0 ? (
              // Live before/after pairs
              generations.slice(0, 3).map((gen, i) => (
                <div key={gen.id} className="flex items-center gap-3 group">
                  {/* Original (before) */}
                  <div className="w-16 h-16 rounded-lg border overflow-hidden shadow-sm">
                    <img 
                      src={gen.originalImageUrl} 
                      alt="Original dog photo"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors text-lg">→</div>
                  
                  {/* Generated (after) */}
                  <div className="w-16 h-16 rounded-lg border overflow-hidden shadow-sm relative">
                    <img 
                      src={gen.imageUrl} 
                      alt={`${gen.artistKey} style`}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  
                  {/* Style label */}
                  <div className="text-xs text-gray-600 min-w-0 flex-1">
                    <div className="font-medium truncate">{gen.artistKey}</div>
                    <div className="text-gray-400 truncate">{gen.styleKey}</div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to example transformations
              [
                { before: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=200&auto=format&fit=crop', artist: 'Van Gogh', style: 'Starry Night' },
                { before: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1542060748-10c28b62716d?q=80&w=200&auto=format&fit=crop', artist: 'Picasso', style: 'Blue Period' },
                { before: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop', artist: 'Monet', style: 'Water Lilies' }
              ].map((example, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-16 h-16 rounded-lg border shadow-sm" style={{backgroundImage: `url(${example.before})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors text-lg">→</div>
                  <div className="w-16 h-16 rounded-lg border shadow-sm" style={{backgroundImage: `url(${example.after})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
                  <div className="text-xs text-gray-600 min-w-0 flex-1">
                    <div className="font-medium">{example.artist}</div>
                    <div className="text-gray-400">{example.style}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

