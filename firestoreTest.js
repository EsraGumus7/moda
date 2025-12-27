import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "./firebaseConfig";

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