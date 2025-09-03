// app/(tabs)/dashboard.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemeContext } from '../themeContext';
import { Transaction, TransactionsContext } from '../transactionsContext';

const screenWidth = Dimensions.get('window').width;

// ===================== COMPONENTES =====================

// Item da transação com destaque animado
const TransactionItem = ({ item, highlight }: { item: Transaction; highlight: boolean }) => {
  const { darkMode } = useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(highlight ? 0 : 1)).current;

  useEffect(() => {
    if (highlight) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [fadeAnim, highlight]);

  return (
    <Animated.View
      style={[
        styles.transactionItem,
        {
          backgroundColor: darkMode ? '#333' : '#fff',
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={{ color: darkMode ? '#f0f4f8' : '#000' }}>{item.desc}</Text>
      <Text style={{ color: item.type === 'Entrada' ? 'green' : 'red' }}>
        {item.type === 'Entrada' ? '+' : '-'} R$ {item.value}
      </Text>
    </Animated.View>
  );
};

// Scroll horizontal das contas
const AccountsScroll = ({
  accounts,
  selectedAccount,
  setSelectedAccount,
}: {
  accounts: string[];
  selectedAccount: string | null;
  setSelectedAccount: (account: string | null) => void;
}) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
      <TouchableOpacity
        onPress={() => setSelectedAccount(null)}
        style={[
          styles.accountCard,
          { backgroundColor: selectedAccount === null ? '#007AFF' : darkMode ? '#444' : '#eee' },
        ]}
      >
        <Text style={{ color: selectedAccount === null ? '#fff' : darkMode ? '#f0f4f8' : '#000' }}>
          Todas
        </Text>
      </TouchableOpacity>
      {accounts.map(account => (
        <TouchableOpacity
          key={account}
          onPress={() => setSelectedAccount(account)}
          style={[
            styles.accountCard,
            { backgroundColor: selectedAccount === account ? '#007AFF' : darkMode ? '#444' : '#eee' },
          ]}
        >
          <Text style={{ color: selectedAccount === account ? '#fff' : darkMode ? '#f0f4f8' : '#000' }}>
            {account}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Modal para adicionar/editar transação
const AddEditTransactionModal = ({
  visible,
  onClose,
  onSave,
  transaction,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  transaction?: Transaction | null;
}) => {
  const [desc, setDesc] = useState(transaction?.desc || '');
  const [value, setValue] = useState(transaction?.value || '');
  const [type, setType] = useState<Transaction['type']>(transaction?.type || 'Entrada');
  const [account, setAccount] = useState(transaction?.account || '');

  const { darkMode } = useContext(ThemeContext);

  const handleSave = () => {
    if (!desc || !value || !account) return;
    onSave({
      id: transaction?.id || Math.random().toString(),
      desc,
      value,
      type,
      category: transaction?.category || '',
      account,
      date: transaction?.date || new Date().toISOString(),
      isCreditCard: transaction?.isCreditCard || false,
    });
    setDesc('');
    setValue('');
    setAccount('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={[styles.modalContent, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
          <Text style={[styles.modalTitle, { color: darkMode ? '#f0f4f8' : '#000' }]}>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </Text>
          <TextInput
            placeholder="Descrição"
            placeholderTextColor={darkMode ? '#ccc' : '#999'}
            style={[styles.input, { color: darkMode ? '#f0f4f8' : '#000', borderColor: darkMode ? '#555' : '#ccc' }]}
            value={desc}
            onChangeText={setDesc}
          />
          <TextInput
            placeholder="Valor"
            placeholderTextColor={darkMode ? '#ccc' : '#999'}
            style={[styles.input, { color: darkMode ? '#f0f4f8' : '#000', borderColor: darkMode ? '#555' : '#ccc' }]}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Conta"
            placeholderTextColor={darkMode ? '#ccc' : '#999'}
            style={[styles.input, { color: darkMode ? '#f0f4f8' : '#000', borderColor: darkMode ? '#555' : '#ccc' }]}
            value={account}
            onChangeText={setAccount}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setType('Entrada')} style={styles.typeButton}>
              <Text style={{ color: type === 'Entrada' ? 'green' : darkMode ? '#f0f4f8' : '#000' }}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType('Saída')} style={styles.typeButton}>
              <Text style={{ color: type === 'Saída' ? 'red' : darkMode ? '#f0f4f8' : '#000' }}>Saída</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={{ color: '#fff' }}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: darkMode ? '#f0f4f8' : '#000' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ===================== DASHBOARD =====================
export default function Dashboard() {
  const { darkMode } = useContext(ThemeContext);
  const { transactions, addTransaction, editTransaction } = useContext(TransactionsContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const accounts = Array.from(new Set(transactions.map(t => t.account)));

  const filteredTransactions = selectedAccount
    ? transactions.filter(t => t.account === selectedAccount)
    : transactions;

  const handleSaveTransaction = (transaction: Transaction) => {
    const exists = transactions.find(t => t.id === transaction.id);
    if (exists) editTransaction(transaction.id, transaction);
    else {
      addTransaction(transaction);
      setLastAddedId(transaction.id);
    }
  };

  // RESUMO FINANCEIRO
  const totalEntrada = filteredTransactions
    .filter(t => t.type === 'Entrada')
    .reduce((sum, t) => sum + Number(t.value), 0);
  const totalSaida = filteredTransactions
    .filter(t => t.type === 'Saída')
    .reduce((sum, t) => sum + Number(t.value), 0);
  const saldo = totalEntrada - totalSaida;

  // GRÁFICO
  const chartData = [
    { name: 'Entradas', amount: totalEntrada, color: 'green', legendFontColor: darkMode ? '#f0f4f8' : '#000', legendFontSize: 14 },
    { name: 'Saídas', amount: totalSaida, color: 'red', legendFontColor: darkMode ? '#f0f4f8' : '#000', legendFontSize: 14 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#264653' : '#f0f4f8' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* RESUMO FINANCEIRO */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryBox, { backgroundColor: '#2a9d8f' }]}>
          <Text style={styles.summaryText}>Saldo</Text>
          <Text style={styles.summaryValue}>R$ {saldo.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: '#2a9d8f' }]}>
          <Text style={styles.summaryText}>Entradas</Text>
          <Text style={styles.summaryValue}>R$ {totalEntrada.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: '#e76f51' }]}>
          <Text style={styles.summaryText}>Saídas</Text>
          <Text style={styles.summaryValue}>R$ {totalSaida.toFixed(2)}</Text>
        </View>
      </View>

      {/* CONTAS */}
      <AccountsScroll
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />

      {/* LISTA DE TRANSAÇÕES */}
      <FlatList
        ref={flatListRef}
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} highlight={item.id === lastAddedId} />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* GRÁFICO */}
      <View style={{ marginVertical: 16 }}>
        <Text style={{ color: darkMode ? '#f0f4f8' : '#000', fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
          Gráfico Resumo
        </Text>
        <PieChart
          data={chartData.map(d => ({ name: d.name, population: d.amount, color: d.color, legendFontColor: d.legendFontColor, legendFontSize: d.legendFontSize }))}
          width={screenWidth - 32}
          height={180}
          chartConfig={{
            backgroundColor: darkMode ? '#264653' : '#f0f4f8',
            backgroundGradientFrom: darkMode ? '#264653' : '#f0f4f8',
            backgroundGradientTo: darkMode ? '#264653' : '#f0f4f8',
            color: (opacity = 1) => darkMode ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => darkMode ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* MODAL ADICIONAR / EDITAR */}
      <AddEditTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
      />

      {/* BOTÃO + */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedTransaction(null);
          setModalVisible(true);
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===================== ESTILOS =====================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryBox: { flex: 1, marginHorizontal: 4, padding: 12, borderRadius: 8, alignItems: 'center' },
  summaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  summaryValue: { color: '#fff', fontWeight: '700', fontSize: 16 },
  accountCard: { padding: 12, borderRadius: 6, marginHorizontal: 4 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 6, marginBottom: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  typeButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  saveButton: { backgroundColor: '#2a9d8f', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  closeButton: { alignItems: 'center', padding: 8 },
  addButton: { position: 'absolute', bottom: 32, right: 32, backgroundColor: '#2a9d8f', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
});
