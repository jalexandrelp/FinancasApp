// src/contexts/accountsContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Account = { id: string; name: string; balance?: number };
export type Profile = { id: string; name: string };

export type AccountsContextType = {
  accounts: Account[];
  addAccount: (a: Account) => void;
  updateAccount: (a: Account) => void;
  deleteAccount: (id: string) => void;
  updateBalance: (accountName: string, delta: number) => void;
  profiles: Profile[];
  addProfile: (p: Profile) => void;
  updateProfile: (p: Profile) => void;
  deleteProfile: (id: string) => void;
};

export const AccountsContext = createContext<AccountsContextType | null>(null);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([
    // exemplo: { id: 'a1', name: 'Conta Principal', balance: 0 }
  ]);

  const [profiles, setProfiles] = useState<Profile[]>([]);

  const addAccount = (a: Account) => setAccounts(prev => [...prev, a]);
  const updateAccount = (a: Account) => setAccounts(prev => prev.map(p => (p.id === a.id ? a : p)));
  const deleteAccount = (id: string) => setAccounts(prev => prev.filter(p => p.id !== id));
  const updateBalance = (accountName: string, delta: number) => {
    setAccounts(prev => prev.map(a => a.name === accountName ? { ...a, balance: (a.balance || 0) + delta } : a));
  };

  const addProfile = (p: Profile) => setProfiles(prev => [...prev, p]);
  const updateProfile = (p: Profile) => setProfiles(prev => prev.map(x => (x.id === p.id ? p : x)));
  const deleteProfile = (id: string) => setProfiles(prev => prev.filter(x => x.id !== id));

  return (
    <AccountsContext.Provider value={{
      accounts, addAccount, updateAccount, deleteAccount, updateBalance,
      profiles, addProfile, updateProfile, deleteProfile
    }}>
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;
