"use client"
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatArtistName, formatStyleName } from '@/lib/displayUtils'
import FavoriteHeart from '@/components/FavoriteHeart'
import { ShareButton } from '@/components/ShareButton'
import { BLUR_DATA_URL } from '@/lib/blurData'

type Props = {
  item: {
    id: string
    imageUrl: string
    size?: string
    artistKey: string
    styleKey: string
    createdAt: Date
    user?: { displayName?: string | null; email?: string | null } | null
  }
  shareUrl: string
}

export default function GalleryDetailTop({ item, shareUrl }: Props) {
  const titleRef = useRef<HTMLDivElement | null>(null)
  const [targetHeight, setTargetHeight] = useState<number | undefined>(undefined)
  const [isMdUp, setIsMdUp] = useState(false)

  useEffect(() => {
    // Match Tailwind's md breakpoint (~768px)
    const mq = window.matchMedia('(min-width: 768px)')
    const updateMq = () => setIsMdUp(mq.matches)
    updateMq()
    mq.addEventListener('change', updateMq)
    return () => mq.removeEventListener('change', updateMq)
  }, [])

  useEffect(() => {
    if (!isMdUp) {
      setTargetHeight(undefined)
      return
    }
    if (!titleRef.current) return
    const el = titleRef.current
    const set = () => setTargetHeight(el.getBoundingClientRect().height)
    set()
    const ro = new ResizeObserver(() => set())
    ro.observe(el)
    window.addEventListener('resize', set)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', set)
    }
  }, [isMdUp])

  const [w, h] = useMemo(() => {
    const s = item.size || '1024x1536'
    const parts = String(s).split('x').map((n) => parseInt(n, 10))
    return parts.length === 2 && parts.every((n) => Number.isFinite(n)) ? (parts as [number, number]) : [1024, 1536]
  }, [item.size])

  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-8">
        {/* No decorative frame on detail page; plain, top-aligned image */}
        <div className="relative w-full mx-auto overflow-hidden aspect-[3/4] sm:aspect-[2/3] md:aspect-auto" style={isMdUp && targetHeight ? { height: targetHeight } as any : undefined}>
          <div className="absolute inset-0 flex items-start justify-center">
            <div className="relative w-full h-full" style={{ maxHeight: isMdUp && targetHeight ? targetHeight : undefined }}>
              <Image
                src={item.imageUrl.replace(/%2F/g, '/')}
                alt={`${formatArtistName(item.artistKey)} — ${formatStyleName(item.styleKey)}`}
                fill
                sizes="100vw"
                className="object-contain object-top"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                quality={85}
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <aside className="md:col-span-4 space-y-4">
        <div ref={titleRef} className="bg-white border rounded-lg p-4 space-y-2">
          <h1 className="text-xl font-serif font-semibold">{formatArtistName(item.artistKey)}</h1>
          <div className="text-gray-600 italic">{formatStyleName(item.styleKey)}</div>
          <div className="text-sm text-gray-500">{item.createdAt.toLocaleString()}</div>
          <div className="pt-2"><FavoriteHeart imageId={item.id} /></div>
        </div>
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <div className="font-medium">Share</div>
          <div className="flex items-center gap-2">
            <ShareButton url={shareUrl} />
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this dog portrait!')}`}
              className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
              target="_blank"
            >
              Twitter
            </a>
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
  )
}

