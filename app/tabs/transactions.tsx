// app/tabs/transactions.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      <Text style={styles.p}>Versão placeholder sem dependências.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  p: { textAlign: 'center', color: '#666' },
});
