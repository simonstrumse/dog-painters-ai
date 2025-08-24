"use client"
import { useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

type Props = {
  onFiles: (files: File[]) => void
}

export default function UploadDropzone({ onFiles }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length) onFiles(files)
  }, [onFiles])

  return (
    <Card onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className="cursor-pointer" onClick={() => ref.current?.click()}>
      <CardHeader>
        <CardTitle>Upload Your Dog Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            if (files.length) onFiles(files)
          }}
        />
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50">
          <div className="font-medium">Drop files here or click to browse</div>
          <div className="text-sm text-gray-600 mb-3">JPG, PNG. Multiple images supported.</div>
          <Button type="button" onClick={(e) => { e.stopPropagation(); ref.current?.click() }}>Choose Files</Button>
        </div>
      </CardContent>
    </Card>
  )
}
