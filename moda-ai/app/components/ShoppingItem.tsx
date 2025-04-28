import React from 'react';
import { View, Image, StyleSheet, Pressable, Text, Linking, ScrollView } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShoppingRecommendation } from '@/app/types';

interface ShoppingItemProps {
  recommendation: ShoppingRecommendation;
  onPress?: () => void;
}

export function ShoppingItem({ recommendation, onPress }: ShoppingItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {recommendation.item.name}
          </Text>
          <Text style={[styles.category, { color: colors.text }]}>
            {recommendation.item.category}
          </Text>
        </View>

        <Text style={[styles.reason, { color: colors.text }]}>
          {recommendation.item.reason}
        </Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.suggestionsScroll}
        >
          {recommendation.suggestedItems.map((item, index) => (
            <Pressable key={index} onPress={onPress} style={styles.suggestionItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.brand, { color: colors.text }]}>
                  {item.brand}
                </Text>
                <Text style={[styles.price, { color: colors.text }]}>
                  {item.price.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  })}
                </Text>
                <Button
                  title="Satın Al"
                  variant="outline"
                  onPress={() => Linking.openURL(item.shopUrl)}
                  style={styles.buyButton}
                />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
  },
  reason: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  suggestionsScroll: {
    marginTop: 8,
  },
  suggestionItem: {
    width: 160,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  itemDetails: {
    marginTop: 8,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  brand: {
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {
    marginTop: 8,
  },
});
