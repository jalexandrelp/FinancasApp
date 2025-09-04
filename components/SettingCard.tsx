// FinancasApp/components/SettingCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionRow from './ActionRow'; // CORRETO: import local dentro de components

// ajuste o tipo se você já exporta Theme do themeContext
import type { Theme } from '../app/contexts/themeContext';

interface SettingCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void; // opcional é mais flexível
  rightComponent?: React.ReactNode;
  theme: Theme;
}

export default function SettingCard({ title, icon, onPress, rightComponent, theme }: SettingCardProps) {
  const iconBg = (() => {
    try {
      const hex = (theme.primary || '').replace('#', '');
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.12)`;
      }
    } catch {}
    return 'rgba(0,0,0,0.06)';
  })();

  return (
    <ActionRow onPress={onPress}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.background }]}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={theme.primary} />
        </View>
        <Text style={[styles.cardText, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        {rightComponent ?? <Ionicons name="chevron-forward" size={16} color={theme.primary} />}
      </View>
    </ActionRow>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardText: { flex: 1, fontSize: 14 },
});
