"use client"
import { useMemo, useState } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import StylePicker from '@/components/StylePicker'
import type { GeneratedImage, StyleSelection } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientApp } from '@/lib/firebaseClient'

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([])
  const [selections, setSelections] = useState<StyleSelection[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GeneratedImage[]>([])
  const [size, setSize] = useState<'512x512' | '1024x1024'>('1024x1024')
  const [publish, setPublish] = useState(false)

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
          const { auth } = getClientApp()
          const user = auth.currentUser
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
    <main className="space-y-8">
      <header className="flex flex-col gap-3 items-center text-center">
        <h1 className="text-3xl font-bold">Dog Painters</h1>
        <p className="text-gray-600 max-w-2xl">Upload your dog photos and transform them into AI-generated portraits in famous artists\' styles. Select one or many styles and generate high-quality images.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
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
                          <a
                            download={`dog-${i}-${r.artistKey}-${r.styleKey}.png`}
                            href={r.dataUrl}
                            className="text-blue-600 hover:underline"
                          >Download</a>
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
    </main>
  )
}
