import { NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'

export async function POST(req: Request) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    const { idToken } = await req.json()
    if (!idToken) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const decoded = await admin.auth.verifyIdToken(idToken)
    const uid = decoded.uid
    const snap = await admin.db.collection('favorites').where('uid', '==', uid).limit(500).get()
    const imageIds = snap.docs.map(d => (d.data() as any).imageId)
    return NextResponse.json({ imageIds })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 400 })
  }
}

