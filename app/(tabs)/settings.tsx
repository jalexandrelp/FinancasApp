import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '../themeContext';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#264653' : '#f0f4f8' }]}>
      <Text style={[styles.title, { color: darkMode ? '#f0f4f8' : '#264653' }]}>⚙️ Configurações</Text>

      <View style={styles.option}>
        <Text style={[styles.label, { color: darkMode ? '#f0f4f8' : '#264653' }]}>Modo Escuro</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.label, { color: darkMode ? '#f0f4f8' : '#264653' }]}>Sobre o App</Text>
        <Text style={[styles.info, { color: darkMode ? '#e0e0e0' : '#666' }]}>FinançasApp v1.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: { fontSize: 16 },
  info: { fontSize: 14 },
});
