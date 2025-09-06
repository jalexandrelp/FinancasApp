// app/auth/login.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/authContext';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, signInEmail, signUpEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) router.replace('../tabs/dashboard');
  }, [user, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

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

      <Button title="Entrar" onPress={() => signInEmail(email, password).catch(e => Alert.alert('Erro', e.message))} />
      <View style={{ height: 12 }} />
      <Button title="Criar conta" onPress={() => signUpEmail(email, password).catch(e => Alert.alert('Erro', e.message))} />
      <View style={{ height: 24 }} />
      <Button title="Entrar com Google" onPress={() => signInWithGoogle().catch(e => Alert.alert('Erro Google', e.message))} />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
});
