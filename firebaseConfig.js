import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIaLUMSEKhz0PmzSGZGaqA_r7nRsr_wBU",
  authDomain: "moda-aii-adddb.firebaseapp.com",
  projectId: "moda-aii-adddb",
  storageBucket: "moda-aii-adddb.appspot.com",
  messagingSenderId: "310758770487",
  appId: "1:310758770487:web:0bf1ce776ab7a629187cb2"
};

export const app = initializeApp(firebaseConfig);

// Firestore bağlantısı
const db = getFirestore(app);

// Firestore'a veri ekleme fonksiyonu
export async function veriEkle() {
  try {
    const docRef = await addDoc(collection(db, "kullanicilar"), {
      isim: "Esra",
      yas: 25
    });
    console.log("Belge ID'si:", docRef.id);
  } catch (e) {
    console.error("Hata oluştu: ", e);
  }
}

// Firestore'dan veri okuma fonksiyonu
export async function veriOku() {
  const querySnapshot = await getDocs(collection(db, "kullanicilar"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
} 