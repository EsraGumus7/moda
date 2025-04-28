export interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
  color: string;
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  image: string;
  brand?: string;
  purchaseDate?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: 'casual' | 'formal' | 'business' | 'sport';
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  created: string;
}

export interface ShoppingRecommendation {
  id: string;
  item: {
    name: string;
    category: ClothingItem['category'];
    reason: string;
  };
  suggestedItems: {
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    shopUrl: string;
  }[];
}
