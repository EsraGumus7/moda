import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Text } from 'react-native';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleRegister = () => {
    // TODO: Kayıt işlemleri burada yapılacak
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Hesap Oluştur</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Kişisel stil yolculuğunuza başlayın
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
          style={styles.input}
        />
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
        <Input
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="Şifre Tekrar"
          secureTextEntry
          style={styles.input}
        />
        <Button
          title="Kayıt Ol"
          onPress={handleRegister}
          style={styles.button}
        />
        <Link href="../login" asChild>
          <Button
            title="Zaten hesabım var"
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
    marginTop: 60,
    marginBottom: 40,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
