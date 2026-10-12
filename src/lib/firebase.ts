import { firebaseConfig, isFirebaseConfigured } from './firebase-config'
import type { Firestore } from 'firebase/firestore'

type FirestoreSdk = typeof import('firebase/firestore')

export interface Cloud {
  db: Firestore
  sdk: FirestoreSdk
}

let ready: Promise<Cloud | null> | null = null

export function isCloudConnected() {
  return isFirebaseConfigured()
}

export function getCloud(): Promise<Cloud | null> {
  if (!ready) {
    ready = (async () => {
      if (!isFirebaseConfigured()) return null
      try {
        const [appMod, sdk] = await Promise.all([
          import('firebase/app'),
          import('firebase/firestore'),
        ])
        const app = appMod.initializeApp(firebaseConfig)
        const db = sdk.getFirestore(app)
        return { db, sdk }
      } catch {
        return null
      }
    })()
  }
  return ready
}
