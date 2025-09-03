import React, { createContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  background: string;
  text: string;
  cardBackground: string;
  placeholder: string;
  border: string;
  statusBar: 'light-content' | 'dark-content';
};

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  theme: {
    background: '#f0f4f8',
    text: '#264653',
    cardBackground: '#fff',
    placeholder: '#999',
    border: '#ccc',
    statusBar: 'dark-content',
  },
});

type Props = { children: ReactNode };

export const ThemeProvider = ({ children }: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const themeStored = await AsyncStorage.getItem('@darkMode');
        if (themeStored) setDarkMode(themeStored === 'true');
      } catch (err) {
        console.error('Erro ao carregar tema', err);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      AsyncStorage.setItem('@darkMode', (!prev).toString()).catch(console.error);
      return !prev;
    });
  };

  const theme: Theme = darkMode
    ? {
        background: '#264653',
        text: '#f0f4f8',
        cardBackground: '#333',
        placeholder: '#ccc',
        border: '#444',
        statusBar: 'light-content',
      }
    : {
        background: '#f0f4f8',
        text: '#264653',
        cardBackground: '#fff',
        placeholder: '#999',
        border: '#ccc',
        statusBar: 'dark-content',
      };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
