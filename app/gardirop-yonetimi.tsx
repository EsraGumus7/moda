import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../firebaseConfig';
import { gardiropAnaliziYapGemini, stilAnaliziYap } from '../services/gemini';
import { getEksikParcaOnerileri } from '../services/trendyolMockData';
import { useFavori } from './FavoriContext';

const MEVSIMLER = ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];
const KATEGORILER = ['Üst Giyim', 'Alt Giyim', 'Ayakkabı', 'Aksesuar', 'Çanta', 'Mont/Ceket'];

const db = getFirestore(app);

// Cloudinary ayarları
const cloudName = "dumof4rzj"; // Cloudinary dashboard'daki cloud name
const uploadPreset = "modaaii_unsigned"; // Yeni oluşturduğun unsigned preset adı

const resimYukleCloudinary = async (imageUri: string) => {
  try {
    console.log("Resim yükleme başladı:", imageUri);
    
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg"
    } as any);
    data.append("upload_preset", uploadPreset);

    console.log("Cloudinary isteği gönderiliyor...");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Cloudinary yanıtı alındı");
    const result = await response.json();
    
    if (!response.ok) {
      console.error("Cloudinary hata yanıtı:", result);
      throw new Error(result.error?.message || "Cloudinary yükleme hatası");
    }

    if (!result.secure_url) {
      console.error("Cloudinary URL hatası:", result);
      throw new Error("Resim URL'si alınamadı");
    }

    console.log("Resim başarıyla yüklendi:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary yükleme hatası:", error);
    Alert.alert(
      "Hata",
      "Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
    );
    throw error;
  }
};

// Gardırop analizi sonucunu şık göstermek için format fonksiyonu
const formatGardiropAnalizi = (analiz: string) => {
  const lines = analiz.split(/\n+/);
  return lines.map((line, idx) => {
    // Satır başındaki yıldızları ve boşlukları temizle
    let cleanLine = line.replace(/^\s*\*+\s*/, '');
    // ** ile başlayan başlıkları bold ve büyük puntolu yap
    const baslikMatch = cleanLine.match(/^\*\*(.*?)\*\*:?/);
    if (baslikMatch) {
      return (
        <Text key={idx} style={{ fontWeight: 'bold', fontSize: 18, color: '#8A2BE2', marginTop: 14, marginBottom: 6 }}>
          {baslikMatch[1]}
        </Text>
      );
    }
    // Madde başı ise (ör: 1. **Başlık:** ile başlayan)
    const maddeMatch = cleanLine.match(/^(\d+\.|-)\s*\*\*(.+?):\*\*\s*(.*)/);
    if (maddeMatch) {
      return (
        <Text key={idx} style={{ fontSize: 16, color: '#333', marginBottom: 4, lineHeight: 24 }}>
          <Text style={{ fontWeight: 'bold', color: '#B388A8' }}>{maddeMatch[1]} {maddeMatch[2]}: </Text>
          {maddeMatch[3]}
        </Text>
      );
    }
    // Sadece madde başı (ör: **Başlık:** ile başlayan)
    const maddeMatch2 = cleanLine.match(/^\*\*(.+?):\*\*\s*(.*)/);
    if (maddeMatch2) {
      return (
        <Text key={idx} style={{ fontSize: 16, color: '#333', marginBottom: 4, lineHeight: 24 }}>
          <Text style={{ fontWeight: 'bold', color: '#B388A8' }}>{maddeMatch2[1]}: </Text>
          {maddeMatch2[2]}
        </Text>
      );
    }
    return (
      <Text key={idx} style={{ fontSize: 15, color: '#444', marginBottom: 2, lineHeight: 22 }}>{cleanLine}</Text>
    );
  });
};

