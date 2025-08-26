import type { MetadataRoute } from 'next'
import { getAdminServices } from '@/lib/firebaseAdmin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/gallery`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/my`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const admin = getAdminServices()
    if (admin) {
      const snap = await admin.db.collection('gallery').orderBy('createdAt', 'desc').limit(200).get()
      for (const d of snap.docs) {
        const data = d.data() as any
        const updatedAt: Date = data.createdAt?.toDate?.() || new Date()
        urls.push({ url: `${base}/gallery/${d.id}`, lastModified: updatedAt })
      }
    }
  } catch {
    // ignore sitemap enrichment failures
  }
  return urls
}

