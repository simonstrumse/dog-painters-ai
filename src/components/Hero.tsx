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
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                <Sparkles className="h-4 w-4" />
                AI Art Generation
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Transform Your Dog Into Art
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create beautiful portraits of your pet in the styles of famous artists
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#create">
                <Button size="lg" className="w-full sm:w-auto">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </a>
              <a href="/gallery">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Gallery
                </Button>
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-500">Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">20+</div>
                <div className="text-sm text-gray-500">Styles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">Free</div>
                <div className="text-sm text-gray-500">To Start</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Transformations</h2>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Live examples
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                    <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200" />
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
                    <div key={gen.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg" style={{ aspectRatio: ratio }}>
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
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg" style={{ aspectRatio: ratio }}>
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
                        <div className="font-medium text-gray-900 truncate">{formatArtistName(gen.artistKey)}</div>
                        <div className="text-sm text-gray-500 truncate">{formatStyleName(gen.styleKey)}</div>
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
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image src={example.before} alt="Original example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image src={example.after} alt="Transformed example" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={80} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{example.artist}</div>
                      <div className="text-sm text-gray-500">{example.style}</div>
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