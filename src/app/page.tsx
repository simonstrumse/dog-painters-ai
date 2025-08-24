"use client"
import { useMemo, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GeneratedImage[]>([])
  const [size, setSize] = useState<'512x512' | '1024x1024'>('1024x1024')
  const [publish, setPublish] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [printImage, setPrintImage] = useState<string | null>(null)
  const [frame, setFrame] = useState<'black' | 'walnut' | 'white'>('black')
  const [printSize, setPrintSize] = useState<'8x10' | '12x16' | '18x24'>('12x16')

  const canGenerate = useMemo(() => files.length > 0 && selections.length > 0 && !loading, [files, selections, loading])

  const onGenerate = async () => {
    setLoading(true)
    setResults([])
    try {
      const body = new FormData()
      body.append('selections', JSON.stringify(selections))
      body.append('size', size)
      body.append('publish', String(publish))
      // If publish requested, attach Firebase ID token if available
      if (publish) {
        try {
          const client = getClientApp()
          if (!client) throw new Error('Authentication not configured')
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
    } catch (e: any) {
      alert('Failed to generate: ' + (e?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="space-y-10">
      <Hero />

      <section id="create" className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <UploadDropzone onFiles={(f) => setFiles((prev) => [...prev, ...f])} />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {files.map((f, i) => (
                <div key={i} className="w-28 h-28 rounded-md overflow-hidden border relative">
                  <img src={URL.createObjectURL(f)} alt={`upload-${i}`} className="w-full h-full object-cover" />
                  <button className="absolute top-1 right-1 bg-white/80 text-xs px-1 rounded" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="text-sm">Output size</label>
            <select value={size} onChange={(e) => setSize(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="512x512">512 × 512</option>
              <option value="1024x1024">1024 × 1024</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={publish} onChange={(e) => setPublish((e.target as HTMLInputElement).checked)} />
            Publish results to public gallery
          </label>

          <Button onClick={onGenerate} disabled={!canGenerate}>
            {loading ? 'Generating… this may take up to a minute' : 'Generate Portraits'}
          </Button>
          {loading && (
            <div className="text-sm text-gray-600">Hang tight! Generations can take ~30–60 seconds.</div>
          )}
        </div>

        <div>
          <StylePicker value={selections} onChange={setSelections} />
        </div>
      </section>

      {results.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Results</h2>
          {files.map((f, i) => {
            const perImage = results.filter((r) => r.originalIndex === i)
            if (perImage.length === 0) return null
            return (
              <div key={i} className="space-y-3">
                <div className="font-medium">Original #{i + 1}</div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="border rounded-md overflow-hidden">
                      <img src={URL.createObjectURL(f)} alt={`original-${i}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                    {perImage.map((r, idx) => (
                      <div key={idx} className="border rounded-md overflow-hidden">
                        <img src={r.dataUrl} alt={`${r.artistKey}-${r.styleKey}`} className="w-full h-full object-cover" />
                        <div className="flex items-center justify-between p-2 text-sm">
                          <div className="truncate">{r.artistKey} • {r.styleKey}</div>
                          <div className="flex items-center gap-2">
                            <button
                              className="text-gray-700 hover:underline"
                              onClick={() => { setPrintImage(r.dataUrl); setPrintOpen(true) }}
                            >Print</button>
                            <a
                              download={`dog-${i}-${r.artistKey}-${r.styleKey}.png`}
                              href={r.dataUrl}
                              className="text-blue-700 hover:underline"
                            >Download</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}

      <HowItWorks />
      <TrustBadges />

      <Modal open={printOpen} onClose={() => setPrintOpen(false)} title="Order a Framed Print">
        {printImage && (
          <div className="grid gap-4 md:grid-cols-2">
            <FramePreview imageUrl={printImage} frame={frame} />
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium mb-1">Frame</div>
                <div className="flex gap-2">
                  {(['black','walnut','white'] as const).map((c) => (
                    <button key={c} onClick={() => setFrame(c)} className={`px-3 py-1 rounded border ${frame===c?'border-blue-600':''}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Size</div>
                <select value={printSize} onChange={(e) => setPrintSize(e.target.value as any)} className="border rounded px-2 py-1">
                  <option value="8x10">8×10 in</option>
                  <option value="12x16">12×16 in</option>
                  <option value="18x24">18×24 in</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">Estimated price: {printSize==='8x10'?'$49':printSize==='12x16'?'$79':'$129'}</div>
              <div className="flex gap-2">
                <Button onClick={async () => {
                  try {
                    const client = getClientApp()
                    if (!client) throw new Error('Authentication not configured')
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
