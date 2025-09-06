import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebase } from '../firebase/config';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth, db } = getFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const extra =
    (Constants.expoConfig?.extra as any) ||
    // @ts-ignore
    (Constants.manifest?.extra as any) ||
    {};

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: extra.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: extra.GOOGLE_WEB_CLIENT_ID, // ← usa o NOVO ID
    responseType: 'id_token',
    usePKCE: true,
    redirectUri,
    scopes: ['openid', 'email', 'profile'],
  });

  // DEBUG – garante que estamos usando o ID certo e o redirect certo
  useEffect(() => {
    console.log('[GoogleAuth] ids', {
      android: extra.GOOGLE_ANDROID_CLIENT_ID,
      web: extra.GOOGLE_WEB_CLIENT_ID,
      redirectUri,
    });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    }, (e) => {
      console.error('[AuthProvider] onAuthStateChanged init error:', e);
    });
    return unsub;
  }, [auth]);

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        try {
          const idToken = (response.params as any).id_token;
          const credential = GoogleAuthProvider.credential(idToken);
          const res = await signInWithCredential(auth, credential);

          const uid = res.user.uid;
          const userRef = doc(db, 'users', uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, { email: res.user.email, createdAt: new Date() });
          }
        } catch (e: any) {
          console.error('[AuthProvider] Google signIn error:', e);
          Alert.alert('Erro Google', e.message ?? String(e));
        }
      }
    })();
  }, [response, auth, db]);

  const signInEmail = async (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signUpEmail = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), { email: res.user.email, createdAt: new Date() });
  };

  const signInWithGoogle = async () => {
    if (!request) return;
    await promptAsync({ useProxy: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
