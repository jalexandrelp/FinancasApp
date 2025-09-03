// app/(tabs)/dashboard.tsx
import React, { useContext, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TransactionModal from '../../components/TransactionModal';
import { SettingsContext } from '../contexts/settingsContext';
import { ThemeContext } from '../contexts/themeContext';
import { Transaction, TransactionsContext } from '../contexts/transactionsContext';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const { transactions, addTransaction, editTransaction } = useContext(TransactionsContext);
  const { accounts, categories, cards } = useContext(SettingsContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

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

  // Resumo financeiro
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

      {/* Resumo Financeiro */}
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

      {/* Contas (scroll horizontal) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        <TouchableOpacity
          onPress={() => setSelectedAccount(null)}
          style={[styles.accountCard, { backgroundColor: selectedAccount === null ? '#007AFF' : darkMode ? '#444' : '#eee' }]}
        >
          <Text style={{ color: selectedAccount === null ? '#fff' : darkMode ? '#f0f4f8' : '#000' }}>Todas</Text>
        </TouchableOpacity>
        {accounts.map(acc => (
          <TouchableOpacity
            key={acc.id}
            onPress={() => setSelectedAccount(acc.name)}
            style={[styles.accountCard, { backgroundColor: selectedAccount === acc.name ? '#007AFF' : darkMode ? '#444' : '#eee' }]}
          >
            <Text style={{ color: selectedAccount === acc.name ? '#fff' : darkMode ? '#f0f4f8' : '#000' }}>
              {acc.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Transações */}
      <FlatList
        ref={flatListRef}
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.transactionItem, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
            <Text style={{ color: darkMode ? '#f0f4f8' : '#000' }}>{item.desc}</Text>
            <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
              {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
            </Text>
          </View>
        )}
      />

      {/* Modal de Transação */}
      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
        accounts={accounts}
        categories={categories}
        cards={cards}
      />

      {/* Botão Nova Transação */}
      <TouchableOpacity
        onPress={() => { setSelectedTransaction(null); setModalVisible(true); }}
        style={styles.floatingButton}
      >
        <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop: Platform.OS==='android' ? (StatusBar.currentHeight||0)+16 : 16 },
  summaryContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:16 },
  summaryBox:{ flex:1, padding:12, borderRadius:6, marginHorizontal:4, alignItems:'center', justifyContent:'center' },
  summaryText:{ fontWeight:'700', fontSize:14, color:'#fff' },
  summaryValue:{ fontWeight:'700', fontSize:16, color:'#fff', marginTop:4 },
  transactionItem:{ flexDirection:'row', justifyContent:'space-between', padding:12, borderRadius:6, marginBottom:8 },
  accountCard:{ padding:10, borderRadius:6, marginRight:8 },
  floatingButton:{ position:'absolute', right:16, bottom:16, width:56, height:56, borderRadius:28, backgroundColor:'#2a9d8f', justifyContent:'center', alignItems:'center' },
});
