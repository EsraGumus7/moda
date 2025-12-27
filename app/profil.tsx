import { addDoc, collection, getDocs, getFirestore, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { app } from '../firebaseConfig';
import { kullaniciSiparisleri } from '../services/trendyolSiparislerMockData';

const db = getFirestore(app);

export default function ProfilScreen() {
  const [siparisler, setSiparisler] = useState(kullaniciSiparisleri);
  const [aktifTab, setAktifTab] = useState<'kıyafet' | 'diğer'>('kıyafet');
  const [otomatikEklemeYapildi, setOtomatikEklemeYapildi] = useState(false);

  // Kategori eşleştirme fonksiyonu
  const kategoriEslestir = (altKategori: string) => {
    const kategoriMap: { [key: string]: string } = {
      'Gömlek': 'Üst Giyim',
      'T-Shirt': 'Üst Giyim',
      'Bluz': 'Üst Giyim',
      'Kazak': 'Üst Giyim',
      'Sweatshirt': 'Üst Giyim',
      'Pantolon': 'Alt Giyim',
      'Jean': 'Alt Giyim',
      'Etek': 'Alt Giyim',
      'Şort': 'Alt Giyim',
      'Spor Ayakkabı': 'Ayakkabı',
      'Bot': 'Ayakkabı',
      'Sandalet': 'Ayakkabı',
      'Kolye': 'Aksesuar',
      'Küpe': 'Aksesuar',
      'Bilezik': 'Aksesuar',
      'Saat': 'Aksesuar',
      'Çanta': 'Çanta',
      'Mont': 'Mont/Ceket',
      'Ceket': 'Mont/Ceket',
      'Trençkot': 'Mont/Ceket',
    };
    return kategoriMap[altKategori] || 'Üst Giyim';
  };

  // Gardıroba ekleme fonksiyonu
  const gardiropaEkle = async (siparis: any, showAlert: boolean = true) => {
    try {
      const kategori = kategoriEslestir(siparis.altKategori);
      
      await addDoc(collection(db, 'kiyafetler'), {
        isim: siparis.isim,
        kategori: kategori,
        mevsim: 'Genel',
        resimUrl: siparis.resimUrl,
        created_at: new Date(),
        trendyolSiparisi: true,
      });

      if (showAlert) {
        Alert.alert('Başarılı', 'Kıyafet gardıroba eklendi!');
      }
    } catch (error) {
      if (showAlert) {
        Alert.alert('Hata', 'Kıyafet gardıroba eklenirken bir hata oluştu.');
      }
    }
  };

  // Otomatik gardıroba ekleme
  const otomatikGardiropaEkle = async () => {
    if (otomatikEklemeYapildi) return;
    
    try {
      const kiyafetSiparisleri = siparisler.filter(s => s.kategori === 'Kıyafet');
      
      for (const siparis of kiyafetSiparisleri) {
        // Zaten gardıroba eklenmiş mi kontrol et
        const q = query(collection(db, 'kiyafetler'));
        const querySnapshot = await getDocs(q);
        const mevcutKiyafetler = querySnapshot.docs.map(doc => doc.data());
        
        const zatenVar = mevcutKiyafetler.some(k => k.isim === siparis.isim);
        
        if (!zatenVar) {
          await gardiropaEkle(siparis, false);
        }
      }
      
      setOtomatikEklemeYapildi(true);
    } catch (error) {
      console.error('Otomatik ekleme hatası:', error);
    }
  };

  useEffect(() => {
    otomatikGardiropaEkle();
  }, []);

  // Filtrelenmiş siparişleri getir
  const getFiltrelenmisSiparisler = () => {
    if (aktifTab === 'kıyafet') {
      return siparisler.filter(s => s.kategori === 'Kıyafet');
    } else {
      return siparisler.filter(s => s.kategori !== 'Kıyafet');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'kıyafet' && styles.activeTab]}
          onPress={() => setAktifTab('kıyafet')}
        >
          <Text style={[styles.tabText, aktifTab === 'kıyafet' && styles.activeTabText]}>
            Kıyafetler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, aktifTab === 'diğer' && styles.activeTab]}
          onPress={() => setAktifTab('diğer')}
        >
          <Text style={[styles.tabText, aktifTab === 'diğer' && styles.activeTabText]}>
            Diğer Ürünler
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFiltrelenmisSiparisler()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.siparisCard}>
            <Image source={{ uri: item.resimUrl }} style={styles.siparisImage} />
            <View style={styles.siparisInfo}>
              <Text style={styles.siparisIsim}>{item.isim}</Text>
              <Text style={styles.siparisKategori}>{item.altKategori}</Text>
              <Text style={styles.siparisFiyat}>{item.fiyat} TL</Text>
              {item.kategori === 'Kıyafet' ? (
                <TouchableOpacity
                  style={styles.ekleButton}
                  onPress={() => gardiropaEkle(item)}
                >
                  <Text style={styles.ekleButtonText}>Gardıroba Ekle</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.eklenemezText}>Gardıroba eklenemez</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.siparisList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF6F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B388A8',
  },
  activeTabText: {
    color: '#FFF',
  },
  siparisList: {
    padding: 20,
  },
  siparisCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  siparisImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  siparisInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  siparisIsim: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  siparisKategori: {
    fontSize: 14,
    color: '#B388A8',
    marginBottom: 4,
  },
  siparisFiyat: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 8,
  },
  ekleButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ekleButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  eklenemezText: {
    color: '#B388A8',
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 