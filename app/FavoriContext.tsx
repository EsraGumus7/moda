import React, { createContext, ReactNode, useContext, useState } from 'react';

export type FavoriTip = 'kiyafet' | 'kombin';
export interface FavoriItem {
  tip: FavoriTip;
  icerik: string;
  kiyafetDetay?: {
    id: string;
    isim: string;
    kategori: string;
    mevsim: string;
    resimUrl: string;
  };
}

interface FavoriContextType {
  favoriler: FavoriItem[];
  favoriEkle: (item: FavoriItem) => void;
  favoriCikar: (item: FavoriItem) => void;
}

const FavoriContext = createContext<FavoriContextType | undefined>(undefined);

export const useFavori = () => {
  const ctx = useContext(FavoriContext);
  if (!ctx) throw new Error('FavoriContext provider dışında kullanılamaz!');
  return ctx;
};

export function FavoriProvider({ children }: { children: ReactNode }) {
  const [favoriler, setFavoriler] = useState<FavoriItem[]>([]);

  const favoriEkle = (item: FavoriItem) => {
    // Aynı içerik tekrar eklenmesin
    if (!favoriler.find(f => 
      f.tip === item.tip && 
      f.icerik === item.icerik && 
      (!item.kiyafetDetay || f.kiyafetDetay?.id === item.kiyafetDetay.id)
    )) {
      setFavoriler([...favoriler, item]);
    }
  };

  const favoriCikar = (item: FavoriItem) => {
    setFavoriler(favoriler.filter(f => 
      !(f.tip === item.tip && 
        f.icerik === item.icerik && 
        (!item.kiyafetDetay || f.kiyafetDetay?.id === item.kiyafetDetay.id))
    ));
  };

  return (
    <FavoriContext.Provider value={{ favoriler, favoriEkle, favoriCikar }}>
      {children}
    </FavoriContext.Provider>
  );
} 