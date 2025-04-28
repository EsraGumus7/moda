import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, ScrollView, Text } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { WardrobeItem } from '@/app/components/WardrobeItem';
import { Button } from '@/app/components/ui/Button';
import { ClothingItem } from '@/app/types';

// Örnek veri - Daha sonra gerçek verilerle değiştirilecek
const SAMPLE_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: 'Siyah Basic T-shirt',
    category: 'tops',
    color: '#000000',
    season: ['spring', 'summer', 'fall'],
    image: 'https://example.com/tshirt.jpg',
    brand: 'Basic Co.',
  },
  {
    id: '2',
    name: 'Mavi Kot Pantolon',
    category: 'bottoms',
    color: '#0000FF',
    season: ['spring', 'fall', 'winter'],
    image: 'https://example.com/jeans.jpg',
    brand: 'Denim Brand',
  },
];

export default function WardrobeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [selectedCategory, setSelectedCategory] = useState<ClothingItem['category'] | 'all'>('all');

  const categories: { label: string; value: ClothingItem['category'] | 'all' }[] = [
    { label: 'Tümü', value: 'all' },
    { label: 'Üst Giyim', value: 'tops' },
    { label: 'Alt Giyim', value: 'bottoms' },
    { label: 'Elbiseler', value: 'dresses' },
    { label: 'Dış Giyim', value: 'outerwear' },
    { label: 'Ayakkabılar', value: 'shoes' },
    { label: 'Aksesuarlar', value: 'accessories' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? SAMPLE_ITEMS
    : SAMPLE_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Gardırobum</Text>
        <Button
          title="+ Kıyafet Ekle"
          onPress={() => {/* TODO: Kıyafet ekleme modalını aç */}}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <Pressable
            key={category.value}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === category.value ? colors.tint : colors.card,
              },
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category.value ? colors.background : colors.text,
                },
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WardrobeItem
            item={item}
            onPress={() => {/* TODO: Kıyafet detay modalını aç */}}
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
  categoryScroll: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 20,
    gap: 16,
  },
});