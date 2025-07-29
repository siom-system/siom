import { initializeApp, getApps, type FirebaseOptions } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

/**
 * Retorna todas as variáveis exigidas pelo Firebase e lança
 * um erro legível caso alguma delas esteja ausente.
 */
function getFirebaseEnv(): FirebaseOptions {
  const {
    NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID,
  } = process.env

  const missing = Object.entries({
    NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length) {
    /* eslint-disable no-console */
    console.error(
      `[Firebase] Variáveis ausentes (${missing.join(
        ", ",
      )}).\nDefina-as no painel de Environment Variables da Vercel ou em .env.local para desenvolvimento.`,
    )
    throw new Error("Firebase env vars missing")
  }

  return {
    apiKey: NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: NEXT_PUBLIC_FIREBASE_APP_ID!,
  }
}

/* -------------------------------------------------------------------------- */
/* Inicialização segura do Firebase                                           */
/* -------------------------------------------------------------------------- */

const firebaseConfig = getFirebaseEnv()

// Previna re-inicializações em hot reload / RSC.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
