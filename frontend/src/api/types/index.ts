// Enums matching backend
export enum AlbumFormat {
  VINYL = 'vinyl',
  CD = 'cd',
  CASSETTE = 'cassette',
  DIGITAL = 'digital',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ValidationError {
  [field: string]: string[];
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: ValidationError;
}

// Base entity types
export interface User {
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  bio?: string;
  origin?: string;
  formed_year?: number;
  image?: string;
  albums_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent?: Genre;
  children?: Genre[];
  albums_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: number;
  album_id: string;
  track_number: number;
  title: string;
  duration?: string;
  lyrics?: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  album_id: string;
  sku?: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Album {
  uuid: string;
  slug: string;
  artist_id: string;
  title: string;
  format: AlbumFormat;
  format_label: string;
  price: number;
  sale_price?: number;
  effective_price: number;
  is_on_sale: boolean;
  description?: string;
  release_year?: number;
  label?: string;
  catalog_number?: string;
  cover_image?: string;
  avg_rating: number;
  reviews_count: number;
  is_featured: boolean;
  artist?: Artist;
  genres: Genre[];
  tracks?: Track[];
  inventory?: Inventory;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  album_id: string;
  quantity: number;
  unit_price: number;
  album: Album;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id?: string;
  session_id?: string;
  coupon_id?: number;
  items: CartItem[];
  coupon?: Coupon;
  subtotal: number;
  discount_amount: number;
  total: number;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: string;
  album_id: string;
  album_snapshot: {
    title: string;
    artist: string;
    format: string;
    cover_image?: string;
  };
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order_id: string;
  stripe_payment_intent_id?: string;
  payment_intent_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  card_brand?: string;
  card_last4?: string;
  metadata?: Record<string, any>;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  uuid: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  coupon_code?: string;
  coupon_discount?: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  customer_notes?: string;
  admin_notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
  payment?: Payment;
  user?: User;
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: string;
  album_id: string;
  order_item_id?: number;
  rating: number;
  title?: string;
  body?: string;
  is_verified_purchase: boolean;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: number;
  user_id: string;
  album_id: string;
  album: Album;
  created_at: string;
  updated_at: string;
}

// Admin Dashboard Types
export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  total_users: number;
  total_albums: number;
  total_reviews: number;
  average_rating: number;
  low_stock_count: number;
  out_of_stock_count: number;
  pending_orders_count: number;
  revenue_today: number;
  revenue_this_month: number;
  revenue_this_year: number;
  best_selling_albums: Array<{
    album: Album | null;
    total_quantity: number | null;
    total_revenue: number | null;
  }>;
}

export interface SalesChartData {
  labels: string[];
  sales: number[];
  revenue: number[];
}

export interface RecentActivity {
  type: 'order' | 'review' | 'user';
  description: string;
  timestamp: string;
  data?: any;
}

// Form input types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AlbumInput {
  artist_id: string;
  title: string;
  format: AlbumFormat;
  price: number;
  sale_price?: number;
  description?: string;
  release_year?: number;
  label?: string;
  catalog_number?: string;
  cover_image?: string;
  genres?: number[];
  is_featured?: boolean;
}

export interface ArtistInput {
  name: string;
  bio?: string;
  origin?: string;
  formed_year?: number;
  image?: string;
}

export interface GenreInput {
  name: string;
  description?: string;
  parent_id?: string;
}

export interface ReviewInput {
  rating: number;
  title?: string;
  body?: string;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

export interface CreateOrderInput {
  shipping_address: AddressInput;
  billing_address?: AddressInput;
  use_same_address?: boolean;
  shipping_method?: string;
  customer_notes?: string;
}

export interface AddToCartInput {
  album_id: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface ApplyCouponInput {
  code: string;
}

// Filter and search types
export interface AlbumFilters {
  artist?: string;
  genre?: string;
  format?: AlbumFormat;
  featured?: boolean;
  on_sale?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'price' | 'release_year' | 'rating' | 'title';
  sort_order?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: OrderStatus;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UserFilters {
  role?: UserRole;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface InventoryFilters {
  low_stock?: boolean;
  out_of_stock?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}
