import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../../src/contexts/authContext';
import { makeRedirectUri } from 'expo-auth-session';

export default function LoginScreen() {
  const { signInEmail, signUpEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const usingProxy = Platform.OS !== 'web';
  let redirectUri = makeRedirectUri({ useProxy: usingProxy });
  if (usingProxy && redirectUri.startsWith('exp://')) {
    redirectUri = 'https://auth.expo.dev/@jalexandrelp/FinancasApp';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} autoCapitalize="none" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Senha" style={styles.input} secureTextEntry />
      <Button title="ENTRAR" onPress={() => signInEmail(email, password)} />
      <View style={{ height: 12 }} />
      <Button title="CRIAR CONTA" onPress={() => signUpEmail(email, password)} />
      <View style={{ height: 12 }} />
      <Button title="ENTRAR COM GOOGLE" onPress={signInWithGoogle} />
      <View style={{ height: 16 }} />
      <Text style={{ textAlign: 'center', color: '#666' }}>redirectUri: {redirectUri}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 12 },
});
