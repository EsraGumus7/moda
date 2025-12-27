import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Linking, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { stilAnaliziYap } from '../services/gemini';
import { useFavori } from './FavoriContext';

export default function KiyafetOnerisiScreen() {
  const [secilenMevsim, setSecilenMevsim] = useState('');
  const [secilenOlay, setSecilenOlay] = useState('');
  const [secilenRenkler, setSecilenRenkler] = useState<string[]>([]);
  const [stilTercihi, setStilTercihi] = useState('');
  const [havaDurumu, setHavaDurumu] = useState('');
  const [oneriSonucu, setOneriSonucu] = useState('');
  const [sonucModalVisible, setSonucModalVisible] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const { favoriler, favoriEkle, favoriCikar } = useFavori();

  const mevsimler = ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];
  const olaylar = ['İş', 'Parti', 'Günlük', 'Spor', 'Resmi Toplantı', 'Randevu'];
  const renkler = [
    { isim: 'Pudra', kod: '#F7CAC9' },
    { isim: 'Lavanta', kod: '#E6E6FA' },
    { isim: 'Mint', kod: '#AAF0D1' },
    { isim: 'Açık Mavi', kod: '#B3C7F7' },
    { isim: 'Bej', kod: '#F5F5DC' },
    { isim: 'Krem', kod: '#FFFDD0' },
    { isim: 'Lila', kod: '#C8A2C8' },
    { isim: 'Somon', kod: '#FFDAB9' },
    { isim: 'Açık Pembe', kod: '#FFB6C1' },
    { isim: 'Beyaz', kod: '#FFFFFF' },
    { isim: 'Kırmızı', kod: '#FF0000' },
    { isim: 'Turuncu', kod: '#FFA500' },
    { isim: 'Sarı', kod: '#FFFF00' },
    { isim: 'Yeşil', kod: '#008000' },
    { isim: 'Mavi', kod: '#0000FF' },
    { isim: 'Lacivert', kod: '#191970' },
    { isim: 'Mor', kod: '#800080' },
    { isim: 'Füme', kod: '#545454' },
  ];
  const stilTercihleri = ['Şık', 'Spor', 'Günlük', 'Casual', 'Vintage', 'Minimalist'];
  const havaDurumlari = ['Güneşli', 'Yağmurlu', 'Rüzgarlı', 'Bulutlu', 'Karlı'];

  const favorideMi = () => favoriler.some(f => f.tip === 'kombin' && f.icerik === oneriSonucu);

  const pinterestAramaLinki = () => {
    const query = [
      secilenMevsim,
      stilTercihi,
      secilenOlay,
      ...secilenRenkler,
      'kombin'
    ].filter(Boolean).join(' ');
    return `https://tr.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
  };

  const oneriAl = async () => {
    if (!secilenMevsim || !secilenOlay || !stilTercihi || !havaDurumu) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setYukleniyor(true);
    try {
      const params = {
        mevsim: secilenMevsim,
        olay: secilenOlay,
        renkler: secilenRenkler || [],
        stil: stilTercihi,
        havaDurumu: havaDurumu
      };
      
      console.log('Gönderilen parametreler:', params);

      const oneri = await stilAnaliziYap(params);
      
      if (!oneri) {
        throw new Error('Öneri alınamadı.');
      }

      setOneriSonucu(oneri);
      setSonucModalVisible(true);
    } catch (error: any) {
      console.error('Kombin Önerisi Hatası:', error);
      alert(error.message || 'Öneri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setYukleniyor(false);
    }
  };

  // Modal bileşeni
  const formatOneriSonucu = (oneriSonucu: string) => {
    // Başlıkları ve metni düzenle
    const lines = oneriSonucu.split(/\n+/);
    return lines.map((line, idx) => {
      // ** ile başlayan başlıkları bold ve büyük puntolu yap
      const baslikMatch = line.match(/^\*\*(.*?)\*\*:?/);
      if (baslikMatch) {
        return (
          <Text key={idx} style={{ fontWeight: 'bold', fontSize: 17, color: '#8A2BE2', marginTop: 12, marginBottom: 4 }}>
            {baslikMatch[1]}
          </Text>
        );
      }
      // Normal metin
      return (
        <Text key={idx} style={{ fontSize: 15, color: '#333', marginBottom: 2, lineHeight: 22 }}>{line}</Text>
      );
    });
  };

  const SonucModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sonucModalVisible}
      onRequestClose={() => setSonucModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
            onPress={() => setSonucModalVisible(false)}
          >
            <Text style={{ fontSize: 24, color: '#8A2BE2', fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Kıyafet Önerisi</Text>
          <ScrollView style={styles.sonucContent}>
            {formatOneriSonucu(oneriSonucu)}
          </ScrollView>
          <TouchableOpacity
            style={{alignItems:'center', marginBottom:8}}
            onPress={() => {
              const favoriObj = { tip: 'kombin' as const, icerik: oneriSonucu };
              favorideMi() ? favoriCikar(favoriObj) : favoriEkle(favoriObj);
            }}
          >
            <Text style={{fontSize:28}}>{favorideMi() ? '❤️' : '🤍'} Favorilere {favorideMi() ? 'Eklendi' : 'Ekle'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setSonucModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Kapat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#E60023', marginTop: 8 }]}
            onPress={() => Linking.openURL(pinterestAramaLinki())}
          >
            <Text style={styles.modalButtonText}>Pinterest&apos;te benzer kombinleri gör</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mevsim</Text>
          <View style={styles.stilGrid}>
            {mevsimler.map((mevsim) => (
              <TouchableOpacity
                key={mevsim}
                style={[
                  styles.stilItem,
                  secilenMevsim === mevsim && styles.stilItemSecili
                ]}
                onPress={() => setSecilenMevsim(mevsim)}
              >
                <Text style={[
                  styles.stilItemText,
                  secilenMevsim === mevsim && styles.stilItemTextSecili
                ]}>{mevsim}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Olay Türü</Text>
          <View style={styles.stilGrid}>
            {olaylar.map((olay) => (
              <TouchableOpacity
                key={olay}
                style={[
                  styles.stilItem,
                  secilenOlay === olay && styles.stilItemSecili
                ]}
                onPress={() => setSecilenOlay(olay)}
              >
                <Text style={[
                  styles.stilItemText,
                  secilenOlay === olay && styles.stilItemTextSecili
                ]}>{olay}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tercih Ettiğiniz Renkler</Text>
          <View style={styles.renkGrid}>
            {renkler.map((renk) => (
              <TouchableOpacity
                key={renk.isim}
                style={[
                  styles.renkItem,
                  secilenRenkler.includes(renk.isim) && { borderColor: '#8A2BE2', borderWidth: 2 }
                ]}
                onPress={() => {
                  if (secilenRenkler.includes(renk.isim)) {
                    setSecilenRenkler(secilenRenkler.filter(r => r !== renk.isim));
                  } else {
                    setSecilenRenkler([...secilenRenkler, renk.isim]);
                  }
                }}
              >
                <Text style={styles.renkItemText}>{renk.isim}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Stil Tercihiniz</Text>
          <View style={styles.stilGrid}>
            {stilTercihleri.map((stil) => (
              <TouchableOpacity
                key={stil}
                style={[
                  styles.stilItem,
                  stilTercihi === stil && styles.stilItemSecili
                ]}
                onPress={() => setStilTercihi(stil)}
              >
                <Text style={[
                  styles.stilItemText,
                  stilTercihi === stil && styles.stilItemTextSecili
                ]}>{stil}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hava Durumu</Text>
          <View style={styles.stilGrid}>
            {havaDurumlari.map((hava) => (
              <TouchableOpacity
                key={hava}
                style={[
                  styles.stilItem,
                  havaDurumu === hava && styles.stilItemSecili
                ]}
                onPress={() => setHavaDurumu(hava)}
              >
                <Text style={[
                  styles.stilItemText,
                  havaDurumu === hava && styles.stilItemTextSecili
                ]}>{hava}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={oneriAl}
        >
          <Text style={styles.buttonText}>Öneri Al</Text>
        </TouchableOpacity>
      </ScrollView>

      {yukleniyor && (
        <View style={styles.yukleniyorContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.yukleniyorText}>Öneri hazırlanıyor...</Text>
        </View>
      )}

      <SonucModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6F9',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8A2BE2',
    marginBottom: 10,
    marginLeft: 4,
  },
  stilGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'center',
  },
  stilItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6FA',
    backgroundColor: '#FFF6F9',
    minWidth: 90,
    alignItems: 'center',
    marginBottom: 8,
  },
  stilItemSecili: {
    backgroundColor: '#F7CAC9',
    borderColor: '#B388A8',
  },
  stilItemText: {
    fontSize: 15,
    color: '#8A2BE2',
  },
  stilItemTextSecili: {
    color: '#fff',
    fontWeight: 'bold',
  },
  renkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  renkItem: {
    width: '30%',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F7CAC9',
  },
  renkItemText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#E6E6FA',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#B388A8',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#8A2BE2',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
  yukleniyorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 246, 249, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yukleniyorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8A2BE2',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 162, 200, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 28,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#B388A8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#8A2BE2',
  },
  sonucContent: {
    maxHeight: 400,
    marginBottom: 20,
  },
  sonucText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8A2BE2',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
}); 