import { NextRequest, NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    
    const admin = getAdminServices()
    if (!admin) {
      return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })
    }
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    let uid: string
    try {
      const decoded = await admin.auth.verifyIdToken(idToken)
      uid = decoded.uid
    } catch (e) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    // Get today's generation count
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const generationsToday = await admin.db
      .collection('user_generations')
      .where('uid', '==', uid)
      .where('date', '==', today)
      .get()
    
    const totalGenerationsToday = generationsToday.docs.reduce((sum, doc) => sum + (doc.data().count || 0), 0)
    const dailyLimit = 3
    const remaining = Math.max(0, dailyLimit - totalGenerationsToday)
    
    // Calculate reset time (midnight UTC of next day)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)
    const resetTime = tomorrow.toISOString()
    
    return NextResponse.json({
      used: totalGenerationsToday,
      remaining,
      dailyLimit,
      resetTime,
      date: today
    })
  } catch (e: any) {
    console.error('Generation status error', e)
    return NextResponse.json({ error: 'Failed to get generation status' }, { status: 500 })
  }
}