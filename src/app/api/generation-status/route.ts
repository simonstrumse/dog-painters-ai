import { NextRequest, NextResponse } from 'next/server'
import { getAdminServices } from '@/lib/firebaseAdmin'
import { DAILY_LIMIT, tomorrowMidnightUTCISO, todayKeyUTC } from '@/lib/config'
import { IdTokenSchema } from '@/lib/validation'
import { getTodayUsage } from '@/lib/usage'

export async function POST(req: NextRequest) {
  try {
    const parsed = IdTokenSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { idToken } = parsed.data
    
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

    // Get today's generation count via single-doc pattern
    const totalGenerationsToday = await getTodayUsage(uid)
    const dailyLimit = DAILY_LIMIT
    const remaining = Math.max(0, dailyLimit - totalGenerationsToday)
    const resetTime = tomorrowMidnightUTCISO()
    
    return NextResponse.json({
      used: totalGenerationsToday,
      remaining,
      dailyLimit,
      resetTime,
      date: todayKeyUTC()
    })
  } catch (e: any) {
    console.error('Generation status error', e)
    return NextResponse.json({ error: 'Failed to get generation status' }, { status: 500 })
  }
}
