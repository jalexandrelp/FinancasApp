// _layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { ThemeProvider } from '../themeContext';
import { TransactionsProvider } from '../transactionsContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <TransactionsProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2a9d8f',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: { backgroundColor: '#fff' },
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Início',
              tabBarLabel: 'Início',
              tabBarIcon: () => <Text>🏠</Text>,
            }}
          />
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Transações',
              tabBarLabel: 'Transações',
              tabBarIcon: () => <Text>📋</Text>,
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: 'Relatórios',
              tabBarLabel: 'Relatórios',
              tabBarIcon: () => <Text>📊</Text>,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Configurações',
              tabBarLabel: 'Configurações',
              tabBarIcon: () => <Text>⚙️</Text>,
            }}
          />
        </Tabs>
      </TransactionsProvider>
    </ThemeProvider>
  );
}

