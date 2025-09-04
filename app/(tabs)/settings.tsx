// app/(tabs)/settings.tsx
import React, { useContext, useMemo, useCallback, useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { ThemeContext } from '../contexts/themeContext';
import { AccountsContext } from '../contexts/accountsContext';
import { FinanceContext } from '../contexts/financeContext';
import { Ionicons } from '@expo/vector-icons';
import ActionRow from '../../components/ActionRow';

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

const SettingCard = React.memo(function SettingCard({
  title,
  icon,
  onPress = () => {},
  rightComponent,
  theme,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  theme: any;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 20, bounciness: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginBottom: 8 }}>
      <ActionRow onPress={handlePress} accessibilityLabel={title}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.background }]}>
          <View style={[styles.iconWrap, { backgroundColor: addAlphaToHex(theme.primary, 0.12) }]}>
            <Ionicons name={icon} size={20} color={theme.primary} />
          </View>
          <Text style={[styles.cardText, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {rightComponent ?? <Ionicons name="chevron-forward" size={18} color={theme.primary} />}
        </View>
      </ActionRow>
    </Animated.View>
  );
});

export default function SettingsPage() {
  const themeContext = useContext(ThemeContext);
  const accountsContext = useContext(AccountsContext);
  const financeContext = useContext(FinanceContext);

  if (!themeContext) return null;
  const { theme, toggleTheme, mode, userName = 'Usuário' } = themeContext as any;

  const [modalLegalVisible, setModalLegalVisible] = useState(false);
  const [modalVersionVisible, setModalVersionVisible] = useState(false);

  // Estados dos modais de gerenciamento
  const [accountsModalVisible, setAccountsModalVisible] = useState(false);
  const [cardsModalVisible, setCardsModalVisible] = useState(false);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [profilesModalVisible, setProfilesModalVisible] = useState(false);

  const isDark = useMemo(() => {
    if (typeof mode === 'string') return mode === 'dark';
    const bg = (theme?.background || '').toLowerCase();
    return bg === '#121212' || bg === '#000' || bg.includes('dark');
  }, [mode, theme]);

  const handleToggleTheme = useCallback(() => {
    if (typeof toggleTheme === 'function') toggleTheme();
  }, [toggleTheme]);

  const handleLogout = () => console.log('Logout do usuário');

  // Abrir modais
  const handleManageAccounts = () => setAccountsModalVisible(true);
  const handleManageCards = () => setCardsModalVisible(true);
  const handleManageCategories = () => setCategoriesModalVisible(true);
  const handleManageProfiles = () => setProfilesModalVisible(true);

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

      {/* Cards */}
      <View style={{ width: '100%', paddingHorizontal: 12 }}>
        <SettingCard
          title="Tema (Dark / Light)"
          icon="color-palette-outline"
          theme={theme}
          rightComponent={
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: 'rgba(0,0,0,0.12)', true: addAlphaToHex(theme.primary, 0.28) }}
              accessibilityLabel="Alternar tema escuro/claro"
            />
          }
        />
        <SettingCard title="Minhas Contas" icon="wallet-outline" theme={theme} onPress={handleManageAccounts} />
        <SettingCard title="Meus Cartões" icon="card-outline" theme={theme} onPress={handleManageCards} />
        <SettingCard title="Gerenciar Categorias" icon="list-outline" theme={theme} onPress={handleManageCategories} />
        <SettingCard title="Perfis" icon="people-outline" theme={theme} onPress={handleManageProfiles} />
        <SettingCard title="FAQ" icon="help-circle-outline" theme={theme} onPress={() => {}} />
        <SettingCard title="Enviar Sugestão" icon="chatbubble-ellipses-outline" theme={theme} onPress={() => {}} />
        <SettingCard title="Termos e Privacidade" icon="document-text-outline" theme={theme} onPress={() => setModalLegalVisible(true)} />
        <SettingCard title="Versão do App" icon="information-circle-outline" theme={theme} onPress={() => setModalVersionVisible(true)} />
        <SettingCard title="Sair da Conta" icon="log-out-outline" theme={theme} onPress={handleLogout} />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cardText: { flex: 1, fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modalText: { fontSize: 13, lineHeight: 18 },
  modalCTA: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modalCTAtext: { color: '#fff', fontWeight: '700' },
});
