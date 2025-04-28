import { Stack } from 'expo-router';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Colors } from '@/app/constants/Colors';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
