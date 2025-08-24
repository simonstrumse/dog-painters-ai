import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) return null
  try {
    const obj = JSON.parse(raw)
    return obj
  } catch {
    return null
  }
}

export function getAdminApp(): App | null {
  const svc = getServiceAccount()
  if (!svc) return null
  if (!getApps().length) {
    initializeApp({
      credential: cert(svc as any),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
  }
  return (getApps()[0] as App) || null
}

export function getAdminServices() {
  const app = getAdminApp()
  if (!app) return null
  return { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) }
}

