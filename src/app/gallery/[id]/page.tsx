import { getAdminServices } from '@/lib/firebaseAdmin'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import { ShareButton } from '@/components/ShareButton'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

async function getItem(id: string) {
  const admin = getAdminServices()
  if (!admin) return null
  const doc = await admin.db.collection('gallery').doc(id).get()
  if (!doc.exists) return null
  const data = doc.data() as any
  let user: { displayName?: string | null; email?: string | null } | null = null
  try {
    if (data.uid) {
      const u = await admin.auth.getUser(data.uid)
      user = { displayName: u.displayName, email: u.email }
    }
  } catch {}
  return {
    id: doc.id,
    imageUrl: data.imageUrl as string,
    originalImageUrl: data.originalImageUrl as string | undefined,
    artistKey: data.artistKey as string,
    styleKey: data.styleKey as string,
    size: data.size as string | undefined,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    user,
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getItem(params.id)
  if (!item) return { title: 'Not found' }
  const title = `${formatArtistName(item.artistKey)} — ${formatStyleName(item.styleKey)}`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery/${item.id}`
  const images = item.imageUrl ? [{ url: item.imageUrl, width: 1200, height: 1200, alt: title }] : []
  return {
    title,
    description: 'Museum‑quality dog portrait from our public gallery',
    openGraph: {
      title,
      description: 'Museum‑quality dog portrait from our public gallery',
      url,
      images,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Museum‑quality dog portrait from our public gallery',
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  }
}

async function getRelatedItems(artistKey: string, excludeId: string) {
  const admin = getAdminServices()
  if (!admin) return []
  const snap = await admin.db
    .collection('gallery')
    .where('artistKey', '==', artistKey)
    .orderBy('createdAt', 'desc')
    .limit(8)
    .get()
  return snap.docs
    .filter((d) => d.id !== excludeId)
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export default async function GalleryItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)
  if (!item) {
    return <main className="py-24 text-center text-gray-600">Not found</main>
  }
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery/${item.id}`
  const related = await getRelatedItems(item.artistKey, item.id)
  return (
    <main className="space-y-6">
      <nav className="text-sm text-gray-500">
        <a href="/" className="hover:text-gray-700">Home</a>
        <span className="mx-1">/</span>
        <a href="/gallery" className="hover:text-gray-700">Gallery</a>
        <span className="mx-1">/</span>
        <span className="text-gray-700">{formatArtistName(item.artistKey)}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg border shadow-sm p-3">
            <div className="w-full max-h-[80vh] mx-auto overflow-hidden" style={{ aspectRatio: (() => { const s=item.size||'1024x1536'; const [w,h]=String(s).split('x').map((n)=>parseInt(n,10)); return (w&&h)? `${w} / ${h}` : '2 / 3' })() }}>
              <img src={item.imageUrl} alt={`${item.artistKey}-${item.styleKey}`} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        <aside className="md:col-span-4 space-y-4">
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <h1 className="text-xl font-serif font-semibold">{formatArtistName(item.artistKey)}</h1>
            <div className="text-gray-600 italic">{formatStyleName(item.styleKey)}</div>
            <div className="text-sm text-gray-500">{item.createdAt.toLocaleString()}</div>
          </div>
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="font-medium">Share</div>
            <div className="flex items-center gap-2">
              <ShareButton url={shareUrl} />
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this dog portrait!')}`} className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50" target="_blank">Twitter</a>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <div className="font-medium">Details</div>
            {item.user ? (
              <div className="text-sm text-gray-600">
                <div>By: {item.user.displayName || item.user.email || 'Anonymous'}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">By: Anonymous</div>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">More like this</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {related.map((r: any) => (
              <a key={r.id} href={`/gallery/${r.id}`} className="block border rounded-lg overflow-hidden bg-white hover:shadow-sm">
                <div className="overflow-hidden" style={{ aspectRatio: (() => { const s=r.size||'1024x1536'; const [w,h]=String(s).split('x').map((n)=>parseInt(n,10)); return (w&&h)? `${w} / ${h}` : '2 / 3' })() }}>
                  <img src={r.imageUrl} alt="related" className="w-full h-full object-contain" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
