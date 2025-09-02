import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type Transaction = {
  id: string;
  desc: string;
  type: 'Entrada' | 'Saída';
  value: string;
  category: string;
  account: string;
  date: string;
  isCreditCard: boolean;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  editTransaction: (id: string, updatedTx: Transaction) => void;
  removeTransaction: (id: string) => void;
};

export const TransactionsContext = createContext<TransactionsContextType>({
  transactions: [],
  addTransaction: () => {},
  editTransaction: () => {},
  removeTransaction: () => {},
});

type Props = { children: ReactNode };

export const TransactionsProvider = ({ children }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Carregar do AsyncStorage
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem('@transactions');
        if (data) setTransactions(JSON.parse(data));
      } catch (err) {
        console.error('Erro ao carregar transações', err);
      }
    };
    loadTransactions();
  }, []);

  // Salvar sempre que mudar
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('@transactions', JSON.stringify(transactions));
      } catch (err) {
        console.error('Erro ao salvar transações', err);
      }
    };
    saveTransactions();
  }, [transactions]);

  const addTransaction = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);
  const editTransaction = (id: string, updatedTx: Transaction) =>
    setTransactions(prev => prev.map(t => (t.id === id ? updatedTx : t)));
  const removeTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, editTransaction, removeTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

// Export default para evitar warning do Router
export default TransactionsProvider;
