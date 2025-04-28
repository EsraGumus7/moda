import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Text } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { OutfitCard } from '@/app/components/OutfitCard';
import { Button } from '@/app/components/ui/Button';
import { Outfit } from '@/app/types';

// Örnek veri - Daha sonra gerçek verilerle değiştirilecek
const SAMPLE_OUTFITS: Outfit[] = [
  {
    id: '1',
    name: 'Günlük Şık',
    items: [
      {
        id: '1',
        name: 'Beyaz Gömlek',
        category: 'tops',
        color: '#FFFFFF',
        season: ['spring', 'summer', 'fall'],
        image: 'https://example.com/shirt.jpg',
        brand: 'Classic Brand',
      },
      {
        id: '2',
        name: 'Siyah Pantolon',
        category: 'bottoms',
        color: '#000000',
        season: ['fall'],
        image: 'https://example.com/pants.jpg',
        brand: 'Urban Style',
      },
    ],
    occasion: 'casual',
    season: ['spring', 'fall'],
    created: new Date().toISOString(),
  },
];

export default function OutfitsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [selectedOccasion, setSelectedOccasion] = useState<Outfit['occasion'] | 'all'>('all');

  const occasions = [
    { label: 'Tümü', value: 'all' },
    { label: 'Günlük', value: 'casual' },
    { label: 'İş', value: 'business' },
    { label: 'Resmi', value: 'formal' },
    { label: 'Spor', value: 'sport' },
  ];

  const filteredOutfits = selectedOccasion === 'all'
    ? SAMPLE_OUTFITS
    : SAMPLE_OUTFITS.filter(outfit => outfit.occasion === selectedOccasion);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Kombinlerim</Text>
        <Button
          title="+ Yeni Kombin"
          onPress={() => {/* TODO: Kombin oluşturma modalını aç */}}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>Durum</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {occasions.map((occasion) => (
            <Button
              key={occasion.value}
              title={occasion.label}
              variant={selectedOccasion === occasion.value ? 'primary' : 'outline'}
              onPress={() => setSelectedOccasion(occasion.value as typeof selectedOccasion)}
              style={styles.filterButton}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOutfits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OutfitCard
            outfit={item}
            onPress={() => {/* TODO: Kombin detay modalını aç */}}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButton: {
    marginRight: 8,
  },
  list: {
    padding: 20,
  },
});
