import { getAdminServices } from '@/lib/firebaseAdmin'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import Image from 'next/image'
import type { Metadata } from 'next'
import { BLUR_DATA_URL } from '@/lib/blurData'
import FavoriteHeart from '@/components/FavoriteHeart'

const OG_DEFAULT = process.env.NEXT_PUBLIC_OG_DEFAULT || '/og/default.jpg'

export const metadata: Metadata = {
  title: 'Public Gallery – Dog Paintings',
  description: 'Explore recent dog portraits in iconic art styles from our community gallery.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery` },
  openGraph: {
    title: 'Public Gallery – Dog Paintings',
    description: 'Explore recent dog portraits in iconic art styles from our community gallery.',
    images: [{ url: OG_DEFAULT, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_DEFAULT],
  },
}

export const dynamic = 'force-dynamic'

type Item = {
  id: string
  imageUrl: string
  artistKey: string
  styleKey: string
  size?: string
  createdAt: Date
  favoritesCount?: number
}

async function getItems(sort: 'latest' | 'favorites' = 'latest'): Promise<Item[]> {
  const admin = getAdminServices()
  if (!admin) return []
  const col = admin.db.collection('gallery')
  const query = sort === 'favorites' ? col.orderBy('favoritesCount', 'desc').limit(60) : col.orderBy('createdAt', 'desc').limit(60)
  const snap = await query.get()
  return snap.docs.map((d) => {
    const v = d.data() as any
    return {
      id: d.id,
      imageUrl: v.imageUrl as string,
      artistKey: v.artistKey as string,
      styleKey: v.styleKey as string,
      size: v.size as string | undefined,
      createdAt: v.createdAt?.toDate?.() || new Date(),
      favoritesCount: v.favoritesCount || 0,
    }
  })
}

export default async function GalleryPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const sort = searchParams?.sort === 'favorites' ? 'favorites' : 'latest'
  const items = await getItems(sort)
  return (
    <main className="space-y-6">
      <script
        type="application/ld+json"
        // Structured data for gallery index as a CollectionPage
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Public Gallery – Dog Paintings',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery`,
            hasPart: {
              '@type': 'Collection',
              name: 'Dog Portraits',
              about: 'Community gallery of dog portraits in classic art styles',
              collectionSize: items.length,
              itemListElement: items.map((it, idx) => ({
                '@type': 'ImageObject',
                position: idx + 1,
                contentUrl: it.imageUrl,
                name: `${formatArtistName(it.artistKey)} — ${formatStyleName(it.styleKey)}`,
                url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/gallery/${it.id}`,
              })),
            },
          }),
        }}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Public Gallery</h1>
        <div className="text-sm text-gray-700">
          <span className="mr-2 text-gray-600">Sort by</span>
          <a href="/gallery" className={sort === 'latest' ? 'font-semibold underline' : 'hover:underline'}>Latest</a>
          <span className="mx-2 text-gray-400">/</span>
          <a href="/gallery?sort=favorites" className={sort === 'favorites' ? 'font-semibold underline' : 'hover:underline'}>Most favorited</a>
        </div>
      </div>
      {items.length === 0 && <div className="text-gray-600">No items yet. Generate and publish to see results here.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a key={it.id} href={`/gallery/${it.id}`} className="space-y-2 block group">
            {/* Elegant frame with mat */}
            <div className="p-4 bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-lg">
              <div className="p-3 bg-white rounded-sm shadow-inner">
                {/* Outer "wall space" box keeps plaques aligned */}
                <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '2 / 3' }}>
                  {/* Center an inner frame that matches the image's true aspect */}
                  {(() => {
                    const s = it.size || '1024x1536'
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
                          <Image
                            src={it.imageUrl.replace(/%2F/g, '/')}
                            alt={`${formatArtistName(it.artistKey)} — ${formatStyleName(it.styleKey)}`}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                            className="object-contain object-center transition-transform duration-200 group-hover:scale-[1.01]"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            quality={80}
                          />
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
            {/* Gallery-style plaque */}
            <div className="bg-white border shadow-sm rounded-lg p-3 mx-2">
              <div className="text-center space-y-1">
                <div className="font-serif text-sm font-medium text-gray-900">
                  {formatArtistName(it.artistKey)}
                </div>
                <div className="text-xs text-gray-600 italic">
                  {formatStyleName(it.styleKey)}
                </div>
                <div className="text-xs text-gray-500 border-t pt-1 mt-2">
                  {it.createdAt.toLocaleDateString()}
                </div>
                <div className="pt-2">
                  <FavoriteHeart imageId={it.id} initialCount={(it as any).favoritesCount || 0} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
