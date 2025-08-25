import { NextRequest, NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'
import { PrintInterestSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })
    const parsed = PrintInterestSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const { idToken, imageUrl, options } = parsed.data

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
