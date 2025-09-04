// app/contexts/settingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Category = { id: string; name: string };
export type Account = { id: string; name: string };

type SettingsContextType = {
  categories: Category[];
  accounts: Account[];
  addCategory: (c: Category) => void;
  removeCategory: (id: string) => void;
  addAccount: (a: Account) => void;
  removeAccount: (id: string) => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const removeCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const addAccount = (a: Account) => setAccounts(prev => [...prev, a]);
  const removeAccount = (id: string) => setAccounts(prev => prev.filter(a => a.id !== id));

  return (
    <SettingsContext.Provider
      value={{ categories, accounts, addCategory, removeCategory, addAccount, removeAccount }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export default SettingsProvider;
