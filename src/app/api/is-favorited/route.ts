import { NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'

export async function POST(req: Request) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    const { idToken, imageId } = await req.json()
    if (!idToken || !imageId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const decoded = await admin.auth.verifyIdToken(idToken)
    const uid = decoded.uid
    const favId = `${uid}_${imageId}`
    const favSnap = await admin.db.collection('favorites').doc(favId).get()
    const gSnap = await admin.db.collection('gallery').doc(imageId).get()
    const count = gSnap.get('favoritesCount') || 0
    return NextResponse.json({ favorited: favSnap.exists, count })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 400 })
  }
}

