"use client"
import { useMemo, useState, useEffect } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import StylePicker from '@/components/StylePicker'
import type { GeneratedImage, StyleSelection } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientApp } from '@/lib/firebaseClient'
import Hero from '@/components/Hero'
import Modal from '@/components/ui/modal'
import FramePreview from '@/components/FramePreview'
import HowItWorks from '@/components/HowItWorks'
import TrustBadges from '@/components/TrustBadges'

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [selections, setSelections] = useState<StyleSelection[]>([])
  const [dogName, setDogName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0)
  const [results, setResults] = useState<GeneratedImage[]>([])
  const [size, setSize] = useState<'1024x1024' | '1024x1536'>('1024x1536')
  const [publish, setPublish] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [printImage, setPrintImage] = useState<string | null>(null)
  const [frame, setFrame] = useState<'black' | 'walnut' | 'white'>('black')
  const [printSize, setPrintSize] = useState<'8x10' | '12x16' | '18x24'>('12x16')

  const canGenerate = useMemo(() => files.length > 0 && selections.length > 0 && !loading, [files, selections, loading])

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
      // If publish requested, attach Firebase ID token if available
      if (publish) {
        try {
          const client = getClientApp()
          if (!client?.auth) throw new Error('Authentication not available')
          const user = client.auth.currentUser
          if (!user) throw new Error('Please sign in to publish to gallery')
          const token = await user.getIdToken()
          body.append('idToken', token)
        } catch (e: any) {
          throw new Error(e?.message || 'Authentication required for publishing')
        }
      }
      for (const f of files) body.append('images', f)
      const resp = await fetch('/api/generate', { method: 'POST', body })
      if (!resp.ok) {
        const t = await resp.text()
        throw new Error(t)
      }
      const json = await resp.json()
      setResults(json.results as GeneratedImage[])
      setLoadingProgress(100)
      
      // Auto-scroll to results after generation
      setTimeout(() => {
        const resultsElement = document.getElementById('results')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (e: any) {
      alert('Failed to generate: ' + (e?.message || 'Unknown error'))
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
      setLoadingProgress(0)
      setEstimatedTimeLeft(0)
    }
  }

  return (
    <main className="space-y-10">
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
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={publish} onChange={(e) => setPublish((e.target as HTMLInputElement).checked)} />
            Publish results to public gallery
          </label>

          <Button onClick={onGenerate} disabled={!canGenerate}>
            {loading ? 'Generating…' : 'Generate Portraits'}
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
                        <div key={idx} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src={r.dataUrl} alt={`${r.artistKey}-${r.styleKey}`} className="w-full h-auto object-cover" />
                          <div className="p-3 space-y-2">
                            <div className="text-sm font-medium">{r.artistKey} • {r.styleKey}</div>
                            <div className="flex flex-col sm:flex-row gap-2">
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
    </main>
  )
}
