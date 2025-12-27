export interface TrendyolUrun {
  id: string;
  isim: string;
  kategori: string;
  altKategori: string;
  fiyat: number;
  resimUrl: string;
  renk: string;
  beden: string[];
  marka: string;
  puan: number;
  yorumSayisi: number;
  trendyolLinki?: string;
}

// Üst Giyim Ürünleri
export const ustGiyimUrunleri: TrendyolUrun[] = [
  {
    id: '1',
    isim: 'Beyaz Oversize T-Shirt',
    kategori: 'Üst Giyim',
    altKategori: 'T-Shirt',
    fiyat: 89,
    resimUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    renk: 'Beyaz',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'TrendyolMilla',
    puan: 4.5,
    yorumSayisi: 1247,
    trendyolLinki: 'https://www.trendyol.com/beyaz-oversize-t-shirt-p-123456'
  },
  {
    id: '2',
    isim: 'Siyah Basic Gömlek',
    kategori: 'Üst Giyim',
    altKategori: 'Gömlek',
    fiyat: 129,
    resimUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300',
    renk: 'Siyah',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'LC Waikiki',
    puan: 4.3,
    yorumSayisi: 892
  },
  {
    id: '3',
    isim: 'Pembe Bluz',
    kategori: 'Üst Giyim',
    altKategori: 'Bluz',
    fiyat: 159,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    renk: 'Pembe',
    beden: ['S', 'M', 'L'],
    marka: 'Koton',
    puan: 4.7,
    yorumSayisi: 634
  },
  {
    id: '4',
    isim: 'Gri Kazak',
    kategori: 'Üst Giyim',
    altKategori: 'Kazak',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
    renk: 'Gri',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'Defacto',
    puan: 4.4,
    yorumSayisi: 445
  }
];

// Alt Giyim Ürünleri
export const altGiyimUrunleri: TrendyolUrun[] = [
  {
    id: '5',
    isim: 'Mavi Jean Pantolon',
    kategori: 'Alt Giyim',
    altKategori: 'Jean',
    fiyat: 249,
    resimUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300',
    renk: 'Mavi',
    beden: ['28', '30', '32', '34', '36'],
    marka: 'Levi\'s',
    puan: 4.6,
    yorumSayisi: 2156
  },
  {
    id: '6',
    isim: 'Siyah Klasik Pantolon',
    kategori: 'Alt Giyim',
    altKategori: 'Pantolon',
    fiyat: 189,
    resimUrl: 'https://images.unsplash.com/photo-1506629905607-1b8b5b5b5b5b?w=300',
    renk: 'Siyah',
    beden: ['28', '30', '32', '34', '36'],
    marka: 'H&M',
    puan: 4.2,
    yorumSayisi: 987
  },
  {
    id: '7',
    isim: 'Kırmızı Mini Etek',
    kategori: 'Alt Giyim',
    altKategori: 'Etek',
    fiyat: 149,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    renk: 'Kırmızı',
    beden: ['S', 'M', 'L'],
    marka: 'Zara',
    puan: 4.8,
    yorumSayisi: 723
  },
  {
    id: '8',
    isim: 'Beyaz Şort',
    kategori: 'Alt Giyim',
    altKategori: 'Şort',
    fiyat: 99,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    renk: 'Beyaz',
    beden: ['S', 'M', 'L'],
    marka: 'Mango',
    puan: 4.3,
    yorumSayisi: 456
  }
];

// Ayakkabı Ürünleri
export const ayakkabiUrunleri: TrendyolUrun[] = [
  {
    id: '9',
    isim: 'Beyaz Spor Ayakkabı',
    kategori: 'Ayakkabı',
    altKategori: 'Spor Ayakkabı',
    fiyat: 399,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    renk: 'Beyaz',
    beden: ['36', '37', '38', '39', '40', '41', '42'],
    marka: 'Nike',
    puan: 4.7,
    yorumSayisi: 3456
  },
  {
    id: '10',
    isim: 'Siyah Bot',
    kategori: 'Ayakkabı',
    altKategori: 'Bot',
    fiyat: 599,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    renk: 'Siyah',
    beden: ['36', '37', '38', '39', '40', '41', '42'],
    marka: 'Dr. Martens',
    puan: 4.9,
    yorumSayisi: 1234
  },
  {
    id: '11',
    isim: 'Kahverengi Sandalet',
    kategori: 'Ayakkabı',
    altKategori: 'Sandalet',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    renk: 'Kahverengi',
    beden: ['36', '37', '38', '39', '40', '41'],
    marka: 'Birkenstock',
    puan: 4.5,
    yorumSayisi: 789
  }
];

// Aksesuar Ürünleri
export const aksesuarUrunleri: TrendyolUrun[] = [
  {
    id: '12',
    isim: 'Altın Kolye',
    kategori: 'Aksesuar',
    altKategori: 'Kolye',
    fiyat: 299,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    renk: 'Altın',
    beden: ['Tek Beden'],
    marka: 'Pandora',
    puan: 4.6,
    yorumSayisi: 567
  },
  {
    id: '13',
    isim: 'Gümüş Küpe',
    kategori: 'Aksesuar',
    altKategori: 'Küpe',
    fiyat: 149,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    renk: 'Gümüş',
    beden: ['Tek Beden'],
    marka: 'Swarovski',
    puan: 4.4,
    yorumSayisi: 234
  },
  {
    id: '14',
    isim: 'Deri Bilezik',
    kategori: 'Aksesuar',
    altKategori: 'Bilezik',
    fiyat: 89,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    renk: 'Kahverengi',
    beden: ['Tek Beden'],
    marka: 'Fossil',
    puan: 4.3,
    yorumSayisi: 123
  },
  {
    id: '15',
    isim: 'Akıllı Saat',
    kategori: 'Aksesuar',
    altKategori: 'Saat',
    fiyat: 1299,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    renk: 'Siyah',
    beden: ['Tek Beden'],
    marka: 'Apple',
    puan: 4.8,
    yorumSayisi: 3456
  }
];

