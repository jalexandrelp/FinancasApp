// path: app/(tabs)/dashboard.tsx (versão aprimorada)

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
      <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
        {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
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
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [type, setType] = useState<Transaction['type']>(transaction?.type || 'income');
  const [account, setAccount] = useState(transaction?.account || '');

  const { darkMode } = useContext(ThemeContext);

  const handleSave = () => {
    if (!desc || !amount || !account) return;
    onSave({
      id: transaction?.id || Math.random().toString(),
      desc,
      amount: Number(amount),
      type,
      category: transaction?.category || '',
      account,
      date: transaction?.date || new Date().toISOString(),
      isCreditCard: transaction?.isCreditCard || false,
    });
    setDesc('');
    setAmount('');
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
            value={amount}
            onChangeText={setAmount}
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
            <TouchableOpacity onPress={() => setType('income')} style={styles.typeButton}>
              <Text style={{ color: type === 'income' ? 'green' : darkMode ? '#f0f4f8' : '#000' }}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType('expense')} style={styles.typeButton}>
              <Text style={{ color: type === 'expense' ? 'red' : darkMode ? '#f0f4f8' : '#000' }}>Saída</Text>
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
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSaida = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalEntrada - totalSaida;

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
      <AccountsScroll accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />

      {/* LISTA DE TRANSAÇÕES */}
      <FlatList
        ref={flatListRef}
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} highlight={item.id === lastAddedId} />
        )}
      />

      {/* MODAL */}
      <AddEditTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
      />

      {/* BOTÃO NOVA TRANSAÇÃO */}
      <TouchableOpacity
        onPress={() => { setSelectedTransaction(null); setModalVisible(true); }}
        style={styles.floatingButton}
      >
        <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===================== ESTILOS =====================
const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop: Platform.OS==='android' ? (StatusBar.currentHeight||0)+16 : 16 },
  summaryContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:16 },
  summaryBox:{ flex:1, padding:12, borderRadius:6, marginHorizontal:4, alignItems:'center', justifyContent:'center' },
  summaryText:{ fontWeight:'700', fontSize:14, color:'#fff' },
  summaryValue:{ fontWeight:'700', fontSize:16, color:'#fff', marginTop:4 },
  transactionItem:{ flexDirection:'row', justifyContent:'space-between', padding:12, borderRadius:6, marginBottom:8 },
  accountCard:{ padding:10, borderRadius:6, marginRight:8 },
  modalContainer:{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modalContent:{ width:'90%', padding:16, borderRadius:8 },
  modalTitle:{ fontWeight:'700', fontSize:18, marginBottom:12, textAlign:'center' },
  input:{ borderWidth:1, borderRadius:6, padding:8, marginBottom:12 },
  modalButtons:{ flexDirection:'row', justifyContent:'space-around', marginBottom:12 },
  typeButton:{ padding:8, borderRadius:6, borderWidth:1, borderColor:'#ccc' },
  saveButton:{ backgroundColor:'#2a9d8f', padding:12, borderRadius:6, alignItems:'center', marginBottom:8 },
  closeButton:{ padding:12, borderRadius:6, alignItems:'center' },
  floatingButton:{ position:'absolute', right:16, bottom:16, width:56, height:56, borderRadius:28, backgroundColor:'#2a9d8f', justifyContent:'center', alignItems:'center' },
});
