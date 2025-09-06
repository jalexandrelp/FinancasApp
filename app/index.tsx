// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Evita "navigate before mounting": Redirect simples para login
  return <Redirect href="/auth/login" />;
}
