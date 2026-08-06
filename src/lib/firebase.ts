import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseConfig, isFirebaseConfigured } from './firebase-config'

let app: FirebaseApp | null = null
let firestore: Firestore | null = null

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig)
    firestore = getFirestore(app)
  } catch {
    app = null
    firestore = null
  }
}

export { app, firestore }
export const isCloudConnected = () => firestore !== null
