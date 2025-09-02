import React, { createContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

type Props = { children: ReactNode };

export const ThemeProvider = ({ children }: Props) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('@darkMode');
        if (theme) setDarkMode(theme === 'true');
      } catch (err) {
        console.error('Erro ao carregar tema', err);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    try {
      setDarkMode(prev => {
        AsyncStorage.setItem('@darkMode', (!prev).toString()).catch(err =>
          console.error('Erro ao salvar tema', err)
        );
        return !prev;
      });
    } catch (err) {
      console.error('Erro ao alternar tema', err);
    }
  };

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
