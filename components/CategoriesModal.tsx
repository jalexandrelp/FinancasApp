import React, { useContext, useState } from 'react';
import { Modal, View, Text, FlatList, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { ThemeContext } from '../app/contexts/themeContext';
import { FinanceContext } from '../app/contexts/financeContext';
import { Ionicons } from '@expo/vector-icons';

interface CategoriesModalProps { visible: boolean; onClose: () => void; }

export default function CategoriesModal({ visible, onClose }: CategoriesModalProps) {
  const { theme } = useContext(ThemeContext) as any;
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(FinanceContext) as any;
  const [editing, setEditing] = useState<{ id?: string; name: string }>({ name: '' });

  const handleSave = () => {
    if (!editing.name.trim()) return;
    if (editing.id) updateCategory(editing); else addCategory({ name: editing.name });
    setEditing({ name: '' });
  };

  const handleEdit = (item: any) => setEditing(item);
  const handleDelete = (id: string) => deleteCategory(id);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Categorias</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Nome da categoria"
              placeholderTextColor={theme.text + '88'}
              value={editing.name}
              onChangeText={(text) => setEditing({ ...editing, name: text })}
              style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
            />
            <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSave}>
              <Text style={styles.buttonText}>{editing.id ? 'Atualizar' : 'Adicionar'}</Text>
            </Pressable>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.itemRow, { borderColor: theme.background }]}>
                <Text style={{ color: theme.text, flex: 1 }}>{item.name}</Text>
                <Pressable onPress={() => handleEdit(item)} style={{ marginRight: 12 }}>
                  <Ionicons name="create-outline" size={20} color={theme.primary} />
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </Pressable>
              </View>
            )}
          />
          <Pressable style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  modal: { width: '100%', borderRadius: 12, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  form: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 40, marginRight: 8 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
  closeButton: { marginTop: 16, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
});
