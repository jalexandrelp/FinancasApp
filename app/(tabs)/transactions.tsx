// app/(tabs)/transactions.tsx
import React, { useContext } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Platform, StatusBar } from 'react-native';
import { TransactionsContext } from '../transactionsContext';
import { ThemeContext } from '../themeContext';

export default function Transactions() {
  const { transactions } = useContext(TransactionsContext);
  const { darkMode } = useContext(ThemeContext);

  const containerStyle = {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
    backgroundColor: darkMode ? '#264653' : '#f0f4f8',
  };

  return (
    <SafeAreaView style={containerStyle}>
      <Text style={{ fontSize: 22, fontWeight: '700', textAlign:'center', marginBottom: 12, color: darkMode ? '#f0f4f8' : '#264653' }}>
        📋 Todas as Transações
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:16, color: darkMode ? '#f0f4f8' : '#666' }}>Nenhum lançamento ainda.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
            <View>
              <Text style={[styles.desc, { color: darkMode ? '#f0f4f8' : '#000' }]}>{item.desc}</Text>
              <Text style={[styles.sub, { color: darkMode ? '#ccc' : '#666' }]}>
                {item.type}{item.category ? ` · ${item.category}` : ''}{item.date ? ` · ${item.date}` : ''}
              </Text>
            </View>
            <Text style={[styles.value, { color: item.type==='Entrada' ? '#2a9d8f' : '#e76f51' }]}>{item.value}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item:{ flexDirection:'row', justifyContent:'space-between', padding:12, borderRadius:6, marginBottom:8 },
  desc:{ fontWeight:'600', fontSize:16 },
  sub:{ fontSize:12 },
  value:{ fontWeight:'700', fontSize:16 },
});
