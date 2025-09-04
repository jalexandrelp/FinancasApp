// app/contexts/themeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = {
  background: string;
  card: string;
  text: string;
  primary: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const defaultLightTheme: Theme = {
  background: '#f5f5f5',
  card: '#fff',
  text: '#000',
  primary: '#2a9d8f',
};

const defaultDarkTheme: Theme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#fff',
  primary: '#2a9d8f',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(defaultLightTheme);

  // Carrega o tema salvo no AsyncStorage ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@app_theme');
        if (savedTheme) {
          setTheme(savedTheme === 'dark' ? defaultDarkTheme : defaultLightTheme);
        }
      } catch (error) {
        console.log('Erro ao carregar tema:', error);
      }
    };
    loadTheme();
  }, []);

  // Função para alternar tema e salvar no AsyncStorage
  const toggleTheme = async () => {
    try {
      setTheme((prev) => {
        const newTheme = prev.background === defaultLightTheme.background ? defaultDarkTheme : defaultLightTheme;
        AsyncStorage.setItem('@app_theme', newTheme.background === defaultDarkTheme.background ? 'dark' : 'light');
        return newTheme;
      });
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeProvider;
