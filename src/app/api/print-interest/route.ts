import { NextRequest, NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })
    const body = await req.json()
    const { idToken, imageUrl, options } = body || {}
    if (!idToken) return NextResponse.json({ error: 'Missing idToken' }, { status: 401 })
    if (!imageUrl) return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 })

    const decoded = await admin.auth.verifyIdToken(idToken)
    const uid = decoded.uid
    const ref = await admin.db.collection('print_interests').add({
      uid,
      imageUrl,
      options,
      createdAt: new Date(),
      status: 'new',
    })
    return NextResponse.json({ ok: true, id: ref.id })
  } catch (e: any) {
    console.error('print-interest error', e)
    return NextResponse.json({ error: 'Unexpected error', details: e?.message }, { status: 500 })
  }
}

