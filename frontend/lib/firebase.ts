// @/frontend/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // <-- IMPORTAÇÃO ADICIONADA

// Configuração do Firebase, lendo as variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// --- CÓDIGO DE CONEXÃO COM O EMULADOR ADICIONADO AQUI ---
// Esta verificação garante que só vamos nos conectar ao emulador
// em ambiente de desenvolvimento.
if (process.env.NODE_ENV === 'development') {
    try {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        console.log("Conectado ao emulador do Firestore.");
    } catch (error) {
        console.error("Erro ao conectar ao emulador do Firestore:", error);
    }
}
// ---------------------------------------------------------

export { app, db };
