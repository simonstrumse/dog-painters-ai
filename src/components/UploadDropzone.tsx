"use client"
import { useCallback, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { compressImage, isValidImageFile, formatFileSize } from '@/lib/imageUtils'

type Props = {
  onFiles: (files: File[]) => void
}

export default function UploadDropzone({ onFiles }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const processFiles = useCallback(async (rawFiles: File[]) => {
    if (rawFiles.length === 0) return
    
    setIsCompressing(true)
    try {
      const validFiles = rawFiles.filter(isValidImageFile)
      
      if (validFiles.length === 0) {
        alert('Please upload valid image files (JPG, PNG, WebP)')
        return
      }
      
      if (validFiles.length !== rawFiles.length) {
        alert(`${rawFiles.length - validFiles.length} files were skipped (unsupported format)`)
      }
      
      // Compress images in parallel
      const compressPromises = validFiles.map(async (file) => {
        const originalSize = file.size
        const compressed = await compressImage(file, {
          maxWidth: 1024,
          maxHeight: 1024,
          quality: 0.85,
          outputFormat: 'image/jpeg'
        })
        
        console.log(`Compressed ${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(compressed.size)}`)
        return compressed
      })
      
      const compressedFiles = await Promise.all(compressPromises)
      onFiles(compressedFiles)
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images. Please try again.')
    } finally {
      setIsCompressing(false)
    }
  }, [onFiles])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    processFiles(files)
  }, [processFiles])

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
            if (files.length) processFiles(files)
          }}
        />
        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isCompressing ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
          {isCompressing ? (
            <>
              <div className="font-medium">Compressing images...</div>
              <div className="text-sm text-gray-600 mb-3">Optimizing for upload</div>
              <div className="text-blue-600">Please wait</div>
            </>
          ) : (
            <>
              <div className="font-medium">Drop files here or click to browse</div>
              <div className="text-sm text-gray-600 mb-3">JPG, PNG, WebP. Images will be optimized for upload.</div>
              <Button type="button" onClick={(e) => { e.stopPropagation(); ref.current?.click() }}>Choose Files</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
