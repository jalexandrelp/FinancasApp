// app/contexts/themeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

  const toggleTheme = () => {
    setTheme(prev => (prev.background === '#f5f5f5' ? defaultDarkTheme : defaultLightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeProvider;
