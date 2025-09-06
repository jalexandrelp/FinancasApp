// app/components/TransactionModal.tsx
import { Picker } from '@react-native-picker/picker';
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
import { AccountsContext, type Account } from '../src/contexts/accountsContext';
import { FinanceContext, type Card, type Category } from '../src/contexts/financeContext';
import { ThemeContext } from '../src/contexts/themeContext';
import { TransactionsContext, type Transaction as TxType } from '../src/contexts/transactionsContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave?: (t: TxType) => void; // opcional: se passado, será chamado; senão usa TransactionsContext
  transaction?: TxType | null;
  // opcional: se o caller quiser fornecer listas próprias (útil em testes); caso contrário usamos context
  accounts?: Account[];
  categories?: Category[];
  cards?: Card[];
};

export default function TransactionModal({
  visible,
  onClose,
  onSave,
  transaction,
  accounts: accountsProp,
  categories: categoriesProp,
  cards: cardsProp,
}: Props) {
  const themeCtx = useContext(ThemeContext) as any;
  const accountsCtx = useContext(AccountsContext);
  const financeCtx = useContext(FinanceContext);
  const txCtx = useContext(TransactionsContext);

  // segurança mínima: se não tiver ThemeContext, cancelamos render
  if (!themeCtx) return null;

  // escolhas de fonte de dados: props > context
  const accounts = accountsProp ?? (accountsCtx?.accounts ?? []);
  const categories = categoriesProp ?? (financeCtx?.categories ?? []);
  const cards = cardsProp ?? (financeCtx?.cards ?? []);

  // derive darkMode a partir do theme (compatível com seu ThemeContext)
  const theme = themeCtx.theme ?? {};
  const darkMode =
    typeof themeCtx.mode === 'string'
      ? themeCtx.mode === 'dark'
      : ((theme.background || '').toString().toLowerCase().includes('121212') ||
         (theme.background || '').toString().toLowerCase().includes('dark') ||
         (theme.background || '').toString().toLowerCase() === '#000');

  const [desc, setDesc] = useState(transaction?.desc ?? '');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [type, setType] = useState<TxType['type']>(transaction?.type ?? 'income');
  // store values as names to keep compatibility com o restante do app
  const [account, setAccount] = useState<string>(transaction?.account ?? (accounts[0]?.name ?? ''));
  const [category, setCategory] = useState<string>(transaction?.category ?? (categories[0]?.name ?? ''));
  const [card, setCard] = useState<string>(transaction?.card ?? (cards[0]?.name ?? ''));

  useEffect(() => {
    if (transaction) {
      setDesc(transaction.desc);
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setAccount(transaction.account);
      setCategory(transaction.category ?? (categories[0]?.name ?? ''));
      setCard(transaction.card ?? (cards[0]?.name ?? ''));
    }
  }, [transaction, categories, cards]);

  // Reset quando modal fecha
  useEffect(() => {
    if (!visible) {
      setDesc('');
      setAmount('');
      setType('income');
      setAccount(accounts[0]?.name ?? '');
      setCategory(categories[0]?.name ?? '');
      setCard(cards[0]?.name ?? '');
    }
  }, [visible, accounts, categories, cards]);

  const handleSave = () => {
    // validações básicas
    const parsed = Number(amount);
    if (!desc.trim() || !amount.trim() || Number.isNaN(parsed) || parsed <= 0) return;
    if (!account || !category) return;

    const newTx: TxType = {
      id: transaction?.id ?? Date.now().toString(),
      desc: desc.trim(),
      amount: parsed,
      type,
      account,
      category,
      card,
      date: transaction?.date ?? new Date().toISOString(),
      // manter compatibilidade: isCreditCard se card preenchido
      isCreditCard: !!card,
    };

    if (typeof onSave === 'function') {
      onSave(newTx);
    } else if (txCtx?.addTransaction) {
      // se caller não passou onSave, usamos TransactionsContext
      txCtx.addTransaction(newTx);
    } else {
      // sem onSave e sem contexto -> nada a fazer
      console.warn('TransactionModal: nenhuma função onSave disponível (props ou TransactionsContext).');
    }

    // fechar e resetar (onClose pode fechar o modal)
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: darkMode ? (theme.card ?? '#333') : (theme.card ?? '#fff') }]}>
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

          {/* Conta */}
          <Picker
            selectedValue={account}
            onValueChange={(v) => setAccount(String(v))}
            style={[
              styles.picker,
              {
                color: darkMode ? '#f0f4f8' : '#000',
                backgroundColor: theme.card ?? (darkMode ? '#333' : '#fff'),
                borderColor: darkMode ? '#555' : '#ccc',
              },
            ]}
          >
            {accounts.length === 0 ? (
              <Picker.Item label="Nenhuma conta" value="" key="no-account" />
            ) : (
              accounts.map((acc) => <Picker.Item key={acc.id} label={acc.name} value={acc.name} />)
            )}
          </Picker>

          {/* Categoria */}
          <Picker
            selectedValue={category}
            onValueChange={(v) => setCategory(String(v))}
            style={[
              styles.picker,
              {
                color: darkMode ? '#f0f4f8' : '#000',
                backgroundColor: theme.card ?? (darkMode ? '#333' : '#fff'),
                borderColor: darkMode ? '#555' : '#ccc',
              },
            ]}
          >
            {categories.length === 0 ? (
              <Picker.Item label="Nenhuma categoria" value="" key="no-cat" />
            ) : (
              categories.map((cat) => <Picker.Item key={cat.id} label={cat.name} value={cat.name} />)
            )}
          </Picker>

          {/* Cartão */}
          <Picker
            selectedValue={card}
            onValueChange={(v) => setCard(String(v))}
            style={[
              styles.picker,
              {
                color: darkMode ? '#f0f4f8' : '#000',
                backgroundColor: theme.card ?? (darkMode ? '#333' : '#fff'),
                borderColor: darkMode ? '#555' : '#ccc',
              },
            ]}
          >
            <Picker.Item label="Nenhum" value="" key="none-card" />
            {cards.length > 0 && cards.map((c) => <Picker.Item key={c.id} label={c.name} value={c.name} />)}
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

          <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
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
  saveButton: { padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  closeButton: { padding: 12, borderRadius: 6, alignItems: 'center' },
});
