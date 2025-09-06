// src/firebase/config.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Pega variáveis do Expo Constants ou do process.env
const extras = (Constants.expoConfig?.extra) || (Constants.manifest as any)?.extra || {};

const firebaseConfig = {
  apiKey: extras.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '<COLE_AQUI>',
  authDomain: extras.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '<COLE_AQUI>',
  projectId: extras.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '<COLE_AQUI>',
  storageBucket: extras.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '<COLE_AQUI>',
  messagingSenderId: extras.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '<COLE_AQUI>',
  appId: extras.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '<COLE_AQUI>',
};

// Inicializa Firebase apenas se ainda não houver apps
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta auth e db
export const auth = getAuth(app);
export const db = getFirestore(app);
