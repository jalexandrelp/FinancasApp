// app/contexts/accountsContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

type Account = {
  id: string;
  name: string;
  balance: number;
};

type AccountsContextType = {
  accounts: Account[];
  addAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
};

export const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export default function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = (account: Account) => {
    setAccounts((prev) => [...prev, account]);
  };

  const updateAccount = (account: Account) => {
    setAccounts((prev) => prev.map((a) => (a.id === account.id ? account : a)));
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AccountsContext.Provider value={{ accounts, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AccountsContext.Provider>
  );
}
