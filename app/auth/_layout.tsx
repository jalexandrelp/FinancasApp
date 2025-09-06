import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
// Layout simples que envolve as telas de autenticação
// O Slot é um componente do Expo Router que renderiza a tela filha correspondente à rota atual
// Neste caso, ele renderiza as telas dentro da pasta "auth" (login, registro, etc.)