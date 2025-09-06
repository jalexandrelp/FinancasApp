import 'firebase/auth';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getExtra() {
  const extras =
    (Constants.expoConfig?.extra as Record<string, string> | undefined) ||
    // @ts-ignore (compat)
    (Constants.manifest?.extra as Record<string, string> | undefined) ||
    {};
  return extras;
}

let app: any, auth: any, db: any;

export function getFirebase() {
  if (app && auth && db) return { app, auth, db };

  const extra = getExtra();
  const firebaseConfig = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.FIREBASE_AUTH_DOMAIN,
    projectId: extra.FIREBASE_PROJECT_ID,
    storageBucket: extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: extra.FIREBASE_APP_ID,
  };

  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      auth = getAuth(app);
    }
  } else {
    auth = getAuth(app);
  }

  db = getFirestore(app);
  return { app, auth, db };
}
