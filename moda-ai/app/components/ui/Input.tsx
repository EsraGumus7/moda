import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  secureTextEntry,
  multiline,
  numberOfLines,
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.tabIconDefault}
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text,
        },
        inputStyle,
      ]}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
});
