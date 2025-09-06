// app/_layout.tsx
import React, { useEffect } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';

// ⚠️ Nada de importar AuthContext aqui no topo.
// Vamos carregar dinamicamente apenas no Web.

function WebAuthTree() {
  const router = useRouter();
  const navState = useRootNavigationState();

  // carrega dinamicamente o context só no web
  const { useAuth } = require('../src/contexts/authContext');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!navState?.key) return;
    if (loading) return;
    router.replace(user ? '/tabs/dashboard' : '/auth/login');
  }, [navState?.key, loading, user, router]);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  if (Platform.OS === 'web') {
    const { AuthProvider } = require('../src/contexts/authContext');
    return (
      <AuthProvider>
        <WebAuthTree />
      </AuthProvider>
    );
  }

  // Android/iOS: layout mínimo, sem providers
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
