// app/(tabs)/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AccountsContext } from '../contexts/accountsContext';
import { FinanceContext } from '../contexts/financeContext';
import { ThemeContext } from '../contexts/themeContext';
import { TransactionsContext, type Transaction } from '../contexts/transactionsContext';

// Modais
import AccountsModal from '../../components/AccountsModal';
import CardsModal from '../../components/CardsModal';
import CategoriesModal from '../../components/CategoriesModal';
import ProfilesModal from '../../components/ProfilesModal';
import TransactionModal from '../../components/TransactionModal';

export const options = {
  title: 'Dashboard',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons name="home-outline" size={size} color={color} />
  ),
};

export default function Dashboard() {
  const themeCtx = useContext(ThemeContext) as any;
  const accountsCtx = useContext(AccountsContext) as any;
  const financeCtx = useContext(FinanceContext) as any;
  const txCtx = useContext(TransactionsContext) as any;

  if (!themeCtx || !accountsCtx || !financeCtx || !txCtx) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Inicializando...</Text>
      </SafeAreaView>
    );
  }

  const { theme } = themeCtx;
  const { accounts } = accountsCtx;
  const { cards, categories } = financeCtx;
  const { transactions, addTransaction } = txCtx as {
    transactions: Transaction[];
    addTransaction: (t: Transaction) => void;
  };

  // resumo financeiro
  const { incomeTotal, expenseTotal, balance } = useMemo(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    for (const t of transactions) {
      if (t.type === 'income') incomeTotal += Number(t.amount) || 0;
      else expenseTotal += Number(t.amount) || 0;
    }
    return { incomeTotal, expenseTotal, balance: incomeTotal - expenseTotal };
  }, [transactions]);

  // últimos lançamentos (max 5)
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

  // modais locais
  const [accountsModalVisible, setAccountsModalVisible] = useState(false);
  const [cardsModalVisible, setCardsModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);
  const [txModalVisible, setTxModalVisible] = useState(false);

  const handleSaveTransaction = (t: Transaction) => {
    addTransaction(t);
  };

  // **Cria um map de saldo atualizado por conta**
  const accountsWithUpdatedBalance = useMemo(() => {
    return accounts.map((acc: any) => {
      const delta = transactions
        .filter((tx) => tx.account.trim().toLowerCase() === acc.name.trim().toLowerCase())
        .reduce((sum, tx) => sum + (tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount)), 0);
      return { ...acc, balance: delta };
    });
  }, [accounts, transactions]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Resumo */}

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryLabel, { color: theme.text }]}>Entradas</Text>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>R$ {incomeTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryLabel, { color: theme.text }]}>Saídas</Text>
          <Text style={[styles.summaryValue, { color: '#e53935' }]}>R$ {expenseTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryLabel, { color: theme.text }]}>Saldo</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>R$ {balance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Saldo por conta */}
      <View style={styles.accountsRow}>
        <FlatList
          data={accountsWithUpdatedBalance}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={[styles.accountCard, { backgroundColor: theme.card }]}>
              {/* Ícone removido */}
              <Text style={[styles.accountName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.accountBalance, { color: theme.text }]}>
                R$ {Number(item.balance).toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Últimas transações */}
      <View style={styles.transactionsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Últimos lançamentos</Text>
        <Pressable onPress={() => setTxModalVisible(true)}>
          <Text style={{ color: theme.primary, fontWeight: '700' }}>+ Nova</Text>
        </Pressable>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>Nenhuma transação ainda.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.txRow, { backgroundColor: theme.card }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: '600' }}>{item.desc}</Text>
              <Text style={{ color: theme.text, fontSize: 12 }}>{item.account} • {item.category}</Text>
            </View>
            <Text style={{ color: item.type === 'income' ? 'green' : 'red', fontWeight: '700' }}>
              {item.type === 'income' ? '+' : '-'} R$ {Number(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
        style={{ width: '100%', paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      {/* Modais */}
      <AccountsModal visible={accountsModalVisible} onClose={() => setAccountsModalVisible(false)} />
      <CardsModal visible={cardsModalVisible} onClose={() => setCardsModalVisible(false)} />
      <CategoriesModal visible={categoriesModalVisible} onClose={() => setCategoriesModalVisible(false)} />
      <ProfilesModal visible={profilesModalVisible} onClose={() => setProfilesModalVisible(false)} />
      <TransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
        onSave={handleSaveTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight ?? 24
      : 24,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10, marginTop: 16 },
  summaryCard: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  summaryLabel: { fontSize: 11 },
  summaryValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  accountsRow: { paddingVertical: 12 },
  accountCard: {
    width: 110, // reduzido para ficar mais compacto
    padding: 8, // reduzido
    borderRadius: 10,
    marginRight: 8, // reduzido
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: { fontSize: 13, fontWeight: '600' }, // reduzido
  accountBalance: { fontSize: 14, fontWeight: '700', marginTop: 4 }, // reduzido
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginVertical: 6 },
  emptyText: { padding: 12, textAlign: 'center' },
});
