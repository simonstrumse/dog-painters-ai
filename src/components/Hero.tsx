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
    <div className="bg-gradient-to-br from-green-50 via-white to-green-50/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        {/* Main Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 mb-6">
            <Sparkles className="h-4 w-4" />
            AI Portrait Studio
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transform Your Dog Into{' '}
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Masterpiece Art
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional AI-powered portraits in the styles of history's greatest artists. 
            Perfect for gifts, home décor, and celebrating your beloved pet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#create">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                <ImageIcon className="mr-2 h-5 w-5" />
                Create Portrait Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/gallery">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Browse Gallery
              </Button>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Happy Pet Parents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">20+</div>
              <div className="text-sm text-gray-600 font-medium">Art Styles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">4.9★</div>
              <div className="text-sm text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Free</div>
              <div className="text-sm text-gray-600 font-medium">To Get Started</div>
            </div>
          </div>
        </div>

        {/* Recent Transformations */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Transformations</h2>
            <div className="inline-flex items-center gap-2 text-green-600 font-medium">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Live from our community
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 lg:gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 animate-pulse rounded-2xl bg-green-200" />
                      <ArrowRight className="h-6 w-6 text-green-400" />
                      <div className="h-16 w-16 animate-pulse rounded-2xl bg-green-200" />
                      <div className="flex-1">
                        <div className="h-5 w-24 animate-pulse rounded bg-green-200 mb-2" />
                        <div className="h-4 w-20 animate-pulse rounded bg-green-200" />
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
                    <div key={gen.id} className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-6 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-green-200" style={{ aspectRatio: ratio }}>
                          <Image
                            src={gen.originalImageUrl}
                            alt="Original"
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            quality={90}
                          />
                        </div>
                        <ArrowRight className="h-6 w-6 text-green-500" />
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-green-300" style={{ aspectRatio: ratio }}>
                          <Image
                            src={gen.imageUrl}
                            alt={`${formatArtistName(gen.artistKey)} style`}
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            quality={90}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-lg truncate">{formatArtistName(gen.artistKey)}</div>
                          <div className="text-green-600 font-medium truncate">{formatStyleName(gen.styleKey)}</div>
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
                  <div key={i} className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-6">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-green-200">
                        <Image src={example.before} alt="Original example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={90} />
                      </div>
                      <ArrowRight className="h-6 w-6 text-green-500" />
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-green-300">
                        <Image src={example.after} alt="Transformed example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={90} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-lg">{example.artist}</div>
                        <div className="text-green-600 font-medium">{example.style}</div>
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
  )
}