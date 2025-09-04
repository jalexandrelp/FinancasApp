// app/contexts/financeContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Card = { id: string; name: string };
export type Category = { id: string; name: string };

type FinanceContextType = {
  income: number;
  expenses: number;
  cards: Card[];
  categories: Category[];
  addIncome: (value: number) => void;
  addExpense: (value: number) => void;
  resetFinance: () => void;
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (id: string) => void;
  addCategory: (cat: Category) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
};

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = '@financas/finance_v1';

export default function FinanceProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.income === 'number') setIncome(parsed.income);
          if (typeof parsed.expenses === 'number') setExpenses(parsed.expenses);
          if (Array.isArray(parsed.cards)) setCards(parsed.cards);
          if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
        }
      } catch (e) {
        console.warn('FinanceProvider: erro ao carregar dados', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const payload = JSON.stringify({ income, expenses, cards, categories });
        await AsyncStorage.setItem(STORAGE_KEY, payload);
      } catch (e) {
        console.warn('FinanceProvider: erro ao salvar dados', e);
      }
    })();
  }, [income, expenses, cards, categories]);

  const addIncome = (value: number) => setIncome(prev => prev + value);
  const addExpense = (value: number) => setExpenses(prev => prev + value);
  const resetFinance = () => { setIncome(0); setExpenses(0); };

  // cards
  const addCard = (card: Card) => setCards(prev => [...prev, card]);
  const updateCard = (card: Card) => setCards(prev => prev.map(c => (c.id === card.id ? card : c)));
  const deleteCard = (id: string) => setCards(prev => prev.filter(c => c.id !== id));

  // categories
  const addCategory = (cat: Category) => setCategories(prev => [...prev, cat]);
  const updateCategory = (cat: Category) => setCategories(prev => prev.map(c => (c.id === cat.id ? cat : c)));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  return (
    <FinanceContext.Provider
      value={{
        income,
        expenses,
        cards,
        categories,
        addIncome,
        addExpense,
        resetFinance,
        addCard,
        updateCard,
        deleteCard,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
