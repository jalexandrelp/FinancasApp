// app/(tabs)/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const options = {
  title: 'Dashboard',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons name="home-outline" size={size} color={color} />
  ),
};

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
