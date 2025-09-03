// app/settingsContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type Account = { id: string; name: string };
export type Card = { id: string; name: string };
export type Category = { id: string; name: string };

type SettingsContextType = {
  accounts: Account[];
  cards: Card[];
  categories: Category[];
  addAccount: (a: Account) => void;
  editAccount: (id: string, name: string) => void;
  removeAccount: (id: string) => void;
  addCard: (c: Card) => void;
  editCard: (id: string, name: string) => void;
  removeCard: (id: string) => void;
  addCategory: (c: Category) => void;
  editCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
};

export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const acc = await AsyncStorage.getItem('accounts');
    const crd = await AsyncStorage.getItem('cards');
    const cat = await AsyncStorage.getItem('categories');
    if (acc) setAccounts(JSON.parse(acc));
    if (crd) setCards(JSON.parse(crd));
    if (cat) setCategories(JSON.parse(cat));
  };

  const saveData = async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  };

  // ===== Contas =====
  const addAccount = (a: Account) => { const newArr = [...accounts, a]; setAccounts(newArr); saveData('accounts', newArr); };
  const editAccount = (id: string, name: string) => { 
    const newArr = accounts.map(a => a.id === id ? { ...a, name } : a); 
    setAccounts(newArr); saveData('accounts', newArr);
  };
  const removeAccount = (id: string) => { 
    const newArr = accounts.filter(a => a.id !== id); 
    setAccounts(newArr); saveData('accounts', newArr);
  };

  // ===== Cartões =====
  const addCard = (c: Card) => { const newArr = [...cards, c]; setCards(newArr); saveData('cards', newArr); };
  const editCard = (id: string, name: string) => { 
    const newArr = cards.map(c => c.id === id ? { ...c, name } : c); 
    setCards(newArr); saveData('cards', newArr);
  };
  const removeCard = (id: string) => { 
    const newArr = cards.filter(c => c.id !== id); 
    setCards(newArr); saveData('cards', newArr);
  };

  // ===== Categorias =====
  const addCategory = (c: Category) => { const newArr = [...categories, c]; setCategories(newArr); saveData('categories', newArr); };
  const editCategory = (id: string, name: string) => { 
    const newArr = categories.map(c => c.id === id ? { ...c, name } : c); 
    setCategories(newArr); saveData('categories', newArr);
  };
  const removeCategory = (id: string) => { 
    const newArr = categories.filter(c => c.id !== id); 
    setCategories(newArr); saveData('categories', newArr);
  };

  return (
    <SettingsContext.Provider value={{
      accounts, cards, categories,
      addAccount, editAccount, removeAccount,
      addCard, editCard, removeCard,
      addCategory, editCategory, removeCategory
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
