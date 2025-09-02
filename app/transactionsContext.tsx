// app/transactionsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export type Transaction = {
  id: string;
  desc: string;
  type: 'Entrada' | 'Saída';
  value: string;      // ex: "R$ 12,50"
  category?: string;
  date?: string;      // opcional (ex: '2025-09-02')
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
};

export const TransactionsContext = createContext<TransactionsContextType>({
  transactions: [],
  addTransaction: () => {},
  removeTransaction: () => {},
  updateTransaction: () => {},
});

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, patch: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, removeTransaction, updateTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
