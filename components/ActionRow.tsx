// FinancasApp/components/ActionRow.tsx
import React from 'react';
import { Pressable, PressableProps } from 'react-native';

const ActionRow = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => {
  const androidRipple: PressableProps['android_ripple'] = { color: 'rgba(0,0,0,0.08)' };
  return (
    <Pressable
      onPress={onPress}
      android_ripple={androidRipple}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      {children}
    </Pressable>
  );
};

export default ActionRow;
