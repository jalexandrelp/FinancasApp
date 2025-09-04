// app/(tabs)/reports.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const options = {
  title: 'Relatórios',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons name="bar-chart-outline" size={size} color={color} />
  ),
};

export default function Reports() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Relatórios</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
