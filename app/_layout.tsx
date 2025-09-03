import React from 'react';
import { TransactionsProvider } from './transactionsContext';
import { ThemeProvider } from './themeContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
        </Stack>
        <StatusBar style="auto" />
      </TransactionsProvider>
    </ThemeProvider>
  );
}
