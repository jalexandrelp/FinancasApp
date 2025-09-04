// app/(tabs)/_layout.tsx
import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { ThemeContext } from '../contexts/themeContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const themeContext = useContext(ThemeContext);

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
          height: 60,
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
