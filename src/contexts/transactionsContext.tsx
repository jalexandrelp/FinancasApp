import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountsContext } from './accountsContext';

export type Transaction = {
  id: string;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  account: string;
  category: string;
  card?: string;
  date: string;
  isCreditCard?: boolean;
};

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
};

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const accountsCtx = useContext(AccountsContext);

  useEffect(() => {
    const loadTx = async () => {
      const json = await AsyncStorage.getItem('@transactions');
      if (json) setTransactions(JSON.parse(json));
    };
    loadTx();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
    if (accountsCtx) {
      const delta = t.type === 'income' ? t.amount : -t.amount;
      accountsCtx.updateBalance(t.account, delta);
    }
  };

  const updateTransaction = (t: Transaction) => {
    const oldTx = transactions.find((tr) => tr.id === t.id);
    setTransactions((prev) => prev.map((tr) => (tr.id === t.id ? t : tr)));

    if (accountsCtx && oldTx) {
      // reverter o saldo antigo
      const oldDelta = oldTx.type === 'income' ? oldTx.amount : -oldTx.amount;
      accountsCtx.updateBalance(oldTx.account, -oldDelta);

      // aplicar o novo saldo
      const newDelta = t.type === 'income' ? t.amount : -t.amount;
      accountsCtx.updateBalance(t.account, newDelta);
    }
  };

  const removeTransaction = (id: string) => {
    const tx = transactions.find((tr) => tr.id === id);
    setTransactions((prev) => prev.filter((tr) => tr.id !== id));

    if (accountsCtx && tx) {
      const delta = tx.type === 'income' ? -tx.amount : tx.amount;
      accountsCtx.updateBalance(tx.account, delta);
    }
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, updateTransaction, removeTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
export default TransactionsProvider;