export interface Flavor {
  id: string;
  name: string;
  englishName: string;
  category: string;
  sweetness: number; // 1 to 5
  milkContent: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  englishName: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string; // 'giftbox' | 'family' | 'limited' | 'boutique'
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Boutique {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  imageUrl: string;
  description: string;
  specialties: string[];
  latPercent: number; // Map position coordinate simulation (Y)
  lngPercent: number; // Map position coordinate simulation (X)
}

export interface SundaeIngredient {
  id: string;
  name: string;
  type: 'scoop' | 'sauce' | 'topping' | 'cup';
  color: string;
  price: number;
  imageUrl?: string;
}

export interface CustomSundae {
  cupType: string;
  scoops: SundaeIngredient[];
  sauces: SundaeIngredient[];
  toppings: SundaeIngredient[];
}
