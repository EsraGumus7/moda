import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, Tabs, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { FavoriProvider } from './FavoriContext';

export default function RootLayout() {
  const [onboardingBitti, setOnboardingBitti] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('onboardingBitti');
        setOnboardingBitti(value === '1');
      } catch (error) {
        console.error('Onboarding kontrolü hatası:', error);
        setOnboardingBitti(false);
      }
    };
    checkOnboarding();
  }, []);

  if (onboardingBitti === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF6F9' }}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  if (!onboardingBitti && pathname !== '/onboarding') {
    return <Slot />;
  }

  return (
    <FavoriProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: '#B388A8',
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 0.5,
            borderTopColor: '#E6E6FA',
            height: 60,
            paddingBottom: 6,
            paddingTop: 6,
            marginBottom: 45,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 13,
            marginBottom: 2,
            textAlign: 'center',
            padding: 0,
          },
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 28 : 24;
            if (route.name === 'index') return <Ionicons name="home" size={iconSize} color={color} style={{ alignSelf: 'center' }} />;
            if (route.name === 'gardirop-yonetimi') return <Ionicons name="shirt" size={iconSize} color={color} style={{ alignSelf: 'center' }} />;
            if (route.name === 'favoriler') return <Ionicons name="heart" size={iconSize} color={color} style={{ alignSelf: 'center' }} />;
            if (route.name === 'profil') return <Ionicons name="person-circle" size={iconSize} color={color} style={{ alignSelf: 'center' }} />;
            return null;
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Anasayfa' }} />
        <Tabs.Screen name="gardirop-yonetimi" options={{ title: 'Gardırobum' }} />
        <Tabs.Screen name="favoriler" options={{ title: 'Favoriler' }} />
        <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
        <Tabs.Screen name="kiyafet-onerisi" options={{ href: null }} />
        <Tabs.Screen name="stil-analiz" options={{ href: null }} />
      </Tabs>
    </FavoriProvider>
  );
} 