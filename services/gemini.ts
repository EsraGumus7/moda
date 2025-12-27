import { GoogleGenerativeAI } from '@google/generative-ai';

// API anahtarı kontrolü
const API_KEY = 'AIzaSyCHcYH85LQWGgK_bRUlg85rkNmZdMUXlmk';

if (!API_KEY) {
  throw new Error('Gemini API anahtarı bulunamadı. Lütfen API_KEY değişkenini ayarlayın.');
}

// API anahtarı formatı kontrolü
if (!API_KEY.startsWith('AIza')) {
  throw new Error('Geçersiz API anahtarı formatı. Lütfen doğru API anahtarını ekleyin.');
}

// Gemini API istemcisini oluştur
const genAI = new GoogleGenerativeAI(API_KEY);

// API bağlantı testi
const testApiBaglantisi = async () => {
  try {
    console.log('API bağlantı testi başlatılıyor...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Test');
    const response = await result.response;
    const text = response.text();
    console.log('API bağlantı testi başarılı');
    return true;
  } catch (error: any) {
    console.error('API Bağlantı Testi Hatası:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    return false;
  }
};

// API isteklerini yönetmek için yardımcı fonksiyon
const apiIstegiYap = async (prompt: string) => {
  try {
    console.log('API isteği başlatılıyor...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // İstek yapılandırması
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    // İstek gönder
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('API yanıtı boş geldi. Lütfen tekrar deneyin.');
    }

    console.log('API yanıtı başarıyla alındı');
    return text;
  } catch (error: any) {
    console.error('API İsteği Hatası:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });

    if (error.message?.includes('API key')) {
      throw new Error('API anahtarı geçersiz veya süresi dolmuş. Lütfen yeni bir API anahtarı alın.');
    }

    if (error.message?.includes('quota')) {
      throw new Error('API kotası dolmuş. Lütfen daha sonra tekrar deneyin.');
    }

    if (error.message?.includes('permission')) {
      throw new Error('API erişim izniniz yok. Lütfen API anahtarınızı kontrol edin.');
    }

    if (error.message?.includes('network')) {
      throw new Error('İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.');
    }

    throw new Error(`API isteği başarısız oldu: ${error.message}`);
  }
};

export const stilAnaliziYap = async (kombin: any) => {
  try {
    console.log('Stil analizi başlatılıyor...');
    console.log('Gelen parametreler:', JSON.stringify(kombin, null, 2));

    const requiredFields = ['mevsim', 'stil', 'havaDurumu'];
    const missingFields = requiredFields.filter(field => !kombin[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Eksik alanlar: ${missingFields.join(', ')}`);
    }

    const prompt = `
    Aşağıdaki kombin bilgilerine göre detaylı bir stil analizi yapmanı istiyorum:
    
    Mevsim: ${kombin.mevsim}
    Tercih Edilen Renkler: ${Array.isArray(kombin.renkler) ? kombin.renkler.join(', ') : 'Belirtilmemiş'}
    Stil: ${kombin.stil}
    Hava Durumu: ${kombin.havaDurumu}
    Kombin Detayı: ${kombin.kombinDetay || 'Belirtilmemiş'}

    Lütfen şu başlıklar altında analiz yap:
    1. Kombinin genel stili ve hangi ortamlara uygun olduğu
    2. Renk uyumu ve alternatif renk önerileri
    3. Üst giyim için detaylı öneri (renk, model, marka)
    4. Alt giyim için detaylı öneri (renk, model, marka)
    5. Dış giyim için detaylı öneri (mevsime uygunluk, renk, model)
    6. Ayakkabı için detaylı öneri (renk, model)
    7. Aksesuar önerileri (çanta, takı, şapka vb.)
    8. Kombini daha şık veya rahat yapmak için ipuçları
    9. Kombinin hangi vücut tiplerine ve yaş gruplarına uygun olduğu
    10. Pinterest'te arayabileceğim anahtar kelimeler
    11. Kombin için önerilen renk paleti

    Yanıtı Türkçe, samimi ve açıklayıcı bir dille, her başlığı numaralandırarak ve kısa paragraflar halinde ver.
    `;

    return await apiIstegiYap(prompt);
  } catch (error: any) {
    console.error('Stil Analizi Hatası:', error);
    throw new Error(`Stil analizi yapılırken bir hata oluştu: ${error.message}`);
  }
};

export const kombinOnerisiAl = async (mevsim: string, tarz: string, gardiropKiyafetleri?: any[]) => {
  try {
    console.log('Kombin önerisi başlatılıyor...');
    console.log('Parametreler:', { mevsim, tarz, gardiropKiyafetleri });

    if (!mevsim || !tarz) {
      throw new Error('Mevsim ve tarz parametreleri gereklidir.');
    }

    let gardiropBilgisi = '';
    if (gardiropKiyafetleri && gardiropKiyafetleri.length > 0) {
      gardiropBilgisi = `
      Mevcut Gardırop İçeriği:
      ${gardiropKiyafetleri.map(k => `- ${k.kategori}: ${k.isim} (${k.mevsim})`).join('\n')}
      `;
    }

    const prompt = `
    ${mevsim} mevsimi için ${tarz} tarzında detaylı bir kombin önerisi yap.
    ${gardiropBilgisi}
    
    Lütfen şunları içeren detaylı bir kombin önerisi sun:
    1. Üst giyim önerisi (renk, model ve marka önerileri dahil)
    2. Alt giyim önerisi (renk, model ve marka önerileri dahil)
    3. Dış giyim önerisi (mevsime uygun, renk ve model detayları)
    4. Ayakkabı önerisi (renk ve model detayları)
    5. Aksesuar önerisi (detaylı açıklama)
    6. Kombinin genel stili ve uyumu hakkında detaylı açıklama
    7. Pinterest'te benzer kombinler için arama önerileri (anahtar kelimeler)
    8. Kombin için önerilen renk paleti
    9. Kombinin hangi vücut tiplerine uygun olduğu
    10. Kombinin hangi yaş gruplarına hitap ettiği

    Yanıtını Türkçe olarak ver ve samimi bir dille yaz. Her bir öneriyi numaralandır ve alt başlıklar halinde düzenle.
    `;

    return await apiIstegiYap(prompt);
  } catch (error: any) {
    console.error('Kombin Önerisi Hatası:', error);
    throw new Error(`Kombin önerisi alınırken bir hata oluştu: ${error.message}`);
  }
};

export const gardiropAnaliziYapGemini = async (kiyafetler: any[]) => {
  try {
    console.log('Gardırop analizi başlatılıyor...');
    console.log('Kıyafet sayısı:', kiyafetler.length);

    if (!kiyafetler || kiyafetler.length === 0) {
      throw new Error('Gardırop analizi için en az bir kıyafet gereklidir.');
    }

    const prompt = `
    Aşağıdaki gardırop içeriğine göre detaylı bir analiz ve öneriler sun:
    
    Gardırop İçeriği:
    ${kiyafetler.map(k => `- ${k.kategori}: ${k.isim} (${k.mevsim})`).join('\n')}

    Lütfen şunları içeren detaylı bir analiz yap:
    1. Gardırobunuzun genel stili ve eksikleri
    2. Mevsimsel dağılım analizi
    3. Renk paleti analizi
    4. Eksik olan temel parçalar
    5. Önerilen yeni kombinler (mevcut parçalarla)
    6. Gardırobunuzu geliştirmek için öneriler
    7. Pinterest'te benzer stiller için arama önerileri
    8. Mevcut parçalarla yapılabilecek 3 farklı kombin önerisi

    Yanıtını Türkçe olarak ver ve samimi bir dille yaz. Her bir öneriyi numaralandır ve alt başlıklar halinde düzenle.
    `;

    return await apiIstegiYap(prompt);
  } catch (error: any) {
    console.error('Gardırop Analizi Hatası:', error);
    throw new Error(`Gardırop analizi yapılırken bir hata oluştu: ${error.message}`);
  }
};

export const fotoAnaliziYap = async (imageUri: string) => {
  try {
    console.log('Fotoğraf analizi başlatılıyor...');
    
    // Base64'e çevir
    const imageResponse = await fetch(imageUri);
    const blob = await imageResponse.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
    Bu kombin fotoğrafını analiz et ve şu başlıklar altında detaylı bir değerlendirme yap:
    
    1. Kombinin Genel Puanı (10 üzerinden)
    2. Renk Uyumu ve Analizi
    3. Parçaların Birbiriyle Uyumu
    4. Stil ve Trend Uyumu
    5. Geliştirilebilecek Yönler
    6. Öneriler ve İpuçları
    7. Benzer Stiller İçin Pinterest Arama Önerileri
    
    Yanıtı Türkçe, samimi ve açıklayıcı bir dille, her başlığı numaralandırarak ve kısa paragraflar halinde ver.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64.toString().split(',')[1]
        }
      }
    ]);

    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    if (!text) {
      throw new Error('API yanıtı boş geldi. Lütfen tekrar deneyin.');
    }

    console.log('Fotoğraf analizi tamamlandı');
    return text;
  } catch (error: any) {
    console.error('Fotoğraf Analizi Hatası:', error);
    throw new Error(`Fotoğraf analizi yapılırken bir hata oluştu: ${error.message}`);
  }
}; 