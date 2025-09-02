// app/(tabs)/dashboard.tsx
import React, { useState, useRef, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
  StatusBar,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { TransactionsContext, Transaction } from '../transactionsContext';
import { ThemeContext } from '../themeContext';

export default function Dashboard() {
  const { transactions, addTransaction, editTransaction, removeTransaction } =
    useContext(TransactionsContext);
  const { darkMode } = useContext(ThemeContext);

  const { width: screenWidth } = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [type, setType] = useState<'Entrada' | 'Saída'>('Entrada');
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [isCreditCard, setIsCreditCard] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const highlightAnim = useRef(new Animated.Value(0)).current;

  const greenTone = '#2a9d8f';
  const redTone = '#e76f51';
  const orange = '#f4a261';
  const cardBg = darkMode ? '#333' : '#fff';
  const grayBg = darkMode ? '#2a2a2a' : '#e9f2fb';

  const toNumber = (str: string) =>
    parseFloat(str.replace('R$ ', '').replace('.', '').replace(',', '.')) || 0;

  // Totais
  const totalEntradas = transactions
    .filter((t) => t.type === 'Entrada')
    .reduce((s, t) => s + toNumber(t.value), 0);
  const totalSaidas = transactions
    .filter((t) => t.type === 'Saída')
    .reduce((s, t) => s + toNumber(t.value), 0);
  const saldoAtual = totalEntradas - totalSaidas;

  // Contas/Carteiras
  const accountsMap: Record<string, number> = {};
  transactions.forEach((t) => {
    if (!t.account) return;
    accountsMap[t.account] =
      (accountsMap[t.account] || 0) + (t.type === 'Entrada' ? toNumber(t.value) : -toNumber(t.value));
  });
  const accountsData = Object.keys(accountsMap).map((name) => ({
    name,
    balance: accountsMap[name],
  }));

  // === Responsividade: reserva dinâmica do lado direito
  // largura mínima reservada para valor + botões
  const MIN_RIGHT_SPACE = 110; // px mínimo em telas pequenas
  // calculamos 28% da largura da tela ou o mínimo
  const rightReserved = Math.max(MIN_RIGHT_SPACE, Math.floor(screenWidth * 0.28));

  // animação de destaque (suave)
  const playHighlight = (id: string) => {
    setLastAddedId(id);
    highlightAnim.setValue(0);
    Animated.sequence([
      Animated.timing(highlightAnim, { toValue: 1, duration: 420, useNativeDriver: false }),
      Animated.timing(highlightAnim, { toValue: 0, duration: 420, useNativeDriver: false }),
    ]).start();
  };

  const openAddModal = () => {
    setEditingId(null);
    setDesc('');
    setValue('');
    setCategory('');
    setAccount('');
    setIsCreditCard(false);
    setType('Entrada');
    setModalVisible(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingId(tx.id);
    setDesc(tx.desc);
    setValue(tx.value.replace('R$ ', '').replace(',', '.'));
    setCategory(tx.category || '');
    setAccount(tx.account || '');
    setIsCreditCard(!!tx.isCreditCard);
    setType(tx.type);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!desc || !value) return;

    if (editingId) {
      const updated: Transaction = {
        id: editingId,
        desc,
        type,
        value: `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`,
        category,
        account,
        date: new Date().toISOString().slice(0, 10),
        isCreditCard,
      };
      editTransaction(editingId, updated);
      playHighlight(editingId);
    } else {
      const newTx: Transaction = {
        id: String(Date.now()),
        desc,
        type,
        value: `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`,
        category,
        account,
        date: new Date().toISOString().slice(0, 10),
        isCreditCard,
      };
      addTransaction(newTx);
      playHighlight(newTx.id);
    }

    setEditingId(null);
    setDesc('');
    setValue('');
    setCategory('');
    setAccount('');
    setIsCreditCard(false);
    setType('Entrada');
    setModalVisible(false);
  };

  const handleRemove = (id: string) => {
    removeTransaction(id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#264653' : '#f0f4f8' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <Text style={[styles.title, { color: darkMode ? '#f0f4f8' : '#264653' }]}>💰 Minhas Finanças</Text>

      {/* Resumo */}
      <View style={[styles.summaryBlock, { backgroundColor: cardBg }]}>
        <View style={[styles.summaryItem, { backgroundColor: darkMode ? '#444' : '#f9f9f9' }]}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Saldo</Text>
          <Text style={[styles.summaryValue, { color: saldoAtual >= 0 ? greenTone : redTone }]}>
            R$ {saldoAtual.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: darkMode ? '#444' : '#f9f9f9' }]}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Entradas</Text>
          <Text style={[styles.summaryValue, { color: greenTone }]}>R$ {totalEntradas.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: darkMode ? '#444' : '#f9f9f9' }]}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Saídas</Text>
          <Text style={[styles.summaryValue, { color: redTone }]}>R$ {totalSaidas.toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>

      {/* Contas — outer + inner tone */}
      <View style={[styles.accountsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.accountsHeader}>
          <Text style={[styles.accountsTitle, { color: darkMode ? '#f0f4f8' : '#264653' }]}>Contas/Carteiras</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: orange, fontWeight: '700' }}>Editar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={accountsData}
          keyExtractor={(item) => item.name}
          horizontal
          contentContainerStyle={{ paddingVertical: 6 }}
          renderItem={({ item }) => (
            <View style={[styles.accountBlock, { backgroundColor: darkMode ? '#444' : '#eef6fb' }]}>
              <Text style={{ fontWeight: '700', color: darkMode ? '#f0f4f8' : '#264653' }}>{item.name}</Text>
              <Text style={{ fontWeight: '700', color: darkMode ? '#f0f4f8' : '#264653' }}>
                R$ {item.balance.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Lista de transações */}
      <FlatList
        data={transactions.slice(0, 50)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 16, color: darkMode ? '#f0f4f8' : '#666' }}>
            Nenhum lançamento ainda.
          </Text>
        }
        renderItem={({ item }) => {
          const isLast = item.id === lastAddedId;
          const highlightColor = item.type === 'Entrada' ? '#dff0d8' : '#f8d8d3';
          const borderColor = item.type === 'Entrada' ? greenTone : redTone;

          return (
            <Animated.View
              style={[
                styles.item,
                {
                  backgroundColor: cardBg,
                  // reserve espaço à direita de forma responsiva
                  paddingRight: rightReserved,
                  paddingBottom: 42,
                  minHeight: 78,
                },
                isLast && {
                  backgroundColor: highlightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [cardBg, highlightColor],
                  }),
                  borderColor: highlightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [cardBg, borderColor],
                  }),
                  borderWidth: 1,
                },
              ]}
            >
              {/* Conteúdo principal: descrição + detalhes — ocupam espaço restante */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.desc, { color: darkMode ? '#f0f4f8' : '#000' }]}>{item.desc}</Text>
                <Text style={[styles.sub, { color: darkMode ? '#ccc' : '#666', marginTop: 6 }]}>
                  {/* removi numberOfLines para permitir wrap; aqui o texto vai quebrar linhas se necessário */}
                  {item.type} {item.category ? `· ${item.category}` : ''} · {item.account} · {item.date}{' '}
                  {item.isCreditCard && <Text style={{ color: orange, fontWeight: '700' }}>Cartão</Text>}
                </Text>
              </View>

              {/* Valor — posicionado absoluto no topo-direito (usa rightReserved para garantir encaixe) */}
              <Text style={[styles.value, { color: item.type === 'Entrada' ? greenTone : redTone, right: 12 }]}>
                {item.value}
              </Text>

              {/* Botões — absolutos no canto inferior-direito, deslocados pelo rightReserved */}
              <View style={[styles.actionBtns, { right: 12 }]}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Text style={{ color: orange, marginRight: 8 }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemove(item.id)}>
                  <Text style={{ color: redTone }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        }}
      />

      {/* Botão adicionar */}
      <TouchableOpacity style={[styles.addBtn, { backgroundColor: greenTone }]} onPress={openAddModal}>
        <Text style={styles.addBtnText}>+ Adicionar lançamento</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: grayBg }]}>
            <Text style={[styles.modalTitle, { color: darkMode ? '#f0f4f8' : '#264653' }]}>
              {editingId ? 'Editar Lançamento' : 'Adicionar Lançamento'}
            </Text>

            <TextInput placeholder="Descrição" value={desc} onChangeText={setDesc} style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />
            <TextInput placeholder="Valor (ex: 12.50)" value={value} onChangeText={setValue} keyboardType="numeric" style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />
            <TextInput placeholder="Categoria" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />
            <TextInput placeholder="Conta/Carteira" value={account} onChangeText={setAccount} style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />

            <View style={styles.typeContainer}>
              <TouchableOpacity style={[styles.typeBtn, type === 'Entrada' && { backgroundColor: greenTone }]} onPress={() => setType('Entrada')}>
                <Text style={{ color: type === 'Entrada' ? '#fff' : '#000' }}>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, type === 'Saída' && { backgroundColor: redTone }]} onPress={() => setType('Saída')}>
                <Text style={{ color: type === 'Saída' ? '#fff' : '#000' }}>Saída</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => setIsCreditCard((s) => !s)}>
              <Text style={{ color: darkMode ? '#f0f4f8' : '#264653', fontWeight: '700' }}>Lançamento no Cartão?</Text>
              <Text style={{ marginLeft: 8, fontWeight: '700' }}>{isCreditCard ? '✅' : '❌'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.addBtn, { flex: 1, backgroundColor: orange }]} onPress={handleSave}>
                <Text style={styles.addBtnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addBtn, { flex: 1, backgroundColor: '#888' }]} onPress={() => { setModalVisible(false); setEditingId(null); }}>
                <Text style={styles.addBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ marginTop: 8, alignItems: 'center' }} onPress={() => { setModalVisible(false); setEditingId(null); }}>
              <Text style={{ color: darkMode ? '#f0f4f8' : '#264653', fontWeight: '700' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* styles (mantive a maioria, ajustei tamanhos) */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },

  // Resumo
  summaryBlock: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, padding: 12, borderRadius: 8 },
  summaryItem: { flex: 1, marginHorizontal: 4, padding: 8, borderRadius: 8, alignItems: 'center' },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 16, fontWeight: '700' },

  // Contas
  accountsContainer: { marginBottom: 16, padding: 12, borderRadius: 8 },
  accountsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  accountsTitle: { fontWeight: '700', fontSize: 16 },
  accountBlock: { padding: 10, borderRadius: 8, marginRight: 8, minWidth: 100, justifyContent: 'center', alignItems: 'center' },

  // Transações
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 6, marginBottom: 8, position: 'relative' },
  desc: { fontWeight: '600', fontSize: 16 },
  sub: { fontSize: 13 },
  value: { fontWeight: '700', fontSize: 16, position: 'absolute', top: 12 }, // right é setado inline
  actionBtns: { position: 'absolute', bottom: 8, flexDirection: 'row' }, // right é setado inline

  // Botões/Modal
  addBtn: { padding: 12, borderRadius: 8, marginTop: 16, textAlign: 'center' },
  addBtnText: { textAlign: 'center', fontWeight: '700', color: '#fff', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { width: '90%', padding: 16, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 6, padding: 8, marginBottom: 8 },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 6, marginHorizontal: 4, alignItems: 'center', backgroundColor: '#ccc' },
});
