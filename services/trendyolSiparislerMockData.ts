export interface TrendyolSiparis {
  id: string;
  isim: string;
  kategori: string;
  altKategori: string;
  fiyat: number;
  resimUrl: string;
  siparisTarihi: string;
  durum: 'Teslim Edildi' | 'Kargoda' | 'Hazırlanıyor';
}

export const kullaniciSiparisleri: TrendyolSiparis[] = [
  // Kıyafet Siparişleri
  {
    id: '1',
    isim: 'Beyaz Oversize T-Shirt',
    kategori: 'Kıyafet',
    altKategori: 'T-Shirt',
    fiyat: 89,
    resimUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    siparisTarihi: '2024-01-15',
    durum: 'Teslim Edildi'
  },
  {
    id: '2',
    isim: 'Mavi Jean Pantolon',
    kategori: 'Kıyafet',
    altKategori: 'Jean',
    fiyat: 249,
    resimUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300',
    siparisTarihi: '2024-01-20',
    durum: 'Teslim Edildi'
  },
  {
    id: '3',
    isim: 'Siyah Deri Ceket',
    kategori: 'Kıyafet',
    altKategori: 'Ceket',
    fiyat: 899,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    siparisTarihi: '2024-01-25',
    durum: 'Teslim Edildi'
  },
  {
    id: '4',
    isim: 'Beyaz Spor Ayakkabı',
    kategori: 'Kıyafet',
    altKategori: 'Spor Ayakkabı',
    fiyat: 399,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    siparisTarihi: '2024-02-01',
    durum: 'Teslim Edildi'
  },
  {
    id: '5',
    isim: 'Pembe Bluz',
    kategori: 'Kıyafet',
    altKategori: 'Bluz',
    fiyat: 159,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    siparisTarihi: '2024-02-05',
    durum: 'Teslim Edildi'
  },
  {
    id: '6',
    isim: 'Kırmızı Mini Etek',
    kategori: 'Kıyafet',
    altKategori: 'Etek',
    fiyat: 149,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    siparisTarihi: '2024-02-10',
    durum: 'Teslim Edildi'
  },
  {
    id: '7',
    isim: 'Siyah Deri Çanta',
    kategori: 'Kıyafet',
    altKategori: 'Çanta',
    fiyat: 499,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    siparisTarihi: '2024-02-15',
    durum: 'Teslim Edildi'
  },
  {
    id: '8',
    isim: 'Gri Kazak',
    kategori: 'Kıyafet',
    altKategori: 'Kazak',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
    siparisTarihi: '2024-02-20',
    durum: 'Teslim Edildi'
  },
  {
    id: '9',
    isim: 'Beyaz Şort',
    kategori: 'Kıyafet',
    altKategori: 'Şort',
    fiyat: 99,
    resimUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    siparisTarihi: '2024-02-25',
    durum: 'Teslim Edildi'
  },
  {
    id: '10',
    isim: 'Altın Kolye',
    kategori: 'Kıyafet',
    altKategori: 'Kolye',
    fiyat: 299,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    siparisTarihi: '2024-03-01',
    durum: 'Teslim Edildi'
  },
  {
    id: '11',
    isim: 'Mavi Denim Ceket',
    kategori: 'Kıyafet',
    altKategori: 'Ceket',
    fiyat: 399,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    siparisTarihi: '2024-03-05',
    durum: 'Teslim Edildi'
  },
  {
    id: '12',
    isim: 'Siyah Bot',
    kategori: 'Kıyafet',
    altKategori: 'Bot',
    fiyat: 599,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    siparisTarihi: '2024-03-10',
    durum: 'Teslim Edildi'
  },
  {
    id: '13',
    isim: 'Kahverengi Sırt Çantası',
    kategori: 'Kıyafet',
    altKategori: 'Çanta',
    fiyat: 299,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    siparisTarihi: '2024-03-15',
    durum: 'Teslim Edildi'
  },
  {
    id: '14',
    isim: 'Siyah Klasik Pantolon',
    kategori: 'Kıyafet',
    altKategori: 'Pantolon',
    fiyat: 189,
    resimUrl: 'https://images.unsplash.com/photo-1506629905607-1b8b5b5b5b5b?w=300',
    siparisTarihi: '2024-03-20',
    durum: 'Teslim Edildi'
  },
  {
    id: '15',
    isim: 'Bej Trençkot',
    kategori: 'Kıyafet',
    altKategori: 'Trençkot',
    fiyat: 699,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    siparisTarihi: '2024-03-25',
    durum: 'Teslim Edildi'
  },
  {
    id: '16',
    isim: 'Gümüş Küpe',
    kategori: 'Kıyafet',
    altKategori: 'Küpe',
    fiyat: 149,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    siparisTarihi: '2024-03-30',
    durum: 'Teslim Edildi'
  },
  {
    id: '17',
    isim: 'Kahverengi Sandalet',
    kategori: 'Kıyafet',
    altKategori: 'Sandalet',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    siparisTarihi: '2024-04-01',
    durum: 'Teslim Edildi'
  },
  {
    id: '18',
    isim: 'Beyaz El Çantası',
    kategori: 'Kıyafet',
    altKategori: 'Çanta',
    fiyat: 199,
    resimUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    siparisTarihi: '2024-04-05',
    durum: 'Teslim Edildi'
  },
  {
    id: '19',
    isim: 'Kırmızı Mont',
    kategori: 'Kıyafet',
    altKategori: 'Mont',
    fiyat: 1299,
    resimUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    siparisTarihi: '2024-04-10',
    durum: 'Teslim Edildi'
  },
  {
    id: '20',
    isim: 'Deri Bilezik',
    kategori: 'Kıyafet',
    altKategori: 'Bilezik',
    fiyat: 89,
    resimUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300',
    siparisTarihi: '2024-04-15',
    durum: 'Teslim Edildi'
  },

  // Diğer Ürünler (Kıyafet Dışı)
  {
    id: '21',
    isim: 'iPhone 15 Pro',
    kategori: 'Elektronik',
    altKategori: 'Telefon',
    fiyat: 45999,
    resimUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    siparisTarihi: '2024-01-10',
    durum: 'Teslim Edildi'
  },
  {
    id: '22',
    isim: 'MacBook Air M2',
    kategori: 'Elektronik',
    altKategori: 'Laptop',
    fiyat: 25999,
    resimUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
    siparisTarihi: '2024-01-12',
    durum: 'Teslim Edildi'
  },
  {
    id: '23',
    isim: 'AirPods Pro',
    kategori: 'Elektronik',
    altKategori: 'Kulaklık',
    fiyat: 8999,
    resimUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300',
    siparisTarihi: '2024-01-18',
    durum: 'Teslim Edildi'
  },
  {
    id: '24',
    isim: 'Samsung 55" 4K TV',
    kategori: 'Ev & Yaşam',
    altKategori: 'Televizyon',
    fiyat: 18999,
    resimUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300',
    siparisTarihi: '2024-02-08',
    durum: 'Teslim Edildi'
  },
  {
    id: '25',
    isim: 'Dyson V15 Vakum',
    kategori: 'Ev & Yaşam',
    altKategori: 'Temizlik',
    fiyat: 12999,
    resimUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
    siparisTarihi: '2024-02-12',
    durum: 'Teslim Edildi'
  },
  {
    id: '26',
    isim: 'Nespresso Kahve Makinesi',
    kategori: 'Ev & Yaşam',
    altKategori: 'Mutfak',
    fiyat: 3999,
    resimUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    siparisTarihi: '2024-02-18',
    durum: 'Teslim Edildi'
  },
  {
    id: '27',
    isim: 'IKEA Yatak Odası Seti',
    kategori: 'Ev & Yaşam',
    altKategori: 'Mobilya',
    fiyat: 8999,
    resimUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
    siparisTarihi: '2024-03-02',
    durum: 'Teslim Edildi'
  },
  {
    id: '28',
    isim: 'Philips Hava Fritözü',
    kategori: 'Ev & Yaşam',
    altKategori: 'Mutfak',
    fiyat: 2999,
    resimUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    siparisTarihi: '2024-03-08',
    durum: 'Teslim Edildi'
  },
  {
    id: '29',
    isim: 'Xbox Series X',
    kategori: 'Elektronik',
    altKategori: 'Oyun Konsolu',
    fiyat: 12999,
    resimUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300',
    siparisTarihi: '2024-03-12',
    durum: 'Teslim Edildi'
  },
  {
    id: '30',
    isim: 'Dyson Saç Kurutma Makinesi',
    kategori: 'Kişisel Bakım',
    altKategori: 'Saç Bakımı',
    fiyat: 8999,
    resimUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300',
    siparisTarihi: '2024-03-18',
    durum: 'Teslim Edildi'
  }
];