import React from 'react';
import { View, StyleSheet, FlatList, ScrollView, Text } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { ShoppingItem } from '@/app/components/ShoppingItem';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { ShoppingRecommendation } from '@/app/types';

// Örnek veri - Daha sonra gerçek verilerle değiştirilecek
const SAMPLE_RECOMMENDATIONS: ShoppingRecommendation[] = [
  {
    id: '1',
    item: {
      name: 'Blazer Ceket',
      category: 'outerwear',
      reason: 'İş kombinlerinizi tamamlamak için şık bir blazer ceket eksik.',
    },
    suggestedItems: [
      {
        name: 'Klasik Siyah Blazer',
        brand: 'Business Style',
        price: 899.99,
        imageUrl: 'https://example.com/blazer1.jpg',
        shopUrl: 'https://example.com/shop/blazer1',
      },
      {
        name: 'Bej Blazer',
        brand: 'Urban Chic',
        price: 759.99,
        imageUrl: 'https://example.com/blazer2.jpg',
        shopUrl: 'https://example.com/shop/blazer2',
      },
    ],
  },
  {
    id: '2',
    item: {
      name: 'Beyaz Sneaker',
      category: 'shoes',
      reason: 'Günlük kombinleriniz için versatil bir beyaz sneaker öneriyoruz.',
    },
    suggestedItems: [
      {
        name: 'Minimal Beyaz Sneaker',
        brand: 'Street Style',
        price: 1299.99,
        imageUrl: 'https://example.com/sneaker1.jpg',
        shopUrl: 'https://example.com/shop/sneaker1',
      },
      {
        name: 'Klasik Beyaz Sneaker',
        brand: 'Sport Brand',
        price: 899.99,
        imageUrl: 'https://example.com/sneaker2.jpg',
        shopUrl: 'https://example.com/shop/sneaker2',
      },
    ],
  },
];

export default function ShoppingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Alışveriş Önerileri</Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>
                Parça
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>6</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>
                Eksik
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.tint }]}>%75</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>
                Doluluk
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Önerilen Kategoriler
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <Button title="Hepsi" variant="primary" style={styles.categoryButton} onPress={() => {}} />
            <Button title="Üst Giyim" variant="outline" style={styles.categoryButton} onPress={() => {}} />
            <Button title="Alt Giyim" variant="outline" style={styles.categoryButton} onPress={() => {}} />
            <Button title="Ayakkabı" variant="outline" style={styles.categoryButton} onPress={() => {}} />
            <Button title="Aksesuar" variant="outline" style={styles.categoryButton} onPress={() => {}} />
          </ScrollView>
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Size Özel Öneriler
          </Text>
          {SAMPLE_RECOMMENDATIONS.map((recommendation) => (
            <ShoppingItem
              key={recommendation.id}
              recommendation={recommendation}
              onPress={() => {/* TODO: Ürün detayını aç */}}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    marginRight: 8,
  },
  recommendationsSection: {
    padding: 20,
    gap: 16,
  },
});
