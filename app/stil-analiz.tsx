import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fotoAnaliziYap } from '../services/gemini';

export default function StilAnaliziScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analizSonucu, setAnalizSonucu] = useState<string>('');
  const [puan, setPuan] = useState<string | null>(null);
  const [puanGoster, setPuanGoster] = useState(false);

  const resimSec = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
    }
  };

  const analizYap = async () => {
    if (!selectedImage) {
      Alert.alert('Uyarı', 'Lütfen önce bir fotoğraf seçin.');
      return;
    }

    setLoading(true);
    try {
      const analiz = await fotoAnaliziYap(selectedImage);
      setAnalizSonucu(analiz);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Analiz yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatAnalizSonucu = (analizSonucu: string) => {
    const lines = analizSonucu.split(/\n+/);
    return lines.map((line, idx) => {
      const baslikMatch = line.match(/^\*\*(.*?)\*\*:?/);
      if (baslikMatch) {
        return (
          <Text key={idx} style={{ fontWeight: 'bold', fontSize: 17, color: '#8A2BE2', marginTop: 12, marginBottom: 4 }}>
            {baslikMatch[1]}
          </Text>
        );
      }
      return (
        <Text key={idx} style={{ fontSize: 15, color: '#333', marginBottom: 2, lineHeight: 22 }}>{line}</Text>
      );
    });
  };

  useEffect(() => {
    if (analizSonucu) {
      const puanRegex = /Puan[:：]?\s*([0-9]+(?:\.[0-9]+)?\/?10)/i;
      const match = analizSonucu.match(puanRegex);
      if (match) {
        setPuan(match[1]);
        setPuanGoster(true);
        const timer = setTimeout(() => setPuanGoster(false), 4000);
        return () => clearTimeout(timer);
      } else {
        setPuan(null);
        setPuanGoster(false);
      }
    }
  }, [analizSonucu]);

  // Pinterest arama linki oluşturucu
  const pinterestAramaLinki = (analizSonucu: string) => {
    // Analiz sonucundan anahtar kelimeleri çekmek için basit bir yaklaşım
    // (Dilersen daha gelişmiş bir anahtar kelime çıkarımı ekleyebilirsin)
    const kelimeler = analizSonucu
      .replace(/\*\*.*?\*\*/g, '') // başlıkları çıkar
      .replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ0-9\s]/g, '') // noktalama işaretlerini çıkar
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 8) // ilk 8 kelimeyle sınırla
      .join(' ');
    return `https://tr.pinterest.com/search/pins/?q=${encodeURIComponent(kelimeler + ' kombin')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {puanGoster && puan && (
        <View style={styles.puanContainer}>
          <Text style={styles.puanText}>{puan}</Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Stil Analizi</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.imageButton} onPress={resimSec}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera-outline" size={40} color="#8A2BE2" />
              <Text style={styles.placeholderText}>Kombin Fotoğrafı Seç</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.analyzeButton, !selectedImage && styles.analyzeButtonDisabled]}
          onPress={analizYap}
          disabled={!selectedImage}
        >
          <Text style={styles.analyzeButtonText}>Stil Analizi Yap</Text>
        </TouchableOpacity>

        {analizSonucu ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analiz Sonucu</Text>
            {formatAnalizSonucu(analizSonucu)}
            <TouchableOpacity
              style={{
                backgroundColor: '#E60023',
                padding: 14,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 18,
              }}
              onPress={() => Linking.openURL(pinterestAramaLinki(analizSonucu))}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                Pinterest&apos;te benzer kombinleri gör
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>Analiz yapılıyor...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F9',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageButton: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0E6FF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#8A2BE2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#E6E6FA',
  },
  analyzeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8A2BE2',
  },
  puanContainer: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  puanText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#8A2BE2',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    elevation: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOpacity: 0.7,
    shadowRadius: 20,
    marginBottom: 10,
  },
}); 