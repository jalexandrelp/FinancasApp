import React, { useContext, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AccountsContext } from '../src/contexts/accountsContext';
import { ThemeContext } from '../src/contexts/themeContext';
import AccountModal from './AccountsModal';

interface Account {
  id?: string;
  name: string;
}

export default function AccountsList() {
  const ctx = useContext(AccountsContext);
  if (!ctx) return null; // ou exiba Placeholder
  const { accounts } = ctx;
  const { theme } = useContext(ThemeContext) as any;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.item, { backgroundColor: theme.card }]}
            onPress={() => handleEdit(item)}
          >
            <Text style={[styles.text, { color: theme.text }]}>{item.name}</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => setModalVisible(true)}
      >
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
  item: { padding: 12, borderRadius: 10, marginBottom: 8 },
  text: { fontSize: 16 },
  addButton: { marginTop: 12, padding: 12, borderRadius: 10, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700' },
});
