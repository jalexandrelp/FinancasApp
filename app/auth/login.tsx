// app/auth/login.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';

export default function LoginScreen() {
  const router = useRouter();

  // Android: placeholder, sem auth
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login (Android placeholder)</Text>
        <Button title="Entrar (placeholder)" onPress={() => router.replace('/tabs/dashboard')} />
      </View>
    );
  }

  // Web: carrega dinamicamente o Auth
  const { useAuth } = require('../../src/contexts/authContext');
  const { loading, signInEmail, signUpEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectUri = useMemo(
    () => makeRedirectUri({ scheme: 'financasapp', useProxy: false }), // web -> http://localhost:8081
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar (Web)</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button
        title="Entrar"
        onPress={async () => {
          try { await signInEmail(email, password); }
          catch (e: any) { Alert.alert('Erro', e?.message ?? 'Falha ao entrar'); }
        }}
      />
      <View style={{ height: 12 }} />
      <Button
        title="Criar conta"
        onPress={async () => {
          try { await signUpEmail(email, password); }
          catch (e: any) { Alert.alert('Erro', e?.message ?? 'Falha ao criar conta'); }
        }}
      />
      <View style={{ height: 24 }} />
      <Button
        title="Entrar com Google"
        onPress={async () => {
          try { await signInWithGoogle(); }
          catch (e: any) { Alert.alert('Erro Google', e?.message ?? 'Falha ao autenticar com Google'); }
        }}
      />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      <View style={{ height: 24 }} />
      <Text style={styles.hintTitle}>Debug de OAuth</Text>
      <Text style={styles.hint}>redirectUri: {redirectUri}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  hintTitle: { fontSize: 16, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  hint: { textAlign: 'center', color: '#555' },
});
