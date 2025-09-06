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
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const extra: any = Constants.expoConfig?.extra || {};

  // Web: useProxy=false -> redirect http://localhost:8081
  // Android/iOS (Expo Go): useProxy=true -> redirect https://auth.expo.dev/...
  const usingProxy = Platform.OS !== 'web';
  const redirectUri = makeRedirectUri({ scheme: 'financasapp', useProxy: usingProxy });

  const [request, response, promptAsync] = Google.useAuthRequest({
    // deixe explícito para o Web:
    clientId: extra.GOOGLE_WEB_CLIENT_ID,
    webClientId: extra.GOOGLE_WEB_CLIENT_ID,
    // Android:
    androidClientId: extra.GOOGLE_ANDROID_CLIENT_ID,

    redirectUri,
    scopes: ['profile', 'email'],

    // 👇 garante que o Google devolva um id_token (necessário no Firebase)
    responseType: 'id_token',
    // qualidade de vida:
    extraParams: { prompt: 'select_account' },
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      if (response?.type !== 'success') return;

      // No Web, com responseType 'id_token', o token vem em params.id_token
      const idToken =
        (response.params as any)?.id_token ||
        (response as any)?.authentication?.idToken;

      if (!idToken) {
        Alert.alert('Erro Google', 'ID token não retornado pela autenticação.');
        return;
      }

      try {
        const cred = GoogleAuthProvider.credential(idToken);
        const res = await signInWithCredential(auth, cred);

        // cria doc do usuário se não existir
        const uid = res.user.uid;
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            email: res.user.email,
            name: res.user.displayName ?? '',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (e: any) {
        Alert.alert('Erro Google', e?.message ?? 'Falha ao autenticar com Google');
      }
    })();
  }, [response, db]);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    await setDoc(doc(db, 'users', uid), {
      email: res.user.email,
      name: res.user.displayName ?? '',
      createdAt: new Date().toISOString(),
    });
  };

  const signInWithGoogle = async () => {
    if (!request) {
      Alert.alert('Google Auth', 'Solicitação de login não inicializada.');
      return;
    }
    await promptAsync({ useProxy: usingProxy, showInRecents: true });
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
