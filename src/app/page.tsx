"use client"
import { useMemo, useState, useEffect } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import { IS_MODERN } from '@/lib/flags'
import StylePicker from '@/components/StylePicker'
import type { GeneratedImage, StyleSelection } from '@/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/blurData'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientApp } from '@/lib/firebaseClient'
import Hero from '@/components/Hero'
import Modal from '@/components/ui/modal'
import FramePreview from '@/components/FramePreview'
import HowItWorks from '@/components/HowItWorks'
import TrustBadges from '@/components/TrustBadges'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import OnboardingOverlay from '@/components/OnboardingOverlay'
import SignInModal from '@/components/SignInModal'
import { Sparkles } from 'lucide-react'

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [selections, setSelections] = useState<StyleSelection[]>([])
  const [dogName, setDogName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0)
  const [results, setResults] = useState<GeneratedImage[]>([])
  const [size, setSize] = useState<'1024x1024' | '1024x1536' | '1536x1024'>('1024x1536')
  const [publish, setPublish] = useState(true) // Always publish for free users
  const [printOpen, setPrintOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [printImage, setPrintImage] = useState<string | null>(null)
  const [frame, setFrame] = useState<'black' | 'walnut' | 'white'>('black')
  const [printSize, setPrintSize] = useState<'8x10' | '12x16' | '18x24'>('12x16')
  const [generationStatus, setGenerationStatus] = useState<{
    used: number
    remaining: number
    dailyLimit: number
    resetTime: string
  } | null>(null)

  const canGenerate = useMemo(() => {
    const hasFilesAndSelections = files.length > 0 && selections.length > 0 && !loading
    const hasGenerationsLeft = !generationStatus || generationStatus.remaining > 0
    return hasFilesAndSelections && hasGenerationsLeft
  }, [files, selections, loading, generationStatus])

  // Prevent accidental tab closure during generation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault()
        e.returnValue = 'Your portraits are still being generated. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    if (loading) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [loading])

  // Fetch generation status
  const fetchGenerationStatus = async () => {
    try {
      const client = getClientApp()
      if (!client?.auth) return
      const user = client.auth.currentUser
      if (!user) return
      
      const token = await user.getIdToken()
      const resp = await fetch('/api/generation-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      })
      
      if (resp.ok) {
        const status = await resp.json()
        setGenerationStatus(status)
      }
    } catch (e) {
      console.error('Failed to fetch generation status:', e)
    }
  }

  // Fetch generation status when user signs in or component mounts
  useEffect(() => {
    const client = getClientApp()
    if (!client?.auth) return
    
    const unsubscribe = client.auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGenerationStatus()
        setLoginOpen(false)
      } else {
        setGenerationStatus(null)
      }
    })
    
    return () => unsubscribe()
  }, [])

  const onGenerate = async () => {
    setLoading(true)
    setResults([])
    setLoadingProgress(0)
    
    // Estimate total time based on number of images and styles
    const totalGenerations = files.length * selections.length
    const estimatedTotalTime = totalGenerations * 35 // ~35 seconds per generation
    setEstimatedTimeLeft(estimatedTotalTime)
    
    // Start progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = Math.min(prev + (100 / estimatedTotalTime), 95)
        return newProgress
      })
      setEstimatedTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    
    try {
      // Add dog name to all selections
      const selectionsWithDogName = selections.map(sel => ({
        ...sel,
        dogName: dogName || undefined
      }))
      
      const body = new FormData()
      body.append('selections', JSON.stringify(selectionsWithDogName))
      body.append('size', size)
      body.append('publish', String(publish))
      // Authentication is required; if missing, open login modal instead of error
      const client = getClientApp()
      if (!client?.auth || !client.auth.currentUser) {
        setLoginOpen(true)
        return
      }
      const token = await client.auth.currentUser.getIdToken()
      body.append('idToken', token)
      for (const f of files) body.append('images', f)
      const resp = await fetch('/api/generate', { method: 'POST', body })
      if (!resp.ok) {
        const t = await resp.text()
        throw new Error(t)
      }
      const json = await resp.json()
      setResults(json.results as GeneratedImage[])
      setLoadingProgress(100)
      
      // Update generation status after successful generation
      await fetchGenerationStatus()
      
      // Auto-scroll to results after generation
      setTimeout(() => {
        const resultsElement = document.getElementById('results')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (e: any) {
      console.error('Generate failed:', e)
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
      setLoadingProgress(0)
      setEstimatedTimeLeft(0)
    }
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Dog Paintings',
            url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      {/* Service schema for LLM-friendly extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Custom Dog Paintings',
            serviceType: 'Pet portrait in classic art styles',
            provider: {
              '@type': 'Organization',
              name: 'Dog Paintings',
              url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
            },
            areaServed: 'Worldwide',
          }),
        }}
      />
      <OnboardingOverlay />
      <Hero />

      

      <section id="create" className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Custom Portrait
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional AI art generation powered by Musti's expertise in pet care
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload & Configuration Panel */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 space-y-8">
          <UploadDropzone onFiles={(f) => setFiles((prev) => [...prev, ...f])} />
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((f, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-green-200 shadow-lg">
                      <img src={URL.createObjectURL(f)} alt={`upload-${i}`} className="w-full h-full object-cover" />
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">Dog's Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Max, Luna, Charlie..."
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
            <p className="text-sm text-green-600 font-medium">✨ We'll incorporate their name into artistic titles</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">Canvas Size</label>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value as any)} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            >
              <option value="1024x1536">📱 Portrait (Ideal for mobile wallpapers)</option>
              <option value="1024x1024">⬜ Square (Perfect for social media)</option>
              <option value="1536x1024">🖥️ Landscape (Great for desktop backgrounds)</option>
            </select>
          </div>

          {/* Musti Trust Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox checked={publish} disabled />
                  <span className="font-semibold text-gray-900">Share with Musti Community</span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Help other pet parents discover amazing art styles by sharing your creation in our gallery.
                </p>
                
                {generationStatus ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${generationStatus.remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        🎨 {generationStatus.remaining} portraits remaining today
                      </span>
                      <span className="text-sm text-gray-600">
                        {generationStatus.used}/{generationStatus.dailyLimit} used
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          generationStatus.remaining > 1 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                          generationStatus.remaining === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                        }`}
                        style={{ width: `${(generationStatus.used / generationStatus.dailyLimit) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      ⏰ Resets at {new Date(generationStatus.resetTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                      {new Date(generationStatus.resetTime).toDateString() !== new Date().toDateString() ? ' tomorrow' : ''}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-green-700 font-semibold bg-green-200 rounded-xl px-4 py-2">
                    🎯 Daily limit: 3 free portraits per user
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button size="lg" onClick={onGenerate} disabled={!canGenerate} className="w-full text-lg font-bold shadow-2xl">
            {loading 
              ? '🎨 Creating Your Masterpiece...' 
              : generationStatus && generationStatus.remaining === 0 
                ? '📅 Daily Limit Reached - Try Tomorrow' 
                : '✨ Generate My Dog Portrait'
            }
          </Button>
          
          {loading && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 space-y-4 border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="text-lg font-semibold text-green-900">🎨 Creating your masterpiece...</div>
              </div>
              
              <div className="w-full bg-green-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              <div className="text-sm text-green-800 font-medium bg-green-200/50 rounded-xl px-4 py-2">
                ⚠️ Please keep this page open while we work our magic!
              </div>
            </div>
          )}

          {/* Results appear right below the generation button */}
          {results.length > 0 && (
            <div id="results" className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Generated Portraits</h3>
              {files.map((f, i) => {
                const perImage = results.filter((r) => r.originalIndex === i)
                if (perImage.length === 0) return null
                return (
                  <div key={i} className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Original #{i + 1}</div>
                    <div className="grid gap-3">
                      {perImage.map((r, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: (() => { const [w,h]=size.split('x').map(n=>parseInt(n,10)); return (w&&h)? `${w} / ${h}` : '2 / 3' })() }}>
                              <Image 
                                src={r.dataUrl.replace(/%2F/g, '/')} 
                                alt={`${r.artistKey}-${r.styleKey}`} 
                                fill
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                                className="object-contain" 
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                                quality={80}
                              />
                            </div>
                            <div className="mt-3 text-center space-y-1">
                              <div className="font-medium text-gray-900">
                                {formatArtistName(r.artistKey)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatStyleName(r.styleKey)}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                onClick={() => { setPrintImage(r.dataUrl); setPrintOpen(true) }}
                              >Print</Button>
                              <a
                                download={`dog-${i}-${r.artistKey}-${r.styleKey}.png`}
                                href={r.dataUrl}
                                className="flex-1"
                              >
                                <Button size="sm" className="w-full">Download</Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Art Style Selection Panel */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 lg:sticky lg:top-24">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Art Style</h3>
            <p className="text-green-600 font-medium">Select from masterpieces by history's greatest artists</p>
          </div>
          <StylePicker value={selections} onChange={setSelections} />
        </div>
          </div>
        </div>
      </section>

      {/* Bottom action bar (modern only) */}
      {IS_MODERN && (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-4">
            <div className="app-toolbar px-4 py-3 rounded-2xl border border-gray-200/70 bg-white/75 backdrop-blur shadow-glass flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {generationStatus ? (
                  <span>
                    Daily limit: {generationStatus.used}/{generationStatus.dailyLimit} used • resets {new Date(generationStatus.resetTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                ) : (
                  <span>Sign in to track your daily generation limit</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                  className="text-sm border rounded-full px-3 py-1 app-pill"
                >
                  <option value="1024x1536">Portrait</option>
                  <option value="1024x1024">Square</option>
                  <option value="1536x1024">Landscape</option>
                </select>
                <Button onClick={onGenerate} disabled={!canGenerate} className="btn-modern">
                  {loading
                    ? '🎨 Generating…'
                    : generationStatus && generationStatus.remaining === 0
                    ? '📵 Daily Limit Reached'
                    : '✨ Generate Portraits'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      <HowItWorks />
      <TrustBadges />

      {/* Musti Service Highlights - Similar to their website */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Pet Parents Choose Our AI Portrait Studio</h2>
            <p className="text-xl text-gray-600">Powered by Musti's expertise in pet care and happiness</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Museum-Quality Art</h3>
              <p className="text-gray-600">Professional portraits inspired by Van Gogh, Picasso, Monet and 20+ master artists</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Get your custom portrait in minutes, not days. Perfect for last-minute gifts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Perfect Details</h3>
              <p className="text-gray-600">Our AI preserves your dog's unique features, markings, and personality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Musti Trusted</h3>
              <p className="text-gray-600">Backed by Musti's commitment to pet happiness and customer satisfaction</p>
            </div>
          </div>
          
          {/* Trust badges like Musti has */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl">
            <div className="grid gap-8 md:grid-cols-3 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
                <div className="text-sm text-gray-600">Average rating from pet parents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
                <div className="text-sm text-gray-600">No credit card required to start</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">AI portrait generation available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What is Dog Paintings?</h3>
                <p className="text-gray-600 text-sm">Dog Paintings transforms your dog photos into museum-quality portraits inspired by history's most famous painters.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How long does it take?</h3>
                <p className="text-gray-600 text-sm">Most portraits are ready within minutes. You can publish to the gallery and request a framed print when you're happy.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Do my uploads keep their details?</h3>
                <p className="text-gray-600 text-sm">Yes. We preserve your dog's distinctive markings and expressions for a faithful final portrait.</p>
              </div>
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'What is Dog Paintings?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Dog Paintings transforms dog photos into museum-quality portraits inspired by history\'s most famous painters.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'How long does it take?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Most portraits are ready within minutes. You can publish to the gallery and request a framed print when you\'re happy.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Do my uploads keep their details?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. Distinctive markings and expressions are preserved for a faithful final portrait.'
                    }
                  }
                ]
              }),
            }}
          />
        </div>
      </section>

      <Modal open={printOpen} onClose={() => setPrintOpen(false)} title="Order a Framed Print">
        {printImage && (
          <div className="grid gap-6 md:grid-cols-2">
            <FramePreview imageUrl={printImage} frame={frame} />
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Frame</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['black','walnut','white'] as const).map((c) => (
                    <Button key={c} variant={frame===c ? 'default' : 'outline'} size="sm" onClick={() => setFrame(c)} className="capitalize">{c}</Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Size</div>
                <select value={printSize} onChange={(e) => setPrintSize(e.target.value as any)} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="8x10">8×10 in</option>
                  <option value="12x16">12×16 in</option>
                  <option value="18x24">18×24 in</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 font-medium">Estimated price: {printSize==='8x10'?'$49':printSize==='12x16'?'$79':'$129'}</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={async () => {
                  try {
                    const client = getClientApp()
                    if (!client?.auth) throw new Error('Authentication not available')
                    const user = client.auth.currentUser
                    if (!user) throw new Error('Please sign in to continue')
                    const idToken = await user.getIdToken()
                    const resp = await fetch('/api/print-interest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken, imageUrl: printImage, options: { frame, printSize } }) })
                    if (!resp.ok) throw new Error(await resp.text())
                    alert('Thanks! We saved your print request and will notify you when checkout is ready.')
                    setPrintOpen(false)
                  } catch (e: any) {
                    alert(e?.message || 'Failed to submit print interest')
                  }
                }}>Request Print</Button>
                <Button variant="outline" onClick={() => setPrintOpen(false)}>Cancel</Button>
              </div>
              <div className="text-xs text-gray-500">We’ll follow up by email when your print is ready to ship.</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Login prompt when attempting to generate while signed out */}
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} title="Sign in to continue">
        <SignInModal onSuccess={() => setLoginOpen(false)} />
      </Modal>
    </main>
  )
}
