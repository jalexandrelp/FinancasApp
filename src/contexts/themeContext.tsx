// src/contexts/themeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Theme = {
  background: string;
  card: string;
  text: string;
  primary: string;
  // adicionado para compatibilidade com TransactionsPage
  income?: string;
  expense?: string;
};

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  mode?: 'light' | 'dark' | string;
  userName?: string;
};

const defaultLightTheme: Theme = {
  background: '#f5f5f5',
  card: '#fff',
  text: '#000',
  primary: '#2a9d8f',
  income: 'green',
  expense: 'red',
};

const defaultDarkTheme: Theme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#fff',
  primary: '#2a9d8f',
  income: 'lightgreen',
  expense: '#ff8a80',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(defaultLightTheme);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('@app_theme');
        if (saved === 'dark') {
          setTheme(defaultDarkTheme);
          setMode('dark');
        } else {
          setTheme(defaultLightTheme);
          setMode('light');
        }
      } catch (e) {
        console.log('Erro ao carregar tema:', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      setTheme(prev => {
        const newTheme = prev.background === defaultLightTheme.background ? defaultDarkTheme : defaultLightTheme;
        AsyncStorage.setItem('@app_theme', newTheme.background === defaultDarkTheme.background ? 'dark' : 'light');
        setMode(newTheme.background === defaultDarkTheme.background ? 'dark' : 'light');
        return newTheme;
      });
    } catch (e) {
      console.log('Erro ao salvar tema:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode, userName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

export default ThemeProvider;
