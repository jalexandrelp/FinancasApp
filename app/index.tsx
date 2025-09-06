// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Sem AuthProvider por enquanto: manda direto para /auth/login
  return <Redirect href="/auth/login" />;
}
