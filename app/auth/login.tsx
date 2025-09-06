// app/auth/login.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';

export default function LoginScreen() {
  const router = useRouter();

  // Mostra o redirectUri REAL que o Google vê (use para corrigir o redirect_uri_mismatch no Web)
  const redirectUri = useMemo(
    () => makeRedirectUri({ scheme: 'financasapp', useProxy: true }),
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login (placeholder)</Text>

      <Button title="Entrar (placeholder)" onPress={() => router.replace('/tabs/dashboard')} />

      <View style={{ height: 24 }} />
      <Text style={styles.hintTitle}>Debug de OAuth</Text>
      <Text style={styles.hint}>
        Redirecionamento usado pelo AuthSession:
      </Text>
      <Text selectable style={styles.uri}>
        {redirectUri}
      </Text>
      <Text style={styles.hintSmall}>
        ➜ No Google Cloud Console (OAuth Web Client), adicione este valor em{"\n"}
        <Text style={{ fontWeight: '700' }}>Authorized redirect URIs</Text>.
      </Text>
      {Platform.OS === 'web' && (
        <Text style={styles.hintSmall}>
          Também adicione <Text style={{ fontWeight: '700' }}>http://localhost:8081</Text> em{" "}
          <Text style={{ fontWeight: '700' }}>Authorized JavaScript origins</Text>.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  hintTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  hint: { textAlign: 'center', color: '#555' },
  hintSmall: { textAlign: 'center', color: '#666', marginTop: 6, fontSize: 12 },
  uri: { marginTop: 8, textAlign: 'center', color: '#0a7ea4' },
});
