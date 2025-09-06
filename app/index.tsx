import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/authContext';
import { View, ActivityIndicator, StyleSheet, Platform, StatusBar } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/tabs/dashboard');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Exibe um loading simples enquanto checa o usuário
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Platform.OS === 'android' ? '#000' : '#0a7ea4'} />
      {Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
