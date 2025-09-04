// app/contexts/transactionsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  account: string;
  amount: number;
  date: string;
  desc: string;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
};

export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, removeTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error('useTransactions must be used within a TransactionsProvider');
  return context;
};

export default TransactionsProvider;
