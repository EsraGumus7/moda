import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from '@/app/constants/Colors';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              backgroundColor: colors.background,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
            android: {
              backgroundColor: colors.background,
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Gardırop',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="hanger" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfits"
        options={{
          title: 'Kombinler',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="tshirt-crew" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Alışveriş',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="shopping" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({
  name,
  color,
  size = 24,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  size?: number;
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
