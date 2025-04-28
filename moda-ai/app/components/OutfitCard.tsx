import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Card } from './ui/Card';
import { WardrobeItem } from './WardrobeItem';
import { Outfit } from '@/app/types';

interface OutfitCardProps {
  outfit: Outfit;
  onPress?: () => void;
}

export function OutfitCard({ outfit, onPress }: OutfitCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>{outfit.name}</Text>
          <Text style={[styles.occasion, { color: colors.text }]}>
            {outfit.occasion}
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.itemsScroll}
          >
            {outfit.items.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <WardrobeItem item={item} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.seasonTags}>
            {outfit.season.map((season) => (
              <View
                key={season}
                style={[styles.seasonTag, { backgroundColor: colors.card }]}>
                <Text style={[styles.seasonText, { color: colors.text }]}>
                  {season}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  occasion: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  itemsScroll: {
    marginVertical: 12,
  },
  itemContainer: {
    width: 200,
    marginRight: 12,
  },
  seasonTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seasonTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  seasonText: {
    fontSize: 12,
  },
});
