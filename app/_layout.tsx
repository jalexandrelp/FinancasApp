import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform, ViewStyle } from 'react-native';
import { Slot } from 'expo-router';

import ThemeProvider from '../src/contexts/themeContext';
import { AuthProvider } from '../src/contexts/authContext';
import { TransactionsProvider } from '../src/contexts/transactionsContext';
import SettingsProvider from '../src/contexts/settingsContext';
import { AccountsProvider } from '../src/contexts/accountsContext';
import FinanceProvider from '../src/contexts/financeContext';

const ROOT_VIEW_STYLE: ViewStyle = { flex: 1 };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={ROOT_VIEW_STYLE}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <TransactionsProvider>
              <SettingsProvider>
                <AccountsProvider>
                  <FinanceProvider>
                    {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
                    <Slot />
                  </FinanceProvider>
                </AccountsProvider>
              </SettingsProvider>
            </TransactionsProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
// O RootLayout envolve toda a aplicação, fornecendo contextos globais como autenticação, tema, transações, configurações, contas e finanças
// Usa SafeAreaProvider para lidar com áreas seguras em dispositivos com entalhes
// Usa GestureHandlerRootView para suporte a gestos em toda a aplicação
// O Slot é um componente do Expo Router que renderiza a tela filha correspondente à rota atual
// Neste caso, ele renderiza as telas dentro da pasta "app"