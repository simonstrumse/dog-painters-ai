import { getAdminServices } from '@/lib/firebaseAdmin'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="border rounded-md overflow-hidden">
            <img src={it.imageUrl} alt={`${it.artistKey}-${it.styleKey}`} className="w-full h-80 object-cover" />
            <div className="p-2 text-sm flex items-center justify-between">
              <div className="truncate">{it.artistKey} • {it.styleKey}</div>
              <div className="text-gray-500">{it.createdAt.toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

