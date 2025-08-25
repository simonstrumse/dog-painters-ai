import { NextRequest, NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'
import { MyGalleryRequestSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })

    const parsed = MyGalleryRequestSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const { idToken, limit = 60 } = parsed.data
    const decoded = await admin.auth.verifyIdToken(idToken)
    const uid = decoded.uid

    const snap = await admin.db
      .collection('gallery')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(Math.min(200, Math.max(1, Number(limit) || 60)))
      .get()

    const items = snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || null }))
    return NextResponse.json({ items })
  } catch (e: any) {
    console.error('my-gallery error', e)
    return NextResponse.json({ error: 'Unexpected error', details: e?.message }, { status: 500 })
  }
}