// Çanta Ürünleri
export const cantaUrunleri: TrendyolUrun[] = [
  {
    id: '16',
    isim: 'Siyah Deri Çanta',
    kategori: 'Çanta',
    altKategori: 'Çanta',
    fiyat: 499,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    renk: 'Siyah',
    beden: ['Tek Beden'],
    marka: 'Michael Kors',
    puan: 4.7,
    yorumSayisi: 1234
  },
  {
    id: '17',
    isim: 'Kahverengi Sırt Çantası',
    kategori: 'Çanta',
    altKategori: 'Çanta',
    fiyat: 299,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    renk: 'Kahverengi',
    beden: ['Tek Beden'],
    marka: 'Herschel',
    puan: 4.5,
    yorumSayisi: 567
  },
  {
    id: '18',
    isim: 'Beyaz El Çantası',
    kategori: 'Çanta',
    altKategori: 'Çanta',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    renk: 'Beyaz',
    beden: ['Tek Beden'],
    marka: 'Zara',
    puan: 4.3,
    yorumSayisi: 234
  }
];

// Mont/Ceket Ürünleri
export const montCeketUrunleri: TrendyolUrun[] = [
  {
    id: '19',
    isim: 'Siyah Deri Ceket',
    kategori: 'Mont/Ceket',
    altKategori: 'Ceket',
    fiyat: 899,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    renk: 'Siyah',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'AllSaints',
    puan: 4.8,
    yorumSayisi: 456
  },
  {
    id: '20',
    isim: 'Mavi Denim Ceket',
    kategori: 'Mont/Ceket',
    altKategori: 'Ceket',
    fiyat: 399,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    renk: 'Mavi',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'Levi\'s',
    puan: 4.6,
    yorumSayisi: 789
  },
  {
    id: '21',
    isim: 'Kırmızı Mont',
    kategori: 'Mont/Ceket',
    altKategori: 'Mont',
    fiyat: 1299,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    renk: 'Kırmızı',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'The North Face',
    puan: 4.9,
    yorumSayisi: 1234
  },
  {
    id: '22',
    isim: 'Bej Trençkot',
    kategori: 'Mont/Ceket',
    altKategori: 'Trençkot',
    fiyat: 699,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    renk: 'Bej',
    beden: ['S', 'M', 'L', 'XL'],
    marka: 'Burberry',
    puan: 4.7,
    yorumSayisi: 567
  }
];

// Tüm Trendyol Ürünleri
export const tumTrendyolUrunleri: TrendyolUrun[] = [
  ...ustGiyimUrunleri,
  ...altGiyimUrunleri,
  ...ayakkabiUrunleri,
  ...aksesuarUrunleri,
  ...cantaUrunleri,
  ...montCeketUrunleri
];

// Trendyol kategori linklerini oluşturan fonksiyon
const getTrendyolKategoriLinki = (kategori: string, altKategori: string): string => {
  const kategoriMap: { [key: string]: string } = {
    'Üst Giyim': 'kadin-ust-giyim',
    'Alt Giyim': 'kadin-alt-giyim', 
    'Ayakkabı': 'kadin-ayakkabi',
    'Aksesuar': 'kadin-aksesuar',
    'Çanta': 'kadin-canta',
    'Mont/Ceket': 'kadin-mont-ceket'
  };
  
  const baseUrl = 'https://www.trendyol.com';
  const kategoriSlug = kategoriMap[kategori] || 'kadin-giyim';
  
  return `${baseUrl}/${kategoriSlug}`;
};

// Tüm ürünlere Trendyol linklerini ekle
export const tumTrendyolUrunleriWithLinks: TrendyolUrun[] = tumTrendyolUrunleri.map(urun => ({
  ...urun,
  trendyolLinki: urun.trendyolLinki || getTrendyolKategoriLinki(urun.kategori, urun.altKategori)
}));

// Eksik parça önerileri fonksiyonu
export const getEksikParcaOnerileri = (kombinBilgisi: string, mevsim: string): TrendyolUrun[] => {
  // Kombin bilgisinden eksik kategorileri tespit et
  const eksikKategoriler: string[] = [];
  
  if (!kombinBilgisi.includes('Mont/Ceket')) {
    eksikKategoriler.push('Mont/Ceket');
  }
  if (!kombinBilgisi.includes('Ayakkabı')) {
    eksikKategoriler.push('Ayakkabı');
  }
  if (!kombinBilgisi.includes('Aksesuar')) {
    eksikKategoriler.push('Aksesuar');
  }
  if (!kombinBilgisi.includes('Çanta')) {
    eksikKategoriler.push('Çanta');
  }
  
  // Eksik kategorilerden rastgele ürünler seç
  const oneriler: TrendyolUrun[] = [];
  
  eksikKategoriler.forEach(kategori => {
    const kategoriUrunleri = tumTrendyolUrunleriWithLinks.filter(urun => urun.kategori === kategori);
    if (kategoriUrunleri.length > 0) {
      // Her kategoriden 1-2 ürün seç
      const secilenUrunler = kategoriUrunleri
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1);
      oneriler.push(...secilenUrunler);
    }
  });
  
  // Eğer hiç eksik kategori yoksa, genel öneriler ver
  if (oneriler.length === 0) {
    const genelOneriler = tumTrendyolUrunleriWithLinks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    oneriler.push(...genelOneriler);
  }
  
  return oneriler.slice(0, 5); // Maksimum 5 öneri
};