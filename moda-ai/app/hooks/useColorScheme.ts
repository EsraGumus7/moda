import { useColorScheme as _useColorScheme } from 'react-native';
import { ColorScheme } from '@/app/constants/Colors';

export function useColorScheme(): ColorScheme {
  const colorScheme = _useColorScheme();
  return colorScheme || 'light';
}