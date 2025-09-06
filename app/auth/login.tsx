import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/authContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, signInEmail, signUpEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) router.replace('../tabs/dashboard');
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInEmail(email, password);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpEmail(email, password);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      Alert.alert('Erro Google', e.message);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={Platform.OS === 'android' ? '#000' : '#0a7ea4'} />
        {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Login</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleSignIn} />
      <View style={{ height: 10 }} />
      <Button title="Criar Conta" onPress={handleSignUp} />

      <View style={{ height: 20 }} />
      <ThemedText style={{ textAlign: 'center', marginBottom: 10 }}>Ou</ThemedText>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <ThemedText type="link" style={styles.googleText}>Entrar com Google</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  googleButton: { backgroundColor: '#4285F4', padding: 12, borderRadius: 5 },
  googleText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
// Tela de login que permite autenticação via email/senha ou Google
// Usa o contexto de autenticação para gerenciar o estado do usuário
// Redireciona para o dashboard se o usuário já estiver logado
// Exibe mensagens de erro em caso de falha na autenticação
// Adapta o estilo ao tema atual usando componentes temáticos personalizados