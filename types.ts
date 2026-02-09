
export type Language = 'uz' | 'ru' | 'en';

export interface Translatable {
  uz: string;
  ru: string;
  en: string;
}

export interface MenuItem {
  id: string;
  name: Translatable;
  description: Translatable;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  tags?: string[];
  prepTimeMinutes?: number;
}

export interface Category {
  id: string;
  name: Translatable;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: Translatable;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'served' | 'cancelled';

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  estimatedArrivalAt: number;
  totalPrice: number;
}

export interface MenuTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans';
  layout: 'list' | 'grid';
}

export interface RestaurantData {
  name: Translatable;
  description: Translatable;
  logoUrl?: string;
  address?: string;
  phone?: string;
  website?: string;
  items: MenuItem[];
  categories: Category[];
  theme: MenuTheme;
  tables: string[]; // Yangi qo'shilgan maydon
}

export enum ViewMode {
  EDITOR = 'editor',
  PREVIEW = 'preview',
  QR_SHARE = 'qr_share',
  DASHBOARD = 'dashboard',
  ACTIVE_ORDER = 'active_order'
}
