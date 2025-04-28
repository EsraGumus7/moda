import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Card } from '@/app/components/ui/Card';
import { Text } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>MODA AI</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Kişisel Stil Asistanınız
        </Text>
      </View>

      <View style={styles.features}>
        <Card>
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Gardırop Yönetimi
            </Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Kıyafetlerinizi dijital ortamda düzenleyin ve yönetin
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Kombin Önerileri
            </Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Yapay zeka destekli kişiselleştirilmiş kombin önerileri alın
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.featureItem}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Alışveriş Asistanı
            </Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Eksik parçalar için akıllı alışveriş önerileri keşfedin
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
  },
  features: {
    padding: 20,
    gap: 16,
  },
  featureItem: {
    padding: 16,
    gap: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 16,
    opacity: 0.8,
  },
});
