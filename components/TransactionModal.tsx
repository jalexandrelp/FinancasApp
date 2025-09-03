// app/components/TransactionModal.tsx
import { Picker } from '@react-native-picker/picker'; // dropdown simples
import React, { useContext, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Account, Card, Category } from '../settingsContext';
import { ThemeContext } from '../themeContext';
import { Transaction } from '../transactionsContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
  transaction?: Transaction | null;
  accounts: Account[];
  categories: Category[];
  cards: Card[];
};

export default function TransactionModal({ visible, onClose, onSave, transaction, accounts, categories, cards }: Props) {
  const { darkMode } = useContext(ThemeContext);

  const [desc, setDesc] = useState(transaction?.desc || '');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [type, setType] = useState<Transaction['type']>(transaction?.type || 'income');
  const [account, setAccount] = useState(transaction?.account || (accounts[0]?.name || ''));
  const [category, setCategory] = useState(transaction?.category || (categories[0]?.name || ''));
  const [card, setCard] = useState(transaction?.card || (cards[0]?.name || ''));

  useEffect(() => {
    if (transaction) {
      setDesc(transaction.desc);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setAccount(transaction.account);
      setCategory(transaction.category || (categories[0]?.name || ''));
      setCard(transaction.card || (cards[0]?.name || ''));
    }
  }, [transaction]);

  const handleSave = () => {
    if (!desc || !amount || !account || !category) return;
    onSave({
      id: transaction?.id || Math.random().toString(),
      desc,
      amount: Number(amount),
      type,
      account,
      category,
      card,
      date: transaction?.date || new Date().toISOString(),
      isCreditCard: card ? true : false,
    });
    onClose();
    // reset
    setDesc('');
    setAmount('');
    setType('income');
    setAccount(accounts[0]?.name || '');
    setCategory(categories[0]?.name || '');
    setCard(cards[0]?.name || '');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
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

          {/* Dropdown Conta */}
          <Picker selectedValue={account} onValueChange={v => setAccount(v)} style={[styles.picker, { color: darkMode ? '#f0f4f8' : '#000' }]}>
            {accounts.map(acc => <Picker.Item key={acc.id} label={acc.name} value={acc.name} />)}
          </Picker>

          {/* Dropdown Categoria */}
          <Picker selectedValue={category} onValueChange={v => setCategory(v)} style={[styles.picker, { color: darkMode ? '#f0f4f8' : '#000' }]}>
            {categories.map(cat => <Picker.Item key={cat.id} label={cat.name} value={cat.name} />)}
          </Picker>

          {/* Dropdown Cartão */}
          <Picker selectedValue={card} onValueChange={v => setCard(v)} style={[styles.picker, { color: darkMode ? '#f0f4f8' : '#000' }]}>
            <Picker.Item label="Nenhum" value="" />
            {cards.map(c => <Picker.Item key={c.id} label={c.name} value={c.name} />)}
          </Picker>

          {/* Tipo */}
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
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 16, borderRadius: 8 },
  modalTitle: { fontWeight: '700', fontSize: 18, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 12 },
  picker: { borderWidth: 1, borderRadius: 6, marginBottom: 12, backgroundColor: '#f0f4f8' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  typeButton: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' },
  saveButton: { backgroundColor: '#2a9d8f', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  closeButton: { padding: 12, borderRadius: 6, alignItems: 'center' },
});
