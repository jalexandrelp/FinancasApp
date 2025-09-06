// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../../src/contexts/themeContext';

export default function TabsLayout() {
  const themeContext = useContext(ThemeContext);
  const insets = useSafeAreaInsets(); // pega o padding seguro da tela

  if (!themeContext) return null;

  const { theme } = themeContext;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // só ícones
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#555',
        tabBarStyle: {
          backgroundColor: Platform.OS === 'android' ? theme.card : undefined,
          borderTopColor: '#ddd',
          height: 60 + insets.bottom,   // aumenta a altura do TabBar
          paddingBottom: insets.bottom + 5, // dá um espacinho extra
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