const formatKombinAnalizi = (analiz: string) => {
  const lines = analiz.split(/\n+/);
  return lines.map((line, idx) => {
    // Satır başındaki tüm yıldızları, sayıları, noktaları ve boşlukları temizle
    let cleanLine = line.replace(/^\s*([\*\d\.-]+)\s*/, '').replace(/\*{2,}/g, '').trim();
    // Tamamen büyük harfli başlıkları bold ve mor yap
    if (cleanLine.length > 0 && cleanLine === cleanLine.toUpperCase() && cleanLine.length < 50) {
      return (
        <Text key={idx} style={{ fontWeight: 'bold', fontSize: 18, color: '#8A2BE2', marginTop: 14, marginBottom: 6 }}>{cleanLine}</Text>
      );
    }
    // Madde başı ise (ör: Başlık: ile başlayan)
    const maddeMatch = cleanLine.match(/^([^:]+):\s*(.*)/);
    if (maddeMatch && maddeMatch[1].length < 40) {
      return (
        <Text key={idx} style={{ fontSize: 16, color: '#333', marginBottom: 4, lineHeight: 24 }}>
          <Text style={{ fontWeight: 'bold', color: '#B388A8' }}>{maddeMatch[1].trim()}: </Text>
          {maddeMatch[2]}
        </Text>
      );
    }
    // Normal metin
    return (
      <Text key={idx} style={{ fontSize: 15, color: '#444', marginBottom: 2, lineHeight: 22 }}>{cleanLine}</Text>
    );
  });
};

