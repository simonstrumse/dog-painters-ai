import { NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'

export const runtime = 'nodejs'
export const revalidate = 0 // Disable caching

export async function GET() {
  try {
    const admin = getAdminServices()
    if (!admin) {
      return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })
    }

    // Get the 6 most recent generations with original images (using composite index)
    const snapshot = await admin.db
      .collection('gallery')
      .where('originalImageUrl', '!=', null)
      .orderBy('createdAt', 'desc')
      .limit(6)
      .get()

    const generations = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        originalImageUrl: data.originalImageUrl,
        artistKey: data.artistKey,
        styleKey: data.styleKey,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
      }
    })

    return NextResponse.json({ generations })
  } catch (error) {
    console.error('Error fetching latest generations:', error)
    return NextResponse.json({ error: 'Failed to fetch latest generations' }, { status: 500 })
  }
}