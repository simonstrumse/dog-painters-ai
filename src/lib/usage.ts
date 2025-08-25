import { getAdminServices } from "./firebaseAdmin"
import { todayKeyUTC } from "./config"
import { FieldValue } from "firebase-admin/firestore"

export async function getTodayUsage(uid: string): Promise<number> {
  const admin = getAdminServices()
  if (!admin) return 0
  const today = todayKeyUTC()
  const docRef = admin.db.collection("user_generations").doc(`${uid}_${today}`)
  const snap = await docRef.get()
  return (snap.exists ? (snap.data()?.count as number) : 0) || 0
}

export async function incrementTodayUsage(uid: string, by: number) {
  const admin = getAdminServices()
  if (!admin) return
  const today = todayKeyUTC()
  const docRef = admin.db.collection("user_generations").doc(`${uid}_${today}`)
  await docRef.set(
    { uid, date: today, count: FieldValue.increment(by), lastUpdated: new Date() },
    { merge: true }
  )
}

