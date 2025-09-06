// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // Layout raiz mínimo: sem providers por enquanto (isolar Router)
  return <Stack screenOptions={{ headerShown: false }} />;
}
