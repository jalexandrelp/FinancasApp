// app/(tabs)/settings.tsx
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';
import { ThemeContext } from '../contexts/themeContext';
import { AccountsContext } from '../contexts/accountsContext';
import { FinanceContext } from '../contexts/financeContext';
import { Ionicons } from '@expo/vector-icons';
import SettingCard from '../../components/SettingCard';

// Modais
import AccountsModal from '../../components/AccountsModal';
import CardsModal from '../../components/CardsModal';
import CategoriesModal from '../../components/CategoriesModal';
import ProfilesModal from '../../components/ProfilesModal';

function addAlphaToHex(hex: string, alpha = 0.12) {
  try {
    const h = hex.replace('#', '');
    if (h.length !== 6) throw new Error('Formato hex inesperado');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}

export default function SettingsPage() {
  const { theme, toggleTheme, mode, userName = 'Usuário' } = useContext(ThemeContext) as any;
  const { accounts } = useContext(AccountsContext) as any;
  const { cards, categories, profiles } = useContext(FinanceContext) as any; // corrigido: FinanceContext para cartões/categorias/perfis

  const [accountsModalVisible, setAccountsModalVisible] = useState(false);
  const [cardsModalVisible, setCardsModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);
  const [modalLegalVisible, setModalLegalVisible] = useState(false);
  const [modalVersionVisible, setModalVersionVisible] = useState(false);

  const isDark = useMemo(() => {
    if (typeof mode === 'string') return mode === 'dark';
    const bg = (theme?.background || '').toLowerCase();
    return bg === '#121212' || bg === '#000' || bg.includes('dark');
  }, [mode, theme]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 32, alignItems: 'center' }}
    >
      {/* Cabeçalho */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <Text style={[styles.greeting, { color: theme.text }]}>Olá, {userName}!</Text>
      </View>

      {/* Cards de Configuração */}
      <View style={{ width: '100%', paddingHorizontal: 12 }}>
        <SettingCard
          title="Tema (Dark / Light)"
          icon="color-palette-outline"
          theme={theme}
          rightComponent={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: 'rgba(0,0,0,0.12)', true: addAlphaToHex(theme.primary, 0.28) }}
              accessibilityLabel="Alternar tema escuro/claro"
            />
          }
        />
        <SettingCard title="Minhas Contas" icon="wallet-outline" theme={theme} onPress={() => setAccountsModalVisible(true)} />
        <SettingCard title="Meus Cartões" icon="card-outline" theme={theme} onPress={() => setCardsModalVisible(true)} />
        <SettingCard title="Gerenciar Categorias" icon="list-outline" theme={theme} onPress={() => setCategoriesModalVisible(true)} />
        <SettingCard title="Perfis" icon="people-outline" theme={theme} onPress={() => setProfilesModalVisible(true)} />
        <SettingCard title="FAQ" icon="help-circle-outline" theme={theme} onPress={() => {}} />
        <SettingCard title="Enviar Sugestão" icon="chatbubble-ellipses-outline" theme={theme} onPress={() => {}} />
        <SettingCard title="Termos e Privacidade" icon="document-text-outline" theme={theme} onPress={() => setModalLegalVisible(true)} />
        <SettingCard title="Versão do App" icon="information-circle-outline" theme={theme} onPress={() => setModalVersionVisible(true)} />
      </View>

      {/* Modais de Gerenciamento */}
      <AccountsModal visible={accountsModalVisible} onClose={() => setAccountsModalVisible(false)} accounts={accounts} />
      <CardsModal visible={cardsModalVisible} onClose={() => setCardsModalVisible(false)} cards={cards} />
      <CategoriesModal visible={categoriesModalVisible} onClose={() => setCategoriesModalVisible(false)} categories={categories} />
      <ProfilesModal visible={profilesModalVisible} onClose={() => setProfilesModalVisible(false)} profiles={profiles} />

      {/* Termos e Privacidade */}
      <Modal visible={modalLegalVisible} transparent animationType="fade" onRequestClose={() => setModalLegalVisible(false)}>
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Termos e Privacidade</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              Este aplicativo registra seus lançamentos financeiros localmente e utiliza os dados apenas para cálculos e relatórios. Não vendemos dados a terceiros.
            </Text>
            <Pressable style={[styles.modalCTA, { backgroundColor: theme.primary }]} onPress={() => setModalLegalVisible(false)}>
              <Text style={styles.modalCTAtext}>Fechar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Versão do App */}
      <Modal visible={modalVersionVisible} transparent animationType="fade" onRequestClose={() => setModalVersionVisible(false)}>
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Versão do App</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              FinancasApp v1.0.0{"\n"}Última atualização: 2025-09-03{"\n"}
              Pequenas melhorias visuais, correções de bugs e melhorias de estabilidade.
            </Text>
            <Pressable style={[styles.modalCTA, { backgroundColor: theme.primary }]} onPress={() => setModalVersionVisible(false)}>
              <Text style={styles.modalCTAtext}>Fechar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 32 : 20 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  greeting: { fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modalText: { fontSize: 13, lineHeight: 18 },
  modalCTA: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modalCTAtext: { color: '#fff', fontWeight: '700' },
});
