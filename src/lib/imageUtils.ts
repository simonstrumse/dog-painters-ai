/**
 * Client-side image compression utility
 */

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.8,
  outputFormat: 'image/jpeg'
}

/**
 * Compresses an image file to reduce size for upload
 */
export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas 2D context not supported'))
      return
    }
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      
      if (width > opts.maxWidth || height > opts.maxHeight) {
        const aspectRatio = width / height
        
        if (width > height) {
          width = opts.maxWidth
          height = opts.maxWidth / aspectRatio
        } else {
          height = opts.maxHeight
          width = opts.maxHeight * aspectRatio
        }
        
        // Ensure neither dimension exceeds the max
        if (height > opts.maxHeight) {
          height = opts.maxHeight
          width = opts.maxHeight * aspectRatio
        }
        if (width > opts.maxWidth) {
          width = opts.maxWidth
          height = opts.maxWidth / aspectRatio
        }
      }
      
      // Set canvas size
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }
          
          // Create new file with compressed data
          const compressedFile = new File([blob], file.name, {
            type: opts.outputFormat,
            lastModified: Date.now()
          })
          
          resolve(compressedFile)
        },
        opts.outputFormat,
        opts.quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validates if a file is a supported image format
 */
export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/') && 
         ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
}

/**
 * Gets human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}