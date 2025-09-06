import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import TransactionModal from '../../components/TransactionModal';
import { AccountsContext } from '../../src/contexts/accountsContext';
import { FinanceContext } from '../../src/contexts/financeContext';
import { ThemeContext, type ThemeContextType } from '../../src/contexts/themeContext';
import { TransactionsContext, type Transaction as TxType } from '../../src/contexts/transactionsContext';

export const options = {
  title: 'Transações',
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons name="list-outline" size={size} color={color} />
  ),
};

// ===== Tipagem dos contextos =====
type AccountsContextType = { accounts: { id: string; name: string }[] };
type FinanceContextType = { categories: { id: string; name: string }[]; cards: { id: string; name: string }[] };
type TransactionsContextType = {
  transactions: TxType[];
  addTransaction: (t: TxType) => void;
  updateTransaction: (t: TxType) => void;
  removeTransaction: (id: string) => void;
};

// ===== Filtros =====
function FiltersPanel({
  typeFilter, setTypeFilter,
  accountFilter, setAccountFilter,
  categoryFilter, setCategoryFilter,
  periodFilter, setPeriodFilter,
  accounts, categories
}: {
  typeFilter: 'all' | 'income' | 'expense';
  setTypeFilter: (v: 'all' | 'income' | 'expense') => void;
  accountFilter: string;
  setAccountFilter: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  periodFilter: '7' | '30' | 'all';
  setPeriodFilter: (v: '7' | '30' | 'all') => void;
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  const filterData = [
    { label: 'Tipo', selected: typeFilter, onSelect: setTypeFilter, options: [
      { key: 'all', label: 'Tudo' }, { key: 'income', label: 'Entradas' }, { key: 'expense', label: 'Saídas' }
    ]},
    { label: 'Conta', selected: accountFilter, onSelect: setAccountFilter, options: [
      { key: '', label: 'Todas' }, ...accounts.map(a => ({ key: a.name, label: a.name }))
    ]},
    { label: 'Categoria', selected: categoryFilter, onSelect: setCategoryFilter, options: [
      { key: '', label: 'Todas' }, ...categories.map(c => ({ key: c.name, label: c.name }))
    ]},
    { label: 'Período', selected: periodFilter, onSelect: setPeriodFilter, options: [
      { key: '7', label: '7d' }, { key: '30', label: '30d' }, { key: 'all', label: 'Todos' }
    ]}
  ];

  const getFilterStyle = (selected: boolean) => ({
    borderColor: selected ? theme.primary : 'transparent',
    backgroundColor: selected ? theme.primary + '22' : 'transparent'
  });

  return (
    <View style={[styles.filtersRow, { backgroundColor: theme.card }]}>
      {filterData.map(f => (
        <View key={f.label} style={styles.filterItem}>
          <Text style={[styles.filterLabel, { color: theme.text }]}>{f.label}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.compactScroll}>
            {f.options.map(opt => (
              <Pressable
                key={opt.key}
                onPress={() => f.onSelect(opt.key as any)}
                style={[styles.compactFilterBtn, getFilterStyle(f.selected === opt.key)]}
              >
                <Text style={{ color: theme.text, fontWeight: f.selected === opt.key ? '700' : '400' }}>{opt.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

// ===== Linha de transação =====
function TransactionRow({
  item, index, pressedTxId, setPressedTxId, openEdit, handleDelete
}: {
  item: TxType;
  index: number;
  pressedTxId: string | null;
  setPressedTxId: (id: string | null) => void;
  openEdit: (t: TxType) => void;
  handleDelete: (t: TxType) => void;
}) {
  const { theme } = useContext(ThemeContext) as ThemeContextType;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const swipeMsgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(animatedValue, { toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true }).start(); }, []);
  useEffect(() => { Animated.timing(swipeMsgAnim, { toValue: pressedTxId === item.id ? 1 : 0, duration: 250, useNativeDriver: true }).start(); }, [pressedTxId, item.id]);

  const handlePressIn = () => { Animated.spring(scaleValue, { toValue: 0.96, useNativeDriver: true }).start(); setPressedTxId(item.id); };
  const handlePressOut = () => { Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start(); setPressedTxId(null); };

  const renderRightActions = () => (
    <View style={{ flexDirection: 'row', height: '100%' }}>
      <Pressable onPress={() => openEdit(item)} style={{ backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', width: 64, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
        <Ionicons name="create-outline" size={24} color="#fff" />
      </Pressable>
      <Pressable onPress={() => handleDelete(item)} style={{ backgroundColor: theme.expense || '#e53935', justifyContent: 'center', alignItems: 'center', width: 64, borderTopRightRadius: 8, borderBottomRightRadius: 8, marginLeft: 2 }}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </Pressable>
    </View>
  );

  const animatedStyle = { opacity: animatedValue, transform: [{ translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }, { scale: scaleValue }] };
  const amountColor = item.type === 'income' ? theme.income || 'green' : theme.expense || 'red';

  return (
    <View style={{ position: 'relative' }}>
      {pressedTxId === item.id && (
        <Animated.View style={{ position: 'absolute', top: -48, left: 24, right: 24, zIndex: 10, flexDirection: 'row', alignItems: 'center', opacity: swipeMsgAnim, transform: [{ translateX: swipeMsgAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <Ionicons name="arrow-back-outline" size={18} color={theme.primary} style={{ marginRight: 4 }} />
          <Ionicons name="arrow-back-outline" size={18} color={theme.primary} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>Arraste para editar ou excluir</Text>
        </Animated.View>
      )}
      <Swipeable renderRightActions={renderRightActions}>
        <Animated.View style={[styles.txRow, { backgroundColor: theme.card }, animatedStyle]}>
          <Pressable style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Ionicons name="options-outline" size={22} color={theme.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.txTitle, { color: theme.text }]}>{item.desc}</Text>
              <Text style={[styles.txMeta, { color: theme.text }]} numberOfLines={1}>{item.account} • {item.category} • {new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: amountColor, fontWeight: '700' }}>{item.type === 'income' ? '+' : '-'} R$ {Number(item.amount).toFixed(2)}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </Swipeable>
    </View>
  );
}

// ===== Página principal =====
export default function TransactionsPage() {
  const themeCtx = useContext(ThemeContext) as ThemeContextType;
  const accountsCtx = useContext(AccountsContext) as AccountsContextType;
  const financeCtx = useContext(FinanceContext) as FinanceContextType;
  const txCtx = useContext(TransactionsContext) as TransactionsContextType;

  const { theme } = themeCtx;
  const accounts = accountsCtx.accounts;
  const categories = financeCtx.categories;
  const transactions: TxType[] = txCtx.transactions;

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | 'all'>('30');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState<TxType | null>(null);
  const [pressedTxId, setPressedTxId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff = periodFilter === '7' ? now - 7 * 24 * 3600 * 1000 : periodFilter === '30' ? now - 30 * 24 * 3600 * 1000 : 0;
    return transactions
      .filter(t => (typeFilter !== 'all' && t.type !== typeFilter ? false : accountFilter && t.account !== accountFilter ? false : categoryFilter && t.category !== categoryFilter ? false : cutoff && new Date(t.date).getTime() < cutoff ? false : true))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, accountFilter, categoryFilter, periodFilter]);

  const openNew = () => { setEditingTx(null); setModalVisible(true); };
  const openEdit = (t: TxType) => { setEditingTx(t); setModalVisible(true); };
  const handleDelete = (t: TxType) => Alert.alert('Excluir lançamento', `Deseja realmente excluir "${t.desc}"?`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: () => txCtx.removeTransaction(t.id) }]);
  const handleSave = useCallback((t: TxType) => { editingTx ? txCtx.updateTransaction(t) : txCtx.addTransaction(t); }, [txCtx, editingTx]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Minhas Transações</Text>
        <Pressable onPress={openNew}><Text style={{ color: theme.primary, fontWeight: '700' }}>+ Nova</Text></Pressable>
      </View>

      <FiltersPanel
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        accountFilter={accountFilter} setAccountFilter={setAccountFilter}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        periodFilter={periodFilter} setPeriodFilter={setPeriodFilter}
        accounts={accounts} categories={categories}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <TransactionRow item={item} index={index} pressedTxId={pressedTxId} setPressedTxId={setPressedTxId} openEdit={openEdit} handleDelete={handleDelete} />}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>Nenhuma transação encontrada.</Text>}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
      />

      <TransactionModal
        visible={modalVisible}
        transaction={editingTx ?? undefined}
        onClose={() => { setModalVisible(false); setEditingTx(null); }}
        onSave={(t) => { handleSave(t); setModalVisible(false); setEditingTx(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 12 : 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700' },
  filtersRow: { padding: 12, borderRadius: 10, marginHorizontal: 12, marginBottom: 10 },
  filterItem: { marginBottom: 8 },
  filterLabel: { fontSize: 12, marginBottom: 6 },
  compactScroll: { flexDirection: 'row', marginTop: 4 },
  compactFilterBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: 'transparent', marginRight: 8, backgroundColor: 'transparent' },
  txRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginVertical: 6 },
  txTitle: { fontWeight: '700' },
  txMeta: { fontSize: 12, marginTop: 4 },
  emptyText: { textAlign: 'center', padding: 24 },
});
