import { NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: Request) {
  try {
    const admin = getAdminServices()
    if (!admin) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    const { idToken, imageId, action } = await req.json()
    if (!idToken || !imageId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const decoded = await admin.auth.verifyIdToken(idToken)
    const uid = decoded.uid
    const favId = `${uid}_${imageId}`
    const favRef = admin.db.collection('favorites').doc(favId)
    const galleryRef = admin.db.collection('gallery').doc(imageId)
    const favSnap = await favRef.get()

    let favorited = false
    await admin.db.runTransaction(async (tx: any) => {
      const gSnap = await tx.get(galleryRef)
      if (!gSnap.exists) throw new Error('Not found')
      if (action === 'add' && !favSnap.exists) {
        tx.set(favRef, { uid, imageId, createdAt: FieldValue.serverTimestamp() })
        favorited = true
      } else if (action === 'remove' && favSnap.exists) {
        tx.delete(favRef)
        favorited = false
      } else if (!action) {
        // toggle
        if (favSnap.exists) { tx.delete(favRef); favorited = false } else { tx.set(favRef, { uid, imageId, createdAt: FieldValue.serverTimestamp() }); favorited = true }
      } else {
        // no change if inconsistent
        favorited = action === 'add'
      }
      // update count
      tx.update(galleryRef, { favoritesCount: FieldValue.increment((favorited ? 1 : -1)) })
    })

    const countSnap = await galleryRef.get()
    const count = countSnap.get('favoritesCount') || 0
    return NextResponse.json({ favorited, count })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 400 })
  }
}
