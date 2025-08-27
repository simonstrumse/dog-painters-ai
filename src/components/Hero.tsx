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
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl mobile-tight sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center min-h-[80vh]">
          {/* Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-slate-800 shadow-glass mx-auto lg:mx-0 animate-pulse-glow">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI-Powered Art Generation
            </div>
            
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white drop-shadow-2xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Transform Your Dog Into{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Masterpiece Art
              </span>
            </h1>
            
            <p className="mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-lg">
              Create museum-quality portraits of your beloved pet in the styles of history's greatest artists. 
              From Van Gogh's swirls to Picasso's cubism — your dog deserves to be immortalized in art.
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 max-w-md mx-auto lg:mx-0">
              <a href="#create" className="flex-1">
                <Button size="lg" className="group w-full shadow-2xl">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="/gallery" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full shadow-2xl">
                  Explore Gallery
                </Button>
              </a>
            </div>
            
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0">
              <div className="glass p-3 sm:p-4 rounded-2xl text-center shadow-glass">
                <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">50K+</div>
                <div className="text-xs sm:text-sm text-white/80">Portraits</div>
              </div>
              <div className="glass p-3 sm:p-4 rounded-2xl text-center shadow-glass">
                <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">20+</div>
                <div className="text-xs sm:text-sm text-white/80">Styles</div>
              </div>
              <div className="glass p-3 sm:p-4 rounded-2xl text-center shadow-glass">
                <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Free</div>
                <div className="text-xs sm:text-sm text-white/80">To Start</div>
              </div>
            </div>
          </div>

          {/* Visual Examples */}
          <div className="relative mt-8 lg:mt-0">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-white shadow-glass animate-pulse-glow">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                Recent Transformations
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-3 sm:p-4 shadow-glass">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 animate-pulse rounded-xl bg-white/30" />
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                        <div className="h-12 w-12 sm:h-16 sm:w-16 animate-pulse rounded-xl bg-white/30" />
                        <div className="flex-1 min-w-0">
                          <div className="h-3 sm:h-4 w-16 sm:w-24 animate-pulse rounded bg-white/30 mb-1" />
                          <div className="h-2 sm:h-3 w-12 sm:w-16 animate-pulse rounded bg-white/20" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : generations.length > 0 ? (
                  generations.slice(0, 3).map((gen) => {
                    const ratio = (() => {
                      const s = gen.size || '1024x1536'
                      const [w, h] = s.split('x').map((n) => parseInt(n, 10))
                      if (!w || !h) return '1 / 1'
                      return `${w} / ${h}`
                    })()
                    return (
                      <div key={gen.id} className="glass rounded-2xl p-3 sm:p-4 shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl shadow-lg" style={{ aspectRatio: ratio }}>
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
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl shadow-lg" style={{ aspectRatio: ratio }}>
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
                            <div className="font-semibold text-white truncate text-sm sm:text-base drop-shadow-lg">{formatArtistName(gen.artistKey)}</div>
                            <div className="text-xs sm:text-sm text-white/80 truncate">{formatStyleName(gen.styleKey)}</div>
                          </div>
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
                    <div key={i} className="glass rounded-2xl p-3 sm:p-4 shadow-glass hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl shadow-lg">
                          <Image src={example.before} alt="Original example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                        </div>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-xl shadow-lg">
                          <Image src={example.after} alt="Transformed example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate text-sm sm:text-base drop-shadow-lg">{example.artist}</div>
                          <div className="text-xs sm:text-sm text-white/80 truncate">{example.style}</div>
                        </div>
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
