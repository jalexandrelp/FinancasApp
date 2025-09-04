import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Account = {
  id: string;
  name: string;
  balance: number;
};

type AccountsContextType = {
  accounts: Account[];
  addAccount: (a: Account) => void;
  updateAccount: (a: Account) => void;
  removeAccount: (id: string) => void;
  updateBalance: (accountName: string, delta: number) => void; // 🔹 nova função
};

export const AccountsContext = createContext<AccountsContextType | null>(null);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const loadAccounts = async () => {
      const json = await AsyncStorage.getItem('@accounts');
      if (json) setAccounts(JSON.parse(json));
    };
    loadAccounts();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (a: Account) => setAccounts((prev) => [...prev, a]);
  const updateAccount = (a: Account) =>
    setAccounts((prev) => prev.map((acc) => (acc.id === a.id ? a : acc)));
  const removeAccount = (id: string) =>
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));

  // 🔹 função que atualiza saldo da conta com base em delta (positivo ou negativo)
  const updateBalance = (accountName: string, delta: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.name === accountName ? { ...acc, balance: acc.balance + delta } : acc
      )
    );
  };

  return (
    <AccountsContext.Provider
      value={{ accounts, addAccount, updateAccount, removeAccount, updateBalance }}
    >
      {children}
    </AccountsContext.Provider>
  );
};
export default AccountsProvider;