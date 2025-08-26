"use client"
import { useMemo, useState, useEffect } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
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
import AuthButtons from '@/components/AuthButtons'

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
    <main className="space-y-10">
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

      

      <section id="create" className="grid gap-6 lg:grid-cols-2 xl:gap-8">
        <div className="space-y-4">
          <UploadDropzone onFiles={(f) => setFiles((prev) => [...prev, ...f])} />
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
              {files.map((f, i) => (
                <div key={i} className="w-full sm:w-28 h-28 rounded-md overflow-hidden border relative">
                  <img src={URL.createObjectURL(f)} alt={`upload-${i}`} className="w-full h-full object-cover" />
                  <button className="absolute top-1 right-1 bg-white/80 hover:bg-white text-xs px-2 py-1 rounded shadow-sm" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Dog's name (optional)</label>
            <input
              type="text"
              placeholder="e.g., Tassen (for artistic titles like 'Le Tassen')"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <p className="text-xs text-gray-500">This will create artistic titles integrated into the paintings</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium">Output size</label>
            <select value={size} onChange={(e) => setSize(e.target.value as any)} className="border rounded px-3 py-2 text-sm">
              <option value="1024x1024">1024 × 1024 (Square)</option>
              <option value="1024x1536">1024 × 1536 (Portrait)</option>
              <option value="1536x1024">1536 × 1024 (Landscape)</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Checkbox checked={publish} disabled />
              <span className="font-medium">Publish to public gallery (required)</span>
            </div>
            <div className="text-xs text-blue-700">
              Free users share their creations with our community. 
              <span className="font-medium">Paying customers will have opt-out available.</span>
            </div>
            {generationStatus ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={generationStatus.remaining > 0 ? 'text-green-600' : 'text-red-600'}>
                    {generationStatus.remaining > 0 ? '✅' : '⚠️'} 
                    {generationStatus.remaining} generations remaining today
                  </span>
                  <span className="text-gray-500">
                    {generationStatus.used}/{generationStatus.dailyLimit} used
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${
                      generationStatus.remaining > 1 ? 'bg-green-500' : 
                      generationStatus.remaining === 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(generationStatus.used / generationStatus.dailyLimit) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Resets at {new Date(generationStatus.resetTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                  {new Date(generationStatus.resetTime).toDateString() !== new Date().toDateString() ? ' tomorrow' : ' today'}
                </div>
              </div>
            ) : (
              <div className="text-xs text-blue-600">
                ⚠️ Daily limit: 3 generations per user
              </div>
            )}
          </div>

          <Button onClick={onGenerate} disabled={!canGenerate}>
            {loading 
              ? 'Generating…' 
              : generationStatus && generationStatus.remaining === 0 
                ? 'Daily Limit Reached' 
                : 'Generate Portraits'
            }
          </Button>
          
          {loading && (
            <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-900">We're painting your dog...</div>
              
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-blue-800 font-medium">
                  ⚠️ Please don't close this tab or browser
                </div>
                <div className="text-xs text-blue-700">
                  We're working on your portraits. Closing this page will cancel the process.
                </div>
              </div>
            </div>
          )}

          {/* Results appear right below the generation button */}
          {results.length > 0 && (
            <div id="results" className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Your Generated Portraits</h3>
              {files.map((f, i) => {
                const perImage = results.filter((r) => r.originalIndex === i)
                if (perImage.length === 0) return null
                return (
                  <div key={i} className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Original #{i + 1}</div>
                    <div className="grid gap-3">
                      {perImage.map((r, idx) => (
                        <div key={idx} className="space-y-2">
                          {/* Elegant frame with mat */}
                          <div className="p-4 bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-lg">
                            <div className="p-3 bg-white rounded-sm shadow-inner">
                              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: (() => { const [w,h]=size.split('x').map(n=>parseInt(n,10)); return (w&&h)? `${w} / ${h}` : '2 / 3' })() }}>
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
                            </div>
                          </div>
                          {/* Gallery-style plaque */}
                          <div className="bg-white border shadow-sm rounded-lg p-3 mx-2">
                            <div className="text-center space-y-1">
                              <div className="font-serif text-sm font-medium text-gray-900">
                                {formatArtistName(r.artistKey)}
                              </div>
                              <div className="text-xs text-gray-600 italic">
                                {formatStyleName(r.styleKey)}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-2 border-t">
                              <button
                                className="flex-1 text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                                onClick={() => { setPrintImage(r.dataUrl); setPrintOpen(true) }}
                              >Print</button>
                              <a
                                download={`dog-${i}-${r.artistKey}-${r.styleKey}.png`}
                                href={r.dataUrl}
                                className="flex-1 text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium text-center"
                              >Download</a>
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

        <div>
          <StylePicker value={selections} onChange={setSelections} />
        </div>
      </section>


      <HowItWorks />
      <TrustBadges />

      {/* Product-focused value props for clear extraction (moved to bottom) */}
      <section className="rounded-xl border bg-white p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Why Dog Paintings</h2>
        <ul className="grid gap-4 md:grid-cols-2 text-gray-700">
          <li><strong>Museum-inspired styles:</strong> Portraits inspired by masters like Van Gogh, Hokusai, and Klimt.</li>
          <li><strong>Keep your dog’s markings:</strong> We retain unique features and expressions in every portrait.</li>
          <li><strong>Ready for display:</strong> Download high‑resolution files and request framed prints.</li>
          <li><strong>Fast turnaround:</strong> Create and publish to the gallery in just minutes.</li>
        </ul>
      </section>

      {/* FAQ: visible content + JSON-LD for FAQPage (moved to bottom) */}
      <section className="rounded-xl border bg-white p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Frequently Asked Questions</h2>
        <div className="space-y-5 text-gray-800">
          <div>
            <div className="font-semibold">What is Dog Paintings?</div>
            <p>Dog Paintings transforms your dog photos into museum‑quality portraits inspired by history’s most famous painters.</p>
          </div>
          <div>
            <div className="font-semibold">How long does it take?</div>
            <p>Most portraits are ready within minutes. You can publish to the gallery and request a framed print when you’re happy.</p>
          </div>
          <div>
            <div className="font-semibold">Do my uploads keep their details?</div>
            <p>Yes. We preserve your dog’s distinctive markings and expressions for a faithful final portrait.</p>
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
                    text: 'Dog Paintings transforms dog photos into museum‑quality portraits inspired by history’s most famous painters.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'How long does it take?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most portraits are ready within minutes. You can publish to the gallery and request a framed print when you’re happy.'
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
                    <button key={c} onClick={() => setFrame(c)} className={`px-4 py-2 rounded border text-sm font-medium capitalize ${frame===c?'border-blue-600 bg-blue-50 text-blue-700':'border-gray-300 hover:border-gray-400'}`}>{c}</button>
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
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} title="Sign in to generate">
        <div className="space-y-3">
          <div className="text-sm text-gray-700">Please sign in to generate your dog paintings.</div>
          <AuthButtons />
        </div>
      </Modal>
    </main>
  )
}
