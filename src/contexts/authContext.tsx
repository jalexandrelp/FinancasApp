// src/contexts/authContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
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

  // Lê IDs do Google do app.config.ts (extra)
  const extra: any = Constants.expoConfig?.extra || {};

  // Redirect com scheme do app + proxy do Expo (funciona Web/Android)
  const redirectUri = makeRedirectUri({ scheme: 'financasapp', useProxy: true });

  // Google Auth (usa clientId web + androidClientId do extra)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: extra.GOOGLE_WEB_CLIENT_ID,
    androidClientId: extra.GOOGLE_ANDROID_CLIENT_ID,
    // iosClientId pode ser adicionado no futuro se publicar em iOS
    redirectUri,
    scopes: ['profile', 'email'],
  });

  // Trata retorno do Google → Firebase
  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        // id_token retorna via params quando useProxy=true
        const idToken =
          (response.params as any)?.id_token ||
          (response as any)?.authentication?.idToken;

        if (!idToken) {
          Alert.alert('Erro Google', 'ID token não retornado pela autenticação.');
          return;
        }

        try {
          const credential = GoogleAuthProvider.credential(idToken);
          const res = await signInWithCredential(auth, credential);

          // Cria doc do usuário se não existir
          const uid = res.user.uid;
          const userRef = doc(db, 'users', uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              email: res.user.email,
              name: res.user.displayName ?? '',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e: any) {
          Alert.alert('Erro Google', e?.message ?? 'Falha ao autenticar com Google.');
        }
      }
    })();
  }, [response]);

  // Observa sessão Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
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
    await promptAsync({ useProxy: true, showInRecents: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
