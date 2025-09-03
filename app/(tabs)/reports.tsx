// app/(tabs)/reports.tsx
import { PieChart } from 'reac../contexts/themeContextkit';
import React, { useContext, useMemo, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SettingsContext } from '../contexts/settingsContext';
import { TransactionsContext } from '../contexts/transactionsContext';
import { ThemeContext } from '../themeContext';

export default function Reports() {
  const { theme } = useContext(ThemeContext);
  const { transactions } = useContext(TransactionsContext);
  const { accounts, categories } = useContext(SettingsContext);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Mês');

  const periods = ['Dia', 'Semana', 'Mês', 'Ano'];

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const matchAccount = selectedAccount ? t.account === selectedAccount : true;
      const matchCategory = selectedCategory ? t.category === selectedCategory : true;

      let matchPeriod = true;
      switch (selectedPeriod) {
        case 'Dia':
          matchPeriod = tDate.getDate() === now.getDate() && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
          break;
        case 'Semana':
          const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);
          matchPeriod = tDate >= startOfWeek && tDate <= endOfWeek;
          break;
        case 'Mês':
          matchPeriod = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
          break;
        case 'Ano':
          matchPeriod = tDate.getFullYear() === now.getFullYear();
          break;
      }
      return matchAccount && matchCategory && matchPeriod;
    });
  }, [transactions, selectedAccount, selectedCategory, selectedPeriod]);

  // Dados do gráfico por categoria
  const categorySummary = useMemo(() => {
    const summary: { [key: string]: number } = {};
    filteredTransactions.forEach(t => {
      if (!summary[t.category]) summary[t.category] = 0;
      summary[t.category] += t.type === 'expense' ? t.amount : 0;
    });
    return Object.entries(summary).map(([name, amount]) => ({ name, amount, color: getRandomColor(), legendFontColor: theme.text, legendFontSize: 12 }));
  }, [filteredTransactions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Filtros */}
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        <TouchableOpacity onPress={() => setSelectedAccount(null)} style={[styles.filterButton, { backgroundColor: !selectedAccount ? theme.primary : theme.card }]}>
          <Text style={{ color: !selectedAccount ? '#fff' : theme.text }}>Todas Contas</Text>
        </TouchableOpacity>
        {accounts.map(acc => (
          <TouchableOpacity key={acc.id} onPress={() => setSelectedAccount(acc.name)} style={[styles.filterButton, { backgroundColor: selectedAccount === acc.name ? theme.primary : theme.card }]}>
            <Text style={{ color: selectedAccount === acc.name ? '#fff' : theme.text }}>{acc.name}</Text>
          </TouchableOpacity>
        ))}
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)} style={[styles.filterButton, { backgroundColor: selectedCategory === cat.name ? theme.primary : theme.card }]}>
            <Text style={{ color: selectedCategory === cat.name ? '#fff' : theme.text }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView>
        {/* Gráfico pizza */}
        <PieChart
          data={categorySummary}
          width={Dimensions.get('window').width - 32}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
        />

        {/* Lista de transações */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.transactionItem, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.text }}>{item.desc} ({item.category})</Text>
              <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
                {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  filterButton: { padding: 8, borderRadius: 6, marginRight: 8 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 6, marginBottom: 8 },
});
