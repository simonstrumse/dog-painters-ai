import { getAdminServices } from './firebaseAdmin'

export async function uploadImageToFirebase(path: string, data: ArrayBuffer, contentType = 'image/png'): Promise<string | null> {
  const admin = getAdminServices()
  if (!admin) {
    console.error('Firebase admin not configured')
    return null
  }

  try {
    const bucket = admin.storage.bucket()
    const fileRef = bucket.file(path)
    
    // Upload the file
    await fileRef.save(Buffer.from(data), { 
      contentType,
      public: false,
      metadata: {
        cacheControl: 'public, max-age=31536000', // 1 year
      }
    })
    
    // Make the file public
    await fileRef.makePublic()
    
    // Return the public URL
    // Prefer unencoded slashes for better compatibility with image CDNs/optimizers
    const safePath = encodeURI(path)
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${safePath}`
    return publicUrl
  } catch (error) {
    console.error('Firebase Storage upload error', error)
    return null
  }
}

export function generateStoragePath(prefix = 'generated'): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).slice(2)
  return `${prefix}/${timestamp}-${randomId}.png`
}
