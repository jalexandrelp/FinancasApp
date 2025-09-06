// app/_layout.tsx
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Use apenas o que temos certeza: AuthProvider é named export na sua base
import { AuthProvider } from '../src/contexts/authContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
          <Slot />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
