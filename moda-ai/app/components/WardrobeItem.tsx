import React from 'react';
import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Card } from './ui/Card';
import { ClothingItem } from '@/app/types';

interface WardrobeItemProps {
  item: ClothingItem;
  onPress?: () => void;
}

export function WardrobeItem({ item, onPress }: WardrobeItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.container}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.category, { color: colors.text }]}>{item.category}</Text>
            <View style={styles.tags}>
              <View style={[styles.colorTag, { backgroundColor: item.color }]} />
              {item.season.map((season) => (
                <View
                  key={season}
                  style={[styles.seasonTag, { backgroundColor: colors.card }]}>
                  <Text style={[styles.seasonText, { color: colors.text }]}>{season}</Text>
                </View>
              ))}
            </View>
            {item.brand && (
              <Text style={[styles.brand, { color: colors.text }]}>{item.brand}</Text>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  colorTag: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  seasonTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  seasonText: {
    fontSize: 12,
  },
  brand: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
