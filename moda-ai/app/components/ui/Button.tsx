import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (disabled) return colors.tabIconDefault;
    switch (variant) {
      case 'primary':
        return colors.tint;
      case 'secondary':
        return colors.tabIconDefault;
      case 'outline':
        return 'transparent';
      default:
        return colors.tint;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.tint : 'transparent',
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: variant === 'outline' ? colors.tint : colors.background,
          },
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});