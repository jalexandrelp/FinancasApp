// app/(tabs)/settings.tsx
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SettingsContext } from '../contexts/settingsContext';

export default function Settings() {
  const { categories, addCategory, editCategory, removeCategory } = useContext(SettingsContext);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    addCategory({ id: Math.random().toString(), name: newCategory });
    setNewCategory('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Nova Categoria"
          style={styles.input}
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Text style={{ color: '#fff' }}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => removeCategory(item.id)}>
              <Text style={{ color: 'red' }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 8, marginRight: 8 },
  addButton: { padding: 12, backgroundColor: '#2a9d8f', borderRadius: 6 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1 },
});
