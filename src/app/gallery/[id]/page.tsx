import { getAdminServices } from '@/lib/firebaseAdmin'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import { ShareButton } from '@/components/ShareButton'
import type { Metadata } from 'next'
import FavoriteHeart from '@/components/FavoriteHeart'
import GalleryDetailTop from '@/components/GalleryDetailTop'
import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/blurData'

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

async function getRelatedByArtist(artistKey: string, excludeId: string) {
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

async function getRelatedByStyle(styleKey: string, excludeId: string) {
  const admin = getAdminServices()
  if (!admin) return []
  const snap = await admin.db
    .collection('gallery')
    .where('styleKey', '==', styleKey)
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
  const relatedByStyle = await getRelatedByStyle(item.styleKey, item.id)
  const relatedByArtist = relatedByStyle.length > 0 ? [] : await getRelatedByArtist(item.artistKey, item.id)
  return (
    <main className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            contentUrl: item.imageUrl,
            name: `${formatArtistName(item.artistKey)} — ${formatStyleName(item.styleKey)}`,
            datePublished: item.createdAt.toISOString(),
          }),
        }}
      />
      <nav className="text-sm text-gray-500">
        <a href="/" className="hover:text-gray-700">Home</a>
        <span className="mx-1">/</span>
        <a href="/gallery" className="hover:text-gray-700">Gallery</a>
        <span className="mx-1">/</span>
        <span className="text-gray-700">{formatArtistName(item.artistKey)}</span>
      </nav>

      <GalleryDetailTop item={item as any} shareUrl={shareUrl} />

      {relatedByStyle.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">More in {formatStyleName(item.styleKey)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {relatedByStyle.map((r: any) => (
              <a key={r.id} href={`/gallery/${r.id}`} className="block border rounded-lg overflow-hidden bg-white hover:shadow-sm">
                <div className="relative overflow-hidden" style={{ aspectRatio: '2 / 3' }}>
                  {(() => {
                    const s = r.size || '1024x1536'
                    const [w, h] = String(s).split('x').map((n) => parseInt(n, 10))
                    const isLandscape = (w && h) ? w > h : false
                    const innerStyle: React.CSSProperties = {
                      aspectRatio: (w && h) ? `${w} / ${h}` : '2 / 3',
                      width: isLandscape ? '100%' : 'auto',
                      height: isLandscape ? 'auto' : '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }
                    return (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative" style={innerStyle}>
                          <Image src={r.imageUrl.replace(/%2F/g, '/')} alt={`${formatArtistName(r.artistKey)} — ${formatStyleName(r.styleKey)}`} fill sizes="(max-width: 640px) 45vw, 15vw" className="object-contain object-center" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={75} />
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      {relatedByStyle.length === 0 && relatedByArtist.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">More by {formatArtistName(item.artistKey)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {relatedByArtist.map((r: any) => (
              <a key={r.id} href={`/gallery/${r.id}`} className="block border rounded-lg overflow-hidden bg-white hover:shadow-sm">
                <div className="relative overflow-hidden" style={{ aspectRatio: '2 / 3' }}>
                  {(() => {
                    const s = r.size || '1024x1536'
                    const [w, h] = String(s).split('x').map((n) => parseInt(n, 10))
                    const isLandscape = (w && h) ? w > h : false
                    const innerStyle: React.CSSProperties = {
                      aspectRatio: (w && h) ? `${w} / ${h}` : '2 / 3',
                      width: isLandscape ? '100%' : 'auto',
                      height: isLandscape ? 'auto' : '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }
                    return (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative" style={innerStyle}>
                          <Image src={r.imageUrl.replace(/%2F/g, '/')} alt={`${formatArtistName(r.artistKey)} — ${formatStyleName(r.styleKey)}`} fill sizes="(max-width: 640px) 45vw, 15vw" className="object-contain object-center" placeholder="blur" blurDataURL={BLUR_DATA_URL} quality={75} />
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
