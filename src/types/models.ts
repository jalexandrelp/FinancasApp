// src/types/models.ts
export type UUID = string;

export interface User {
  id: UUID;
  name?: string;
  email: string;
  createdAt?: string;
}

export interface Account {
  id?: UUID;
  name: string;
  type: 'checking' | 'savings' | 'wallet' | 'investment';
  balance: number;
  color?: string;
}

export interface Transaction {
  id?: UUID;
  date: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId?: UUID;
  accountId?: UUID;
  cardId?: UUID;
  createdAt?: string;
}
