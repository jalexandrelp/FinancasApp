// src/services/firestore.ts
import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Collections: users, accounts, categories, transactions, cards, cardCharges

export const usersCollection = () => collection(db, 'users');
export const accountsCollection = (userId: string) => collection(db, `users/${userId}/accounts`);
export const categoriesCollection = (userId: string) => collection(db, `users/${userId}/categories`);
export const transactionsCollection = (userId: string) => collection(db, `users/${userId}/transactions`);
export const cardsCollection = (userId: string) => collection(db, `users/${userId}/cards`);
export const cardChargesCollection = (userId: string) => collection(db, `users/${userId}/cardCharges`);

export const createAccount = async (userId: string, payload: any) => {
  return await addDoc(accountsCollection(userId), payload);
};

export const getAccountsOnce = async (userId: string) => {
  const snap = await getDocs(accountsCollection(userId));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Exemplo de listener em tempo real:
export const listenTransactions = (userId: string, callback: (data: any[]) => void) => {
  const q = query(transactionsCollection(userId));
  return onSnapshot(q, snapshot => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
};
