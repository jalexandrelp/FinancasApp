import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FinanceContext, type Category } from '../src/contexts/financeContext';
import { ThemeContext } from '../src/contexts/themeContext';

interface CategoriesModalProps { visible: boolean; onClose: () => void; }

export default function CategoriesModal({ visible, onClose }: CategoriesModalProps) {
  const themeCtx = useContext(ThemeContext) as any;
  const ctx = useContext(FinanceContext);
  if (!themeCtx || !ctx) return null;

  const { theme } = themeCtx;
  const { categories, addCategory, updateCategory, deleteCategory } = ctx;

  const [editing, setEditing] = useState<Category>({ id: '', name: '' });

  useEffect(() => {
    if (!visible) setEditing({ id: '', name: '' });
  }, [visible]);

  const handleSave = () => {
    const name = (editing.name || '').trim();
    if (!name) return;

    if (editing.id) updateCategory({ id: editing.id, name });
    else addCategory({ id: Date.now().toString(), name });

    setEditing({ id: '', name: '' });
  };

  const handleEdit = (item: Category) => setEditing(item);
  const handleDelete = (id: string) => deleteCategory(id);
  const isSaveDisabled = !(editing.name || '').trim();

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
              onChangeText={(t) => setEditing((s) => ({ ...s, name: t }))}
              style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
            />
            <Pressable
              style={[styles.button, { backgroundColor: isSaveDisabled ? '#ccc' : theme.primary }]}
              onPress={handleSave}
              disabled={isSaveDisabled}
            >
              <Text style={styles.buttonText}>{editing.id ? 'Atualizar' : 'Adicionar'}</Text>
            </Pressable>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 16 }}
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

          <Pressable style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={() => { onClose(); setEditing({ id: '', name: '' }); }}>
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
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  form: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 40, marginRight: 8 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
  closeButton: { marginTop: 16, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
});
