export type Category = 'uy' | 'dom' | 'kvartira' | 'boshqa';
export type PromotionType = 'vip' | 'top' | 'ordinary';
export type TariffType = 'standart' | 'turbo' | 'premium' | 'custom';

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  category: Category;
  image: string;
  images?: string[];
  isVip?: boolean;
  isTop?: boolean;
  isFree?: boolean;
  promotionType?: PromotionType;
  tariff?: TariffType;
  boostDays?: number;
  topDays?: number;
  vipDays?: number;
  totalPrice?: number;
  status: 'pending' | 'approved' | 'rejected';
  dealType: 'Sotuv' | 'Ijara' | 'Kunlik';
  lat: number;
  lng: number;
  authorId: string;
  authorName?: string;
  createdAt: number;
  // Additional fields from form
  phone?: string;
  rooms?: string;
  area?: string;
  renovation?: string;
  floor?: string;
  totalFloors?: string;
  postedBy?: string;
  buildingType?: string;
  roomType?: string;
  breakfast?: string;
  hotelCategory?: string;
  priceCurrency?: 'sum' | 'rubl';
  country?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  type: 'topup' | 'payment';
  description: string;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  balance: number;
  paymentHistory: PaymentRecord[];
  isBlocked?: boolean;
  createdAt: number;
}
