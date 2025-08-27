"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/blurData'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import { Button } from './ui/button'
import { Sparkles, ArrowRight, ImageIcon } from 'lucide-react'

type Generation = {
  id: string
  imageUrl: string
  originalImageUrl: string
  artistKey: string
  styleKey: string
  size?: string
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              AI-Powered Art Generation
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
              Transform Your Dog Into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Masterpiece Art
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-slate-600 lg:text-xl">
              Create museum-quality portraits of your beloved pet in the styles of history's greatest artists. 
              From Van Gogh's swirls to Picasso's cubism — your dog deserves to be immortalized in art.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group" asChild>
                <a href="#create">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/gallery">Explore Gallery</a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-8">
              <div className="text-sm text-slate-500">
                <div className="font-semibold text-slate-900">50,000+</div>
                Portraits Created
              </div>
              <div className="text-sm text-slate-500">
                <div className="font-semibold text-slate-900">20+</div>
                Artist Styles
              </div>
              <div className="text-sm text-slate-500">
                <div className="font-semibold text-slate-900">Free</div>
                To Start
              </div>
            </div>
          </div>

          {/* Visual Examples */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl"></div>
            
            <div className="relative space-y-6">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  Recent Transformations
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm">
                      <div className="h-16 w-16 animate-pulse rounded-lg bg-slate-200" />
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      <div className="h-16 w-16 animate-pulse rounded-lg bg-slate-200" />
                      <div className="flex-1">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                        <div className="mt-1 h-3 w-16 animate-pulse rounded bg-slate-200" />
                      </div>
                    </div>
                  ))
                ) : generations.length > 0 ? (
                  generations.slice(0, 3).map((gen, idx) => {
                    const ratio = (() => {
                      const s = gen.size || '1024x1536'
                      const [w, h] = s.split('x').map((n) => parseInt(n, 10))
                      if (!w || !h) return '1 / 1'
                      return `${w} / ${h}`
                    })()
                    return (
                      <div key={gen.id} className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg" style={{ aspectRatio: ratio }}>
                          <Image
                            src={gen.originalImageUrl}
                            alt="Original"
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            quality={80}
                          />
                        </div>
                        <ArrowRight className="h-5 w-5 text-blue-500" />
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg" style={{ aspectRatio: ratio }}>
                          <Image
                            src={gen.imageUrl}
                            alt={`${formatArtistName(gen.artistKey)} style`}
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            quality={80}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{formatArtistName(gen.artistKey)}</div>
                          <div className="text-sm text-slate-500 truncate">{formatStyleName(gen.styleKey)}</div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  [
                    { before: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=200&auto=format&fit=crop', artist: 'Van Gogh', style: 'Starry Night' },
                    { before: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1542060748-10c28b62716d?q=80&w=200&auto=format&fit=crop', artist: 'Picasso', style: 'Blue Period' },
                    { before: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop', after: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop', artist: 'Monet', style: 'Water Lilies' },
                  ].map((example, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm shadow-sm">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <Image src={example.before} alt="Original example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-500" />
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <Image src={example.after} alt="Transformed example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900">{example.artist}</div>
                        <div className="text-sm text-slate-500">{example.style}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
