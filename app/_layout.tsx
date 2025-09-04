// app/_layout.tsx
import React from 'react';
import ThemeProvider from './contexts/themeContext';
import { TransactionsProvider } from './contexts/transactionsContext';
import SettingsProvider from './contexts/settingsContext';
import { AccountsProvider } from './contexts/accountsContext';
import FinanceProvider from './contexts/financeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, Platform } from 'react-native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <TransactionsProvider>
            <SettingsProvider>
              <AccountsProvider>
                <FinanceProvider>
                  {/* Ajusta o padding no Android para StatusBar */}
                  {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
                  <Slot />
                </FinanceProvider>
              </AccountsProvider>
            </SettingsProvider>
          </TransactionsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