export default function GardiropYonetimi() {
  const { favoriEkle, favoriCikar } = useFavori();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [kiyafetler, setKiyafetler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [yeniKiyafet, setYeniKiyafet] = useState({
    id: '',
    isim: '',
    kategori: '',
    mevsim: '',
    resimUrl: '',
  });
  const [gardiropAnalizi, setGardiropAnalizi] = useState<string>('');
  const [pinterestOnerileri, setPinterestOnerileri] = useState<string[]>([]);
  const [favoriKiyafetler, setFavoriKiyafetler] = useState<string[]>([]);
  const [kombinAnalizModal, setKombinAnalizModal] = useState(false);
  const [kombinAnalizMetni, setKombinAnalizMetni] = useState('');
  const [kombinResimleri, setKombinResimleri] = useState<string[]>([]);
  const [eksikParcaOnerileri, setEksikParcaOnerileri] = useState<any[]>([]);
  const [gardiropEksikParcalar, setGardiropEksikParcalar] = useState<any[]>([]);

  // Kıyafetleri Firestore'dan çek
  const kiyafetleriGetir = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'kiyafetler'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setKiyafetler(data);
    } catch {
      Alert.alert('Hata', 'Kıyafetler alınırken bir hata oluştu.');
    }
    setLoading(false);
  };

  // Favori kıyafetleri Firestore'dan çek
  const favoriKiyafetleriGetir = async () => {
    try {
      const q = query(collection(db, 'favoriKiyafetler'));
      const querySnapshot = await getDocs(q);
      const favoriler = querySnapshot.docs.map(doc => doc.id);
      setFavoriKiyafetler(favoriler);
    } catch (error) {
      console.error('Favori kıyafetler alınırken hata:', error);
    }
  };

  // Gardırop eksik parçalarını yükle
  const gardiropEksikParcalariniYukle = async () => {
    try {
      const eksikParcalar = getEksikParcaOnerileri('', 'Genel');
      setGardiropEksikParcalar(eksikParcalar.slice(0, 6)); // 6 adet eksik parça önerisi
    } catch (error) {
      console.error('Gardırop eksik parçaları yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    kiyafetleriGetir();
    favoriKiyafetleriGetir();
    gardiropEksikParcalariniYukle();
  }, []);

  const resimSec = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setYeniKiyafet({ ...yeniKiyafet, resimUrl: result.assets[0].uri });
    }
  };

  const kiyafetEkle = async () => {
    if (!yeniKiyafet.isim || !yeniKiyafet.kategori || !yeniKiyafet.mevsim || !yeniKiyafet.resimUrl) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      // 1. Fotoğrafı Cloudinary'ye yükle
      const imageUrl = await resimYukleCloudinary(yeniKiyafet.resimUrl);
      // 2. Firestore'a kaydet
      await addDoc(collection(db, 'kiyafetler'), {
        isim: yeniKiyafet.isim,
        kategori: yeniKiyafet.kategori,
        mevsim: yeniKiyafet.mevsim,
        resimUrl: imageUrl,
        created_at: new Date(),
      });
      setModalVisible(false);
      setYeniKiyafet({ id: '', isim: '', kategori: '', mevsim: '', resimUrl: '' });
      kiyafetleriGetir();
    } catch (error) {
      console.log("Cloudinary/Firebase Hatası:", error);
      Alert.alert('Hata', 'Kıyafet eklenirken bir hata oluştu.');
    }
    setLoading(false);
  };

  const kiyafetSil = async (id: string) => {
    Alert.alert(
      'Kıyafeti Sil',
      'Bu kıyafeti silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'kiyafetler', id));
              kiyafetleriGetir();
              Alert.alert('Başarılı', 'Kıyafet başarıyla silindi. İsterseniz profil sekmesinden tekrar ekleyebilirsiniz.');
            } catch {
              Alert.alert('Hata', 'Kıyafet silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const kiyafetDuzenle = (kiyafet: any) => {
    setYeniKiyafet(kiyafet);
    setDuzenlemeModu(true);
    setModalVisible(true);
  };

  const kiyafetGuncelle = async () => {
    if (!yeniKiyafet.isim || !yeniKiyafet.kategori || !yeniKiyafet.mevsim) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const kiyafetRef = doc(db, 'kiyafetler', yeniKiyafet.id);
      const guncelVeri: { isim: string; kategori: string; mevsim: string; resimUrl?: string } = {
        isim: yeniKiyafet.isim,
        kategori: yeniKiyafet.kategori,
        mevsim: yeniKiyafet.mevsim,
      };

      // Eğer yeni resim seçildiyse Cloudinary'ye yükle
      if (yeniKiyafet.resimUrl && !yeniKiyafet.resimUrl.startsWith('http')) {
        const imageUrl = await resimYukleCloudinary(yeniKiyafet.resimUrl);
        guncelVeri.resimUrl = imageUrl;
      }

      await updateDoc(kiyafetRef, guncelVeri);
      setModalVisible(false);
      setDuzenlemeModu(false);
      setYeniKiyafet({ id: '', isim: '', kategori: '', mevsim: '', resimUrl: '' });
      kiyafetleriGetir();
      Alert.alert('Başarılı', 'Kıyafet başarıyla güncellendi.');
    } catch {
      Alert.alert('Hata', 'Kıyafet güncellenirken bir hata oluştu.');
    }
    setLoading(false);
  };


  const gardiropAnaliziYap = async () => {
    setLoading(true);
    try {
      if (kiyafetler.length === 0) {
        Alert.alert(
          'Uyarı',
          'Gardırop analizi için en az bir kıyafet eklemelisiniz.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      console.log('Gardırop analizi başlatılıyor...');
      const mevsimFiltresi = selectedSeasons.length > 0 ? selectedSeasons : ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];
      const filtrelenmisKiyafetler = kiyafetler.filter(k => 
        mevsimFiltresi.includes(k.mevsim) || k.mevsim === 'Genel'
      );
      const analizSonucu = await gardiropAnaliziYapGemini(filtrelenmisKiyafetler);
      console.log('Gardırop analizi tamamlandı');
      
      setGardiropAnalizi(analizSonucu);
      
      // Pinterest önerilerini çıkar
      const pinterestOnerileriMatch = analizSonucu.match(/Pinterest'te benzer stiller için arama önerileri:([\s\S]*?)(?=\d\.|$)/);
      if (pinterestOnerileriMatch) {
        const oneriler = pinterestOnerileriMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-•*]\s*/, '').trim());
        setPinterestOnerileri(oneriler);
      }
    } catch (error: any) {
      console.error('Gardırop Analizi Hatası:', error);
      Alert.alert(
        'Hata',
        error.message || 'Gardırop analizi yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const kombinOner = async () => {
    if (kiyafetler.length < 2) {
      Alert.alert(
        'Uyarı',
        'Kombin önerisi için en az 2 kıyafet gerekli. Lütfen gardırobunuza daha fazla kıyafet ekleyin.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    setLoading(true);
    try {
      console.log('Kombin önerisi başlatılıyor...');
      
      const ustGiyim = kiyafetler.filter(k => k.kategori === 'Üst Giyim');
      const altGiyim = kiyafetler.filter(k => k.kategori === 'Alt Giyim');
      const ayakkabi = kiyafetler.filter(k => k.kategori === 'Ayakkabı');
      const aksesuar = kiyafetler.filter(k => k.kategori === 'Aksesuar');
      const canta = kiyafetler.filter(k => k.kategori === 'Çanta');
      const montCeket = kiyafetler.filter(k => k.kategori === 'Mont/Ceket');

      if (ustGiyim.length === 0 || altGiyim.length === 0) {
        Alert.alert(
          'Uyarı',
          'Kombin önerisi için en az bir üst giyim ve bir alt giyim parçası gerekli.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      const seciliUst = ustGiyim[Math.floor(Math.random() * ustGiyim.length)];
      const seciliAlt = altGiyim[Math.floor(Math.random() * altGiyim.length)];
      const seciliMontCeket = montCeket.length > 0 ? montCeket[Math.floor(Math.random() * montCeket.length)] : null;
      const seciliAyakkabi = ayakkabi.length > 0 ? ayakkabi[Math.floor(Math.random() * ayakkabi.length)] : null;
      const seciliAksesuar = aksesuar.length > 0 ? aksesuar[Math.floor(Math.random() * aksesuar.length)] : null;
      const seciliCanta = canta.length > 0 ? canta[Math.floor(Math.random() * canta.length)] : null;
      const mevsim = selectedSeasons.length > 0 ? selectedSeasons[0] : 'Genel';

      // Kombin bilgisini birleştir
      const kombinBilgisi = [
        `Üst Giyim: ${seciliUst.isim}`,
        `Alt Giyim: ${seciliAlt.isim}`,
        seciliMontCeket ? `Mont/Ceket: ${seciliMontCeket.isim}` : null,
        seciliAyakkabi ? `Ayakkabı: ${seciliAyakkabi.isim}` : null,
        seciliAksesuar ? `Aksesuar: ${seciliAksesuar.isim}` : null,
        seciliCanta ? `Çanta: ${seciliCanta.isim}` : null,
        `Mevsim: ${mevsim}`
      ].filter(Boolean).join(', ');

      console.log('Kombin bilgisi hazırlandı:', kombinBilgisi);

      // Gemini API'ye gönderilecek prompt
      const promptObj = {
        mevsim: mevsim,
        olay: 'Günlük',
        renkler: [],
        stil: 'Günlük',
        havaDurumu: 'Güneşli',
        kombinDetay: kombinBilgisi
      };

      console.log('Stil analizi başlatılıyor...');
      // Gemini API ile stil analizi yap
      const stilAnalizi = await stilAnaliziYap(promptObj);
      console.log('Stil analizi tamamlandı');

      // Kombin resimlerini ayarla
      const resimler: string[] = [
        seciliUst?.resimUrl,
        seciliAlt?.resimUrl,
        seciliMontCeket?.resimUrl,
        seciliAyakkabi?.resimUrl,
        seciliAksesuar?.resimUrl,
        seciliCanta?.resimUrl
      ].filter(Boolean);
      setKombinResimleri(resimler);
      setKombinAnalizMetni(`${kombinBilgisi}\n\n${stilAnalizi}`);

      // Eksik parça önerilerini al
      console.log('Eksik parça önerileri alınıyor...');
      const eksikParcalar = getEksikParcaOnerileri(kombinBilgisi, mevsim);
      setEksikParcaOnerileri(eksikParcalar);
      console.log('Eksik parça önerileri hazırlandı:', eksikParcalar.length, 'ürün');

      setKombinAnalizModal(true);
    } catch (error: any) {
      console.error('Kombin Önerisi Hatası:', error);
      Alert.alert(
        'Hata',
        error.message || 'Kombin önerisi oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const favoriEkleCikar = async (kiyafet: any) => {
    try {
      if (favoriKiyafetler.includes(kiyafet.id)) {
        // Favorilerden çıkar
        await deleteDoc(doc(db, 'favoriKiyafetler', kiyafet.id));
        setFavoriKiyafetler(favoriKiyafetler.filter(id => id !== kiyafet.id));
        favoriCikar({
          tip: 'kiyafet',
          icerik: kiyafet.isim,
          kiyafetDetay: kiyafet
        });
      } else {
        // Favorilere ekle
        await addDoc(collection(db, 'favoriKiyafetler'), {
          kiyafetId: kiyafet.id,
          createdAt: new Date()
        });
        setFavoriKiyafetler([...favoriKiyafetler, kiyafet.id]);
        favoriEkle({
          tip: 'kiyafet',
          icerik: kiyafet.isim,
          kiyafetDetay: kiyafet
        });
      }
    } catch {
      Alert.alert('Hata', 'Favori işlemi sırasında bir hata oluştu.');
    }
  };

  // FlatList renderItem fonksiyonunu güncelle
  const renderKiyafetItem = ({ item }: { item: any }) => {
    if (item.isEksikParca) {
      return (
        <TouchableOpacity 
          style={styles.eksikParcaCardGardirop}
          onPress={() => Linking.openURL(item.trendyolLinki || 'https://www.trendyol.com')}
        >
          <Image source={{ uri: item.resimUrl }} style={styles.eksikParcaImageGardirop} />
          <Text style={styles.eksikParcaNameGardirop} numberOfLines={2}>{item.isim}</Text>
          <Text style={styles.eksikParcaMarkaGardirop}>{item.marka}</Text>
          <Text style={styles.eksikParcaFiyatGardirop}>{item.fiyat} TL</Text>
          <View style={styles.trendyolBadgeGardirop}>
            <Text style={styles.trendyolBadgeTextGardirop}>Trendyol</Text>
          </View>
          <View style={styles.eksikParcaOverlay}>
            <Ionicons name="add-circle" size={20} color="#8A2BE2" />
            <Text style={styles.eksikParcaOverlayText}>Eksik</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.kiyafetCard}>
        <Image source={{ uri: item.resimUrl }} style={styles.kiyafetImage} />
        <Text style={styles.kiyafetName}>{item.isim}</Text>
        <Text style={styles.kiyafetInfo}>{item.mevsim}</Text>
        <View style={styles.kiyafetActions}>
          <TouchableOpacity 
            onPress={() => favoriEkleCikar(item)} 
            style={styles.actionButton}
          >
            <Ionicons 
              name={favoriKiyafetler.includes(item.id) ? "heart" : "heart-outline"} 
              size={16} 
              color={favoriKiyafetler.includes(item.id) ? "#FF6B6B" : "#8A2BE2"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => kiyafetDuzenle(item)} style={styles.actionButton}>
            <Ionicons name="create-outline" size={16} color="#8A2BE2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => kiyafetSil(item.id)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Kategori seçim fonksiyonunu ekliyorum
  const toggleCategory = (kategori: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(kategori)) {
        return prev.filter(k => k !== kategori);
      } else {
        return [...prev, kategori];
      }
    });
  };

  // Mevsim seçim fonksiyonunu ekliyorum
  const toggleSeason = (mevsim: string) => {
    setSelectedSeasons(prev => {
      if (prev.includes(mevsim)) {
        return prev.filter(m => m !== mevsim);
      } else {
        return [...prev, mevsim];
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Gardırobum</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {KATEGORILER.map((kategori) => (
            <TouchableOpacity
              key={kategori}
              style={[
                styles.categoryButton,
                selectedCategories.includes(kategori) && styles.categoryButtonActive
              ]}
              onPress={() => toggleCategory(kategori)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategories.includes(kategori) && styles.categoryTextActive
              ]}>
                {kategori}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Mevsimler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seasonScroll}>
          {MEVSIMLER.map((mevsim) => (
            <TouchableOpacity
              key={mevsim}
              style={[styles.seasonButton, selectedSeasons.includes(mevsim) && styles.seasonButtonActive]}
              onPress={() => toggleSeason(mevsim)}
            >
              <Text style={[styles.seasonText, selectedSeasons.includes(mevsim) && styles.seasonTextActive]}>
                {mevsim}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={[
          ...gardiropEksikParcalar.map((urun, index) => ({
            ...urun,
            id: `eksik-${index}`,
            isEksikParca: true
          })),
          ...kiyafetler.filter(k => 
            (selectedCategories.length === 0 || selectedCategories.includes(k.kategori)) &&
            (selectedSeasons.length === 0 || selectedSeasons.includes(k.mevsim) || k.mevsim === 'Genel')
          )
        ]}
        numColumns={4}
        renderItem={renderKiyafetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.kiyafetList}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.kombinButton} onPress={kombinOner}>
          <Text style={styles.kombinButtonText}>Rastgele Kombin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.kombinButton, { backgroundColor: '#8A2BE2' }]} onPress={gardiropAnaliziYap}>
          <Text style={styles.kombinButtonText}>Gardırop Analizi</Text>
        </TouchableOpacity>
      </View>

      {gardiropAnalizi ? (
        <ScrollView style={styles.analizContainer}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
            onPress={() => {
              setGardiropAnalizi('');
              setPinterestOnerileri([]);
            }}
          >
            <Text style={{ fontSize: 24, color: '#8A2BE2', fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.analizTitle}>Gardırop Analizi</Text>
          <View style={{marginBottom: 8}}>
            {formatGardiropAnalizi(gardiropAnalizi)}
          </View>
          
          {pinterestOnerileri.length > 0 && (
            <View style={styles.pinterestContainer}>
              <Text style={styles.pinterestTitle}>Pinterest Önerileri</Text>
              {pinterestOnerileri.map((oneriler, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pinterestButton}
                  onPress={() => {
                    const searchUrl = `https://pinterest.com/search/pins/?q=${encodeURIComponent(oneriler)}`;
                    Linking.openURL(searchUrl);
                  }}
                >
                  <Text style={styles.pinterestButtonText}>{oneriler}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setDuzenlemeModu(false);
          setYeniKiyafet({ id: '', isim: '', kategori: '', mevsim: '', resimUrl: '' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {duzenlemeModu ? 'Kıyafeti Düzenle' : 'Yeni Kıyafet Ekle'}
            </Text>
            
            <TouchableOpacity style={styles.imageButton} onPress={resimSec}>
              {yeniKiyafet.resimUrl ? (
                <Image source={{ uri: yeniKiyafet.resimUrl }} style={styles.selectedImage} />
              ) : (
                <Text style={styles.imageButtonText}>Fotoğraf Seç</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Kıyafet İsmi"
              value={yeniKiyafet.isim}
              onChangeText={(text) => setYeniKiyafet({ ...yeniKiyafet, isim: text })}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
              {KATEGORILER.map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  style={[styles.selectionButton, yeniKiyafet.kategori === kategori && styles.selectionButtonActive]}
                  onPress={() => setYeniKiyafet({ ...yeniKiyafet, kategori })}
                >
                  <Text style={[styles.selectionText, yeniKiyafet.kategori === kategori && styles.selectionTextActive]}>
                    {kategori}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectionScroll}>
              {MEVSIMLER.map((mevsim) => (
                <TouchableOpacity
                  key={mevsim}
                  style={[styles.selectionButton, yeniKiyafet.mevsim === mevsim && styles.selectionButtonActive]}
                  onPress={() => setYeniKiyafet({ ...yeniKiyafet, mevsim })}
                >
                  <Text style={[styles.selectionText, yeniKiyafet.mevsim === mevsim && styles.selectionTextActive]}>
                    {mevsim}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setModalVisible(false);
                  setDuzenlemeModu(false);
                  setYeniKiyafet({ id: '', isim: '', kategori: '', mevsim: '', resimUrl: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={duzenlemeModu ? kiyafetGuncelle : kiyafetEkle}
              >
                <Text style={styles.saveButtonText}>
                  {duzenlemeModu ? 'Güncelle' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={kombinAnalizModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setKombinAnalizModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '90%', maxHeight: '80%' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
              onPress={() => setKombinAnalizModal(false)}
            >
              <Text style={{ fontSize: 24, color: '#8A2BE2', fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            {/* Kombin görselleri */}
            {kombinResimleri.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
                {kombinResimleri.map((url, i) => (
                  <Image
                    key={i}
                    source={{ uri: url }}
                    style={{ width: 70, height: 70, borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#E6E6FA' }}
                  />
                ))}
              </ScrollView>
            )}
            <ScrollView>
              {formatKombinAnalizi(kombinAnalizMetni)}
              
              {/* Eksik Parça Önerileri */}
              {eksikParcaOnerileri.length > 0 && (
                <View style={styles.eksikParcaContainer}>
                  <Text style={styles.eksikParcaTitle}>Eksik Parça Önerileri</Text>
                  <Text style={styles.eksikParcaSubtitle}>Bu kombin için Trendyol&apos;dan öneriler:</Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eksikParcaScroll}>
                    {eksikParcaOnerileri.map((urun, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.eksikParcaCard}
                        onPress={() => Linking.openURL(urun.trendyolLinki || 'https://www.trendyol.com')}
                      >
                        <Image source={{ uri: urun.resimUrl }} style={styles.eksikParcaImage} />
                        <Text style={styles.eksikParcaName} numberOfLines={2}>{urun.isim}</Text>
                        <Text style={styles.eksikParcaMarka}>{urun.marka}</Text>
                        <Text style={styles.eksikParcaFiyat}>{urun.fiyat} TL</Text>
                        <View style={styles.trendyolBadge}>
                          <Text style={styles.trendyolBadgeText}>Trendyol</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: '#FFF6F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  filterSection: {
    backgroundColor: '#FFF6F9',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6FA',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 6,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  addButton: {
    padding: 8,
  },
  categoryScroll: {
    maxHeight: 50,
    paddingHorizontal: 0,
    marginBottom: 0,
    marginTop: -5,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E6FA',
    minWidth: 100,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#F0E6FF',
    borderColor: '#8A2BE2',
  },
  categoryText: {
    fontSize: 14,
    color: '#B388A8',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  categoryTextActive: {
    color: '#8A2BE2',
  },
  seasonScroll: {
    maxHeight: 50,
    paddingHorizontal: 0,
    marginTop: -5,
    marginBottom: 0,
  },
  seasonButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E6FA',
    minWidth: 100,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seasonButtonActive: {
    backgroundColor: '#F0E6FF',
    borderColor: '#8A2BE2',
    marginBottom: 25,
  },
  seasonText: {
    fontSize: 14,
    color: '#B388A8',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  seasonTextActive: {
    color: '#8A2BE2',
  },
  kiyafetList: {
    padding: 10,
  },
  kiyafetCard: {
    flex: 1,
    margin: 3,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    maxWidth: '23%',
  },
  kiyafetImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  kiyafetName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A2BE2',
    padding: 6,
    textAlign: 'center',
  },
  kiyafetInfo: {
    fontSize: 10,
    color: '#B388A8',
    paddingHorizontal: 6,
    paddingBottom: 6,
    textAlign: 'center',
  },
  kiyafetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: '#E6E6FA',
  },
  actionButton: {
    padding: 4,
    borderRadius: 15,
    backgroundColor: '#F0E6FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kombinButton: {
    backgroundColor: '#8A2BE2',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 0,
  },
  kombinButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0E6FF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F0E6FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  selectionScroll: {
    marginBottom: 20,
  },
  selectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#F0E6FF',
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  selectionButtonActive: {
    backgroundColor: '#8A2BE2',
    borderColor: '#8A2BE2',
  },
  selectionText: {
    fontSize: 14,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  selectionTextActive: {
    color: '#FFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0E6FF',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
  analizContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 15,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 15,
  },
  analizText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  pinterestContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F0E6FF',
    borderRadius: 10,
  },
  pinterestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 10,
  },
  pinterestButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  pinterestButtonText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
  eksikParcaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F0E6FF',
    borderRadius: 10,
  },
  eksikParcaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 8,
  },
  eksikParcaSubtitle: {
    fontSize: 14,
    color: '#B388A8',
    marginBottom: 15,
  },
  eksikParcaScroll: {
    marginHorizontal: -5,
  },
  eksikParcaCard: {
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 5,
    padding: 8,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  eksikParcaImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  eksikParcaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 4,
    lineHeight: 16,
  },
  eksikParcaMarka: {
    fontSize: 10,
    color: '#B388A8',
    marginBottom: 4,
  },
  eksikParcaFiyat: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  trendyolBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  trendyolBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  eksikParcaCardGardirop: {
    flex: 1,
    margin: 3,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: '23%',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  eksikParcaImageGardirop: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  eksikParcaNameGardirop: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B6B',
    padding: 4,
    textAlign: 'center',
    lineHeight: 14,
  },
  eksikParcaMarkaGardirop: {
    fontSize: 9,
    color: '#B388A8',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  eksikParcaFiyatGardirop: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
    paddingHorizontal: 4,
    paddingBottom: 4,
    textAlign: 'center',
  },
  trendyolBadgeGardirop: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  trendyolBadgeTextGardirop: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: 'bold',
  },
  eksikParcaOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eksikParcaOverlayText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginLeft: 2,
  },
}); 