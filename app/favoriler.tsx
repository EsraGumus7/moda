import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavori } from './FavoriContext';

export default function FavorilerScreen() {
  const { favoriler, favoriCikar } = useFavori();

  const kiyafetler = favoriler.filter(f => f.tip === 'kiyafet');
  const kombinler = favoriler.filter(f => f.tip === 'kombin');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
      </View>

      <ScrollView style={styles.content}>
        {kiyafetler.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favori Kıyafetlerim</Text>
            <View style={styles.kiyafetGrid}>
              {kiyafetler.map((favori, index) => (
                <View key={index} style={styles.kiyafetCard}>
                  <Image 
                    source={{ uri: favori.kiyafetDetay?.resimUrl }} 
                    style={styles.kiyafetImage} 
                  />
                  <View style={styles.kiyafetInfo}>
                    <Text style={styles.kiyafetName}>{favori.kiyafetDetay?.isim}</Text>
                    <Text style={styles.kiyafetCategory}>{favori.kiyafetDetay?.kategori}</Text>
                    <Text style={styles.kiyafetSeason}>{favori.kiyafetDetay?.mevsim}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriButton}
                    onPress={() => favoriCikar(favori)}
                  >
                    <Ionicons name="heart" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {kombinler.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favori Kombinlerim</Text>
            {kombinler.map((favori, index) => (
              <View key={index} style={styles.kombinCard}>
                <Text style={styles.kombinText}>{favori.icerik}</Text>
                <TouchableOpacity 
                  style={styles.favoriButton}
                  onPress={() => favoriCikar(favori)}
                >
                  <Ionicons name="heart" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {favoriler.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#B388A8" />
            <Text style={styles.emptyText}>Henüz favori eklenmemiş</Text>
          </View>
        )}
      </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 15,
  },
  kiyafetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kiyafetCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  kiyafetImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  kiyafetInfo: {
    padding: 10,
  },
  kiyafetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 5,
  },
  kiyafetCategory: {
    fontSize: 14,
    color: '#B388A8',
    marginBottom: 3,
  },
  kiyafetSeason: {
    fontSize: 14,
    color: '#B388A8',
  },
  kombinCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  kombinText: {
    flex: 1,
    fontSize: 16,
    color: '#8A2BE2',
    marginRight: 10,
  },
  favoriButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#B388A8',
    marginTop: 15,
  },
}); 