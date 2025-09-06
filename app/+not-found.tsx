import React from 'react';
import { StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedText type="title">This screen does not exist.</ThemedText>
      <Link href="/">
        <ThemedText type="link" style={styles.link}>
          Go to home screen!
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
// Tela exibida quando o usuário navega para uma rota inexistente
// Fornece um link para retornar à tela inicial
// Usa componentes temáticos para se adaptar ao tema claro/escuro da aplicação