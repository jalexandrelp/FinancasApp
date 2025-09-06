import React, { useContext, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import SettingCard from '../../components/SettingCard';
import { AccountsContext } from '../../src/contexts/accountsContext';
import { FinanceContext } from '../../src/contexts/financeContext';
import { ThemeContext, type ThemeContextType } from '../../src/contexts/themeContext';

import AccountsModal from '../../components/AccountsModal';
import CardsModal from '../../components/CardsModal';
import CategoriesModal from '../../components/CategoriesModal';
import ProfilesModal from '../../components/ProfilesModal';

function addAlphaToHex(hex: string, alpha = 0.12) {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}

export default function SettingsPage() {
  const themeCtx = useContext(ThemeContext) as ThemeContextType;
  const { theme, toggleTheme, mode, userName = 'Usuário' } = themeCtx;

  const accountsCtx = useContext(AccountsContext);
  const financeCtx = useContext(FinanceContext);

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
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <SettingCard.Text style={{ color: theme.text, fontWeight: '700', fontSize: 18 }}>
          Olá, {userName}!
        </SettingCard.Text>
      </View>

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
            />
          }
        />
        <SettingCard title="Minhas Contas" icon="wallet-outline" theme={theme} onPress={() => setAccountsModalVisible(true)} />
        <SettingCard title="Meus Cartões" icon="card-outline" theme={theme} onPress={() => setCardsModalVisible(true)} />
        <SettingCard title="Gerenciar Categorias" icon="list-outline" theme={theme} onPress={() => setCategoriesModalVisible(true)} />
        <SettingCard title="Perfis" icon="people-outline" theme={theme} onPress={() => setProfilesModalVisible(true)} />
      </View>

      {/* Modais */}
      <AccountsModal visible={accountsModalVisible} onClose={() => setAccountsModalVisible(false)} />
      <CardsModal visible={cardsModalVisible} onClose={() => setCardsModalVisible(false)} />
      <CategoriesModal visible={categoriesModalVisible} onClose={() => setCategoriesModalVisible(false)} />
      <ProfilesModal visible={profilesModalVisible} onClose={() => setProfilesModalVisible(false)} />

      {/* Termos e Versão */}
      <Modal visible={modalLegalVisible} transparent animationType="fade" onRequestClose={() => setModalLegalVisible(false)}>
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <SettingCard.Text style={styles.modalTitle}>Termos e Privacidade</SettingCard.Text>
            <SettingCard.Text style={styles.modalText}>
              Este aplicativo registra seus lançamentos financeiros localmente e utiliza os dados apenas para cálculos e relatórios. Não vendemos dados a terceiros.
            </SettingCard.Text>
            <Pressable style={[styles.modalCTA, { backgroundColor: theme.primary }]} onPress={() => setModalLegalVisible(false)}>
              <SettingCard.Text style={styles.modalCTAtext}>Fechar</SettingCard.Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={modalVersionVisible} transparent animationType="fade" onRequestClose={() => setModalVersionVisible(false)}>
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <SettingCard.Text style={styles.modalTitle}>Versão do App</SettingCard.Text>
            <SettingCard.Text style={styles.modalText}>
              FinancasApp v1.0.0{"\n"}Última atualização: 2025-09-03{"\n"}Pequenas melhorias visuais, correções de bugs e melhorias de estabilidade.
            </SettingCard.Text>
            <Pressable style={[styles.modalCTA, { backgroundColor: theme.primary }]} onPress={() => setModalVersionVisible(false)}>
              <SettingCard.Text style={styles.modalCTAtext}>Fechar</SettingCard.Text>
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
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modalText: { fontSize: 13, lineHeight: 18 },
  modalCTA: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modalCTAtext: { color: '#fff', fontWeight: '700' },
});
