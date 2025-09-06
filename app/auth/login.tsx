// app/auth/login.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.p}>
        Versão mínima para estabilizar o Router no Android.
      </Text>

      {/* Botão temporário só para validar navegação */}
      <View style={{ height: 16 }} />
      <Button title="Entrar (placeholder)" onPress={() => router.replace('/tabs/dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  p: { textAlign: 'center', color: '#666' },
});
