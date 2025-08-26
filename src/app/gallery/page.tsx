import { getAdminServices } from '@/lib/firebaseAdmin'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'

export const dynamic = 'force-dynamic'

type Item = {
  id: string
  imageUrl: string
  artistKey: string
  styleKey: string
  createdAt: Date
}

async function getItems(): Promise<Item[]> {
  const admin = getAdminServices()
  if (!admin) return []
  const snap = await admin.db.collection('gallery').orderBy('createdAt', 'desc').limit(60).get()
  return snap.docs.map((d) => {
    const v = d.data() as any
    return {
      id: d.id,
      imageUrl: v.imageUrl as string,
      artistKey: v.artistKey as string,
      styleKey: v.styleKey as string,
      createdAt: v.createdAt?.toDate?.() || new Date(),
    }
  })
}

export default async function GalleryPage() {
  const items = await getItems()
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Public Gallery</h1>
      {items.length === 0 && <div className="text-gray-600">No items yet. Generate and publish to see results here.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a key={it.id} href={`/gallery/${it.id}`} className="space-y-2 block group">
            {/* Elegant frame with mat */}
            <div className="p-4 bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-lg">
              <div className="p-3 bg-white rounded-sm shadow-inner">
                <div className="aspect-[2/3] overflow-hidden rounded-sm">
                  <img 
                    src={it.imageUrl} 
                    alt={`${it.artistKey}-${it.styleKey}`} 
                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.01]" 
                  />
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
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
