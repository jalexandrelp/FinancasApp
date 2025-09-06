import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Se caller passou style dentro de otherProps (por algum motivo),
  // pegamos e mesclamos corretamente para evitar sobrescrita acidental.
  const { style: otherStyle, ...rest } = otherProps as any;

  return <View {...rest} style={[{ backgroundColor }, style, otherStyle]} />;
}
