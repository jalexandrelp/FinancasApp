import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { AccountsContext } from '../app/contexts/accountsContext';
import AccountModal from './AccountModal';

export default function AccountsList() {
  const { accounts } = useContext(AccountsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handleEdit(item)}>
            <Text style={styles.text}>{item.name}</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+ Adicionar Conta</Text>
      </Pressable>
      <AccountModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingAccount(null);
        }}
        account={editingAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, backgroundColor: '#eee', borderRadius: 10, marginBottom: 8 },
  text: { fontSize: 16 },
  addButton: { marginTop: 12, padding: 12, backgroundColor: '#4caf50', borderRadius: 10, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700' },
});
