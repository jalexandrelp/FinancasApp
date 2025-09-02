// app/(tabs)/dashboard.tsx
import React, { useState, useRef, useContext } from 'react';
import {
  SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Platform, StatusBar, Animated
} from 'react-native';
import { TransactionsContext, Transaction } from '../transactionsContext';
import { ThemeContext } from '../themeContext';

export default function Dashboard() {
  const { transactions, addTransaction } = useContext(TransactionsContext);
  const { darkMode } = useContext(ThemeContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'Entrada' | 'Saída'>('Entrada');
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const highlightAnim = useRef(new Animated.Value(0)).current;

  const greenTone = '#2a9d8f';
  const redTone   = '#e76f51';
  const orange    = '#f4a261';
  const grayBg    = darkMode ? '#2a2a2a' : '#e0e0e0';
  const itemBg    = darkMode ? '#333' : '#fff';

  const handleAdd = () => {
    if (!desc || !value) return;

    const newTx: Transaction = {
      id: String(Date.now()),
      desc,
      type,
      value: `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`,
      category,
      date: new Date().toISOString().slice(0,10),
    };

    addTransaction(newTx);
    setLastAddedId(newTx.id);

    setDesc(''); setValue(''); setCategory(''); setType('Entrada');
    setModalVisible(false);

    highlightAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(highlightAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.timing(highlightAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
      ]),
      { iterations: 3 }
    ).start();
  };

  const toNumber = (str: string) => parseFloat(str.replace('R$ ','').replace('.','').replace(',','.')) || 0;
  const totalEntradas = transactions.filter(t=>t.type==='Entrada').reduce((s,t)=>s+toNumber(t.value),0);
  const totalSaidas   = transactions.filter(t=>t.type==='Saída').reduce((s,t)=>s+toNumber(t.value),0);
  const saldoAtual    = totalEntradas - totalSaidas;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#264653' : '#f0f4f8' }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <Text style={[styles.title, { color: darkMode ? '#f0f4f8' : '#264653' }]}>💰 Minhas Finanças</Text>

      <View style={styles.summary}>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Saldo</Text>
          <Text style={[styles.summaryValue, { color: saldoAtual >= 0 ? greenTone : redTone }]}>
            R$ {saldoAtual.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Entradas</Text>
          <Text style={[styles.summaryValue, { color: greenTone }]}>
            R$ {totalEntradas.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryLabel, { color: darkMode ? '#ccc' : '#666' }]}>Saídas</Text>
          <Text style={[styles.summaryValue, { color: redTone }]}>
            R$ {totalSaidas.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      <FlatList
        data={transactions.slice(0,5)}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:16, color: darkMode ? '#f0f4f8' : '#666' }}>Nenhum lançamento ainda.</Text>}
        renderItem={({ item }) => {
          const isLast = item.id === lastAddedId;

          const highlightBg = darkMode
            ? (item.type === 'Entrada' ? '#3a5a52' : '#5a3a38')
            : (item.type === 'Entrada' ? '#dff0d8' : '#f8d8d3');

          const highlightBorder = darkMode
            ? (item.type === 'Entrada' ? greenTone : redTone)
            : (item.type === 'Entrada' ? greenTone : redTone);

          return (
            <Animated.View
              style={[
                styles.item,
                { backgroundColor: itemBg },
                isLast && {
                  backgroundColor: highlightAnim.interpolate({
                    inputRange: [0,1],
                    outputRange: [itemBg, highlightBg]
                  }),
                  borderColor: highlightAnim.interpolate({
                    inputRange: [0,1],
                    outputRange: [itemBg, highlightBorder]
                  }),
                  borderWidth: 1
                }
              ]}
            >
              <View>
                <Text style={[styles.desc, { color: darkMode ? '#f0f4f8' : '#000' }]}>{item.desc}</Text>
                <Text style={[styles.sub, { color: darkMode ? '#ccc' : '#666' }]}>
                  {item.type}{item.category ? ` · ${item.category}` : ''}{item.date ? ` · ${item.date}` : ''}
                </Text>
              </View>
              <Text style={[styles.value, { color: item.type==='Entrada' ? greenTone : redTone }]}>{item.value}</Text>
            </Animated.View>
          );
        }}
      />

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: greenTone }]} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Adicionar lançamento</Text>
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={()=>setModalVisible(false)}>
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)' }}>
          <View style={[styles.modalContent, { backgroundColor: grayBg }]}>
            <Text style={[styles.modalTitle, { color: darkMode ? '#f0f4f8' : '#264653' }]}>Adicionar Lançamento</Text>

            <TextInput placeholder="Descrição" value={desc} onChangeText={setDesc} style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />
            <TextInput placeholder="Valor" value={value} onChangeText={setValue} keyboardType="numeric" style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />
            <TextInput placeholder="Categoria" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor={darkMode ? '#ccc' : '#999'} />

            <View style={styles.typeContainer}>
              <TouchableOpacity style={[styles.typeBtn, type==='Entrada' && { backgroundColor: greenTone }]} onPress={()=>setType('Entrada')}>
                <Text style={{ color: type==='Entrada' ? '#fff' : '#000' }}>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, type==='Saída' && { backgroundColor: redTone }]} onPress={()=>setType('Saída')}>
                <Text style={{ color: type==='Saída' ? '#fff' : '#000' }}>Saída</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.addBtn, { backgroundColor: orange, marginTop: 8 }]} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 8, alignItems:'center' }} onPress={()=>setModalVisible(false)}>
              <Text style={{ color: darkMode ? '#f0f4f8' : '#264653', fontWeight:'700' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop: Platform.OS==='android' ? (StatusBar.currentHeight||0)+16 : 16 },
  title:{ fontSize:22, fontWeight:'700', marginBottom:12, textAlign:'center' },
  summary:{ flexDirection:'row', justifyContent:'space-between', marginBottom:16 },
  summaryBox:{ alignItems:'center', flex:1 },
  summaryLabel:{ fontSize:14 },
  summaryValue:{ fontSize:16, fontWeight:'700' },
  item:{ flexDirection:'row', justifyContent:'space-between', padding:12, borderRadius:6, marginBottom:8 },
  desc:{ fontWeight:'600', fontSize:16 },
  sub:{ fontSize:12 },
  value:{ fontWeight:'700', fontSize:16 },
  addBtn:{ padding:12, borderRadius:8, marginTop:16, textAlign:'center' },
  addBtnText:{ textAlign:'center', fontWeight:'700', color:'#fff', fontSize:16 },
  modalContent:{ width:'90%', padding:16, borderRadius:12 },
  modalTitle:{ fontSize:18, fontWeight:'700', marginBottom:12, textAlign:'center' },
  input:{ backgroundColor:'#fff', borderRadius:6, padding:8, marginBottom:8 },
  typeContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  typeBtn:{ flex:1, padding:10, borderRadius:6, marginHorizontal:4, alignItems:'center', backgroundColor:'#ccc' },
});
