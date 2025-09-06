// src/services/auth.ts
import { auth } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// Cria usuário com email e senha
export const signUpEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// Login com email e senha
export const signInEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const signOutUser = () => signOut(auth);
