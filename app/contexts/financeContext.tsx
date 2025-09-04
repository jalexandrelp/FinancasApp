// app/contexts/financeContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

type FinanceContextType = {
  income: number;
  expenses: number;
  addIncome: (value: number) => void;
  addExpense: (value: number) => void;
  resetFinance: () => void;
};

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export default function FinanceProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const addIncome = (value: number) => setIncome((prev) => prev + value);
  const addExpense = (value: number) => setExpenses((prev) => prev + value);
  const resetFinance = () => {
    setIncome(0);
    setExpenses(0);
  };

  return (
    <FinanceContext.Provider value={{ income, expenses, addIncome, addExpense, resetFinance }}>
      {children}
    </FinanceContext.Provider>
  );
}
