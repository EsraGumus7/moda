import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Text } from 'react-native';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Giriş işlemleri burada yapılacak
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>MODA AI</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Kişisel Stil Asistanınız
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          style={styles.input}
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          secureTextEntry
          style={styles.input}
        />
        <Button
          title="Giriş Yap"
          onPress={handleLogin}
          style={styles.button}
        />
        <Link href="../register" asChild>
          <Button
            title="Hesap Oluştur"
            variant="outline"
            style={styles.button}
            onPress={() => {}}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 60,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
  },
  form: {
    gap: 16,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
