// src/contexts/authContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutApp: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lazy load do Firebase para evitar "Component auth has not been registered yet"
async function getFirebase() {
  const { initializeApp, getApps } = await import('firebase/app');
  // registra o módulo de auth para RN
  await import('firebase/auth');
  const { getAuth } = await import('firebase/auth');
  const { getFirestore } = await import('firebase/firestore');

  const extra = (Constants.expoConfig?.extra ||
    // @ts-ignore
    Constants.manifest?.extra ||
    {}) as Record<string, string>;

  const firebaseConfig = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.FIREBASE_AUTH_DOMAIN,
    projectId: extra.FIREBASE_PROJECT_ID,
    storageBucket: extra.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: extra.FIREBASE_APP_ID,
  };

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // IMPORTANTE: força o proxy no native (Android/iOS) durante o desenvolvimento.
  // Isso faz o redirectUri ser https://auth.expo.dev/@<user>/FinancasApp
  const usingProxy = Platform.OS !== 'web';
  const redirectUri = makeRedirectUri({ useProxy: usingProxy });
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // Carrega GOOGLE_* do app.config.ts (extra)
  const extra = (Constants.expoConfig?.extra ||
    // @ts-ignore
    Constants.manifest?.extra ||
    {}) as Record<string, string>;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: extra.GOOGLE_WEB_CLIENT_ID,
    expoClientId: extra.GOOGLE_WEB_CLIENT_ID,     // necessário no Expo Go
    webClientId: extra.GOOGLE_WEB_CLIENT_ID,
    androidClientId: extra.GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    extraParams: { prompt: 'select_account' },
  });

  // Trata retorno do Google
  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const { auth, db } = await getFirebase();
          const res = await signInWithCredential(auth, credential);

          const uid = res.user.uid;
          const ref = doc(db, 'users', uid);
          const snap = await getDoc(ref);
          if (!snap.exists()) {
            await setDoc(ref, {
              email: res.user.email,
              createdAt: new Date(),
            });
          }
        } catch (e: any) {
          Alert.alert('Erro Google', e?.message ?? String(e));
        }
      }
    })();
  }, [response]);

  // Listener de sessão
  useEffect(() => {
    (async () => {
      try {
        const { auth } = await getFirebase();
        const unsub = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
        return () => unsub();
      } catch (e) {
        // apenas log em dev; evita travar a UI
        if (__DEV__) console.log('[AuthProvider] onAuthStateChanged init error:', e);
        setLoading(false);
      }
    })();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    const { auth } = await getFirebase();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string) => {
    const { auth, db } = await getFirebase();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    await setDoc(doc(db, 'users', uid), {
      email: res.user.email,
      createdAt: new Date(),
    });
  };

  const signInWithGoogle = async () => {
    // passa useProxy para garantir o fluxo correto no native
    await promptAsync({ useProxy: usingProxy, showInRecents: true });
  };

  const signOutApp = async () => {
    const { auth } = await getFirebase();
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInEmail, signUpEmail, signInWithGoogle, signOutApp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
