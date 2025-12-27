import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { app } from '../firebaseConfig';

const OZELLIKLER = [
  {
    id: 1,
    title: 'Kıyafet Önerisi',
    desc: 'Mevsim, olay ve tarzına göre kombin önerileri al',
    icon: 'shirt-outline',
    color: '#FFB6C1',
    route: '/kiyafet-onerisi',
  },
  {
    id: 2,
    title: 'Stil Analizi',
    desc: 'Kişisel stilini keşfet ve geliştir',
    icon: 'analytics-outline',
    color: '#E6E6FA',
    route: '/stil-analiz',
  },
  {
    id: 3,
    title: 'Gardırop Yönetimi',
    desc: 'Kıyafetlerini kategorilere göre düzenle ve AI ile analiz et',
    icon: 'shirt-outline',
    color: '#FFE4E1',
    route: '/gardirop-yonetimi',
  },
  {
    id: 4,
    title: 'Favorilerim',
    desc: 'Beğendiğin kombinleri kaydet ve paylaş',
    icon: 'heart-outline',
    color: '#F0E6FF',
    route: '/favoriler',
  },
];

const db = getFirestore(app);

export default function HomeScreen() {
  const [kiyafetler, setKiyafetler] = useState<any[]>([]);
  const [, setTrendKombinler] = useState<any[]>([]);
  const [seciliKombin] = useState<any | null>(null);
  const [kombinModal, setKombinModal] = useState(false);
  const [kombinSecModal, setKombinSecModal] = useState(false);
  const [seciliKombinManuel, setSeciliKombinManuel] = useState<any | null>(null);
  const [secimler, setSecimler] = useState<{ ust: any; alt: any; dis: any; ayakkabi: any; aksesuar: any }>({ ust: null, alt: null, dis: null, ayakkabi: null, aksesuar: null });
  const [kutuKombinleri, setKutuKombinleri] = useState<({ ust: any; alt: any; dis: any; ayakkabi: any; aksesuar: any } | null)[]>([
    null, // 1. kutu
    null, // 2. kutu
    null  // 3. kutu
  ]);
  const [acikKutu, setAcikKutu] = useState<number | null>(null);

  useEffect(() => {
    const kiyafetleriGetir = async () => {
      try {
        const q = query(collection(db, 'kiyafetler'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setKiyafetler(data);
      } catch {
        // Hata yönetimi
      }
    };
    kiyafetleriGetir();
  }, []);

  useEffect(() => {
    if (kiyafetler.length > 0) {
      const yazKiyafetleri = kiyafetler.filter(k => k.mevsim === 'Yaz');
      const ustGiyim = yazKiyafetleri.filter(k => k.kategori === 'Üst Giyim');
      const altGiyim = yazKiyafetleri.filter(k => k.kategori === 'Alt Giyim');
      const disGiyim = yazKiyafetleri.filter(k => k.kategori === 'Dış Giyim');
      const ayakkabi = yazKiyafetleri.filter(k => k.kategori === 'Ayakkabı');
      const aksesuar = yazKiyafetleri.filter(k => k.kategori === 'Aksesuar');
      const yeniKombinler: any[] = [];
      for (let i = 0; i < 3; i++) {
        if (ustGiyim.length === 0 || altGiyim.length === 0 || ayakkabi.length === 0) break;
        const kombin = {
          ust: ustGiyim[Math.floor(Math.random() * ustGiyim.length)],
          alt: altGiyim[Math.floor(Math.random() * altGiyim.length)],
          dis: disGiyim.length > 0 ? disGiyim[Math.floor(Math.random() * disGiyim.length)] : null,
          ayakkabi: ayakkabi[Math.floor(Math.random() * ayakkabi.length)],
          aksesuar: aksesuar.length > 0 ? aksesuar[Math.floor(Math.random() * aksesuar.length)] : null,
        };
        yeniKombinler.push(kombin);
      }
      setTrendKombinler(yeniKombinler);
    }
  }, [kiyafetler]);

  // Kıyafetleri kategoriye göre filtrele (mevsimsiz)
  const ustGiyim = kiyafetler.filter(k => k.kategori === 'Üst Giyim');
  const altGiyim = kiyafetler.filter(k => k.kategori === 'Alt Giyim');
  const disGiyim = kiyafetler.filter(k => k.kategori === 'Dış Giyim');
  const ayakkabi = kiyafetler.filter(k => k.kategori === 'Ayakkabı');
  const aksesuar = kiyafetler.filter(k => k.kategori === 'Aksesuar');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Moda AI</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Hoş Geldin! 👋</Text>
            <Text style={styles.welcomeDesc}>Bugün nasıl bir kombin düşünüyorsun?</Text>
          </View>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2763/2763444.png' }}
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.featuresGrid}>
          {OZELLIKLER.map((ozellik) => (
            <TouchableOpacity
              key={ozellik.id}
              style={[styles.featureCard, { backgroundColor: ozellik.color }]}
              onPress={() => router.push(ozellik.route)}
            >
              <Ionicons name={ozellik.icon as any} size={32} color="#8A2BE2" />
              <Text style={styles.featureTitle}>{ozellik.title}</Text>
              <Text style={styles.featureDesc}>{ozellik.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trend Kombinler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {[0, 1, 2].map((idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.trendingCard}
                onPress={() => {
                  setAcikKutu(idx);
                  setKombinSecModal(true);
                  // Modal açıldığında önceki seçimler gelsin
                  setSecimler(kutuKombinleri[idx] || { ust: null, alt: null, dis: null, ayakkabi: null, aksesuar: null });
                  setSeciliKombinManuel(null);
                }}
              >
                {kutuKombinleri[idx] ? (
                  <>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                      {[kutuKombinleri[idx].ust, kutuKombinleri[idx].alt, kutuKombinleri[idx].dis, kutuKombinleri[idx].ayakkabi, kutuKombinleri[idx].aksesuar].filter(Boolean).map((parca, i) => (
                        <Image key={i} source={{ uri: parca.resimUrl }} style={{ width: 48, height: 48, borderRadius: 10, marginHorizontal: 2, borderWidth: 1, borderColor: '#E6E6FA' }} />
                      ))}
                    </View>
                    <View style={styles.trendingInfo}>
                      <Text style={styles.trendingTitle}>Kombin Kutusu #{idx + 1}</Text>
                      {[kutuKombinleri[idx].ust, kutuKombinleri[idx].alt, kutuKombinleri[idx].dis, kutuKombinleri[idx].ayakkabi, kutuKombinleri[idx].aksesuar].filter(Boolean).map((parca, i) => (
                        <Text key={i} style={{ fontSize: 13, color: '#8A2BE2', marginBottom: 1 }}>{parca.isim}</Text>
                      ))}
                    </View>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3534/3534066.png' }}
                      style={styles.trendingImage}
                    />
                    <View style={styles.trendingInfo}>
                      <Text style={styles.trendingTitle}>Kombin Kutusu #{idx + 1}</Text>
                      <Text style={styles.trendingDesc}>Kendi kombinini ekle</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Kullanıcı manuel kombin seçme modali */}
      <Modal
        visible={kombinSecModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setKombinSecModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '90%', maxHeight: '85%' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onPress={() => setKombinSecModal(false)}
            >
              <Text style={{ fontSize: 24, color: '#8A2BE2', fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#8A2BE2', marginBottom: 12, textAlign: 'center' }}>Kendi Kombinini Oluştur</Text>
            <ScrollView>
              {/* Üst Giyim */}
              <Text style={{ fontWeight: 'bold', color: '#B388A8', marginTop: 8 }}>Üst Giyim</Text>
              {ustGiyim.length === 0 ? (
                <Text style={{ color: '#FF6B6B', marginBottom: 8 }}>Gardırobunda yazlık üst giyim yok.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {ustGiyim.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ borderWidth: secimler.ust?.id === item.id ? 2 : 1, borderColor: secimler.ust?.id === item.id ? '#8A2BE2' : '#E6E6FA', borderRadius: 10, marginRight: 8, padding: 4 }}
                      onPress={() => setSecimler({ ...secimler, ust: item })}
                    >
                      <Image source={{ uri: item.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                      <Text style={{ fontSize: 12, color: '#8A2BE2', textAlign: 'center' }}>{item.isim}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Alt Giyim */}
              <Text style={{ fontWeight: 'bold', color: '#B388A8', marginTop: 8 }}>Alt Giyim</Text>
              {altGiyim.length === 0 ? (
                <Text style={{ color: '#FF6B6B', marginBottom: 8 }}>Gardırobunda yazlık alt giyim yok.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {altGiyim.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ borderWidth: secimler.alt?.id === item.id ? 2 : 1, borderColor: secimler.alt?.id === item.id ? '#8A2BE2' : '#E6E6FA', borderRadius: 10, marginRight: 8, padding: 4 }}
                      onPress={() => setSecimler({ ...secimler, alt: item })}
                    >
                      <Image source={{ uri: item.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                      <Text style={{ fontSize: 12, color: '#8A2BE2', textAlign: 'center' }}>{item.isim}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Ayakkabı */}
              <Text style={{ fontWeight: 'bold', color: '#B388A8', marginTop: 8 }}>Ayakkabı</Text>
              {ayakkabi.length === 0 ? (
                <Text style={{ color: '#FF6B6B', marginBottom: 8 }}>Gardırobunda yazlık ayakkabı yok.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {ayakkabi.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ borderWidth: secimler.ayakkabi?.id === item.id ? 2 : 1, borderColor: secimler.ayakkabi?.id === item.id ? '#8A2BE2' : '#E6E6FA', borderRadius: 10, marginRight: 8, padding: 4 }}
                      onPress={() => setSecimler({ ...secimler, ayakkabi: item })}
                    >
                      <Image source={{ uri: item.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                      <Text style={{ fontSize: 12, color: '#8A2BE2', textAlign: 'center' }}>{item.isim}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Dış Giyim */}
              {disGiyim.length > 0 && <Text style={{ fontWeight: 'bold', color: '#B388A8', marginTop: 8 }}>Dış Giyim</Text>}
              {disGiyim.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {disGiyim.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ borderWidth: secimler.dis?.id === item.id ? 2 : 1, borderColor: secimler.dis?.id === item.id ? '#8A2BE2' : '#E6E6FA', borderRadius: 10, marginRight: 8, padding: 4 }}
                      onPress={() => setSecimler({ ...secimler, dis: item })}
                    >
                      <Image source={{ uri: item.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                      <Text style={{ fontSize: 12, color: '#8A2BE2', textAlign: 'center' }}>{item.isim}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {/* Aksesuar */}
              {aksesuar.length > 0 && <Text style={{ fontWeight: 'bold', color: '#B388A8', marginTop: 8 }}>Aksesuar</Text>}
              {aksesuar.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {aksesuar.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={{ borderWidth: secimler.aksesuar?.id === item.id ? 2 : 1, borderColor: secimler.aksesuar?.id === item.id ? '#8A2BE2' : '#E6E6FA', borderRadius: 10, marginRight: 8, padding: 4 }}
                      onPress={() => setSecimler({ ...secimler, aksesuar: item })}
                    >
                      <Image source={{ uri: item.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                      <Text style={{ fontSize: 12, color: '#8A2BE2', textAlign: 'center' }}>{item.isim}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={{ backgroundColor: '#8A2BE2', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}
                onPress={() => {
                  if (!secimler.ust || !secimler.alt || !secimler.ayakkabi) {
                    Alert.alert('Uyarı', 'Üst, alt ve ayakkabı seçmelisiniz!');
                    return;
                  }
                  // Seçilen kombin kutuya kaydedilsin
                  if (acikKutu !== null) {
                    const yeniKombinler = [...kutuKombinleri];
                    yeniKombinler[acikKutu] = secimler;
                    setKutuKombinleri(yeniKombinler);
                  }
                  setSeciliKombinManuel(secimler);
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Kombin Oluştur</Text>
              </TouchableOpacity>
            </ScrollView>
            {/* Seçilen kombin gösterimi */}
            {seciliKombinManuel && (
              <View style={{ marginTop: 18, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#8A2BE2', marginBottom: 8 }}>Seçilen Kombin</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                  {[seciliKombinManuel.ust, seciliKombinManuel.alt, seciliKombinManuel.dis, seciliKombinManuel.ayakkabi, seciliKombinManuel.aksesuar].filter(Boolean).map((parca, i) => (
                    <Image key={i} source={{ uri: parca.resimUrl }} style={{ width: 50, height: 50, borderRadius: 8, marginHorizontal: 3, borderWidth: 1, borderColor: '#E6E6FA' }} />
                  ))}
                </View>
                <View style={{ alignItems: 'center' }}>
                  {[seciliKombinManuel.ust, seciliKombinManuel.alt, seciliKombinManuel.dis, seciliKombinManuel.ayakkabi, seciliKombinManuel.aksesuar].filter(Boolean).map((parca, i) => (
                    <Text key={i} style={{ fontSize: 13, color: '#8A2BE2', marginBottom: 1 }}>{parca.isim}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Kombin Detay Modalı */}
      <Modal
        visible={kombinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setKombinModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '90%', maxHeight: '80%' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onPress={() => setKombinModal(false)}
            >
              <Text style={{ fontSize: 24, color: '#8A2BE2', fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#8A2BE2', marginBottom: 12, textAlign: 'center' }}>Kombin Detayı</Text>
            {seciliKombin && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                  {[seciliKombin.ust, seciliKombin.alt, seciliKombin.dis, seciliKombin.ayakkabi, seciliKombin.aksesuar].filter(Boolean).map((parca, i) => (
                    <Image key={i} source={{ uri: parca.resimUrl }} style={{ width: 70, height: 70, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#E6E6FA' }} />
                  ))}
                </View>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  {[seciliKombin.ust, seciliKombin.alt, seciliKombin.dis, seciliKombin.ayakkabi, seciliKombin.aksesuar].filter(Boolean).map((parca, i) => (
                    <Text key={i} style={{ fontSize: 15, color: '#8A2BE2', marginBottom: 2 }}>{parca.isim}</Text>
                  ))}
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#8A2BE2', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                  onPress={async () => {
                    try {
                      await addDoc(collection(db, 'favoriKombinler'), {
                        ustGiyim: seciliKombin.ust,
                        altGiyim: seciliKombin.alt,
                        disGiyim: seciliKombin.dis,
                        ayakkabi: seciliKombin.ayakkabi,
                        aksesuar: seciliKombin.aksesuar,
                        mevsim: 'Yaz',
                        created_at: new Date(),
                      });
                      Alert.alert('Başarılı', 'Kombin favorilere eklendi!');
                      setKombinModal(false);
                    } catch {
                      Alert.alert('Hata', 'Kombin favorilere eklenirken bir hata oluştu.');
                    }
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Favorilere Ekle</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: '#F0E6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.1)',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 6,
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#B388A8',
  },
  welcomeImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.1)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#B388A8',
    lineHeight: 16,
  },
  trendingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 16,
  },
  trendingScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trendingCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginRight: 16,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.1)',
  },
  trendingImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  trendingInfo: {
    padding: 16,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 4,
  },
  trendingDesc: {
    fontSize: 14,
    color: '#B388A8',
  },
});
