// Enums
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export enum AlbumFormat {
  VINYL = 'VINYL',
  CD = 'CD',
  CASSETTE = 'CASSETTE',
  DIGITAL = 'DIGITAL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}

// Models
export interface User {
  uuid: string
  name: string
  email: string
  phone?: string
  role: UserRole
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface Artist {
  id: number
  slug: string
  name: string
  origin?: string
  biography?: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface Genre {
  id: number
  slug: string
  name: string
  parent_id?: number
  sort_order: number
  created_at: string
  updated_at: string
  parent?: Genre
  children?: Genre[]
}

export interface Track {
  id: number
  album_id: string
  title: string
  track_number: number
  duration?: string
  created_at: string
  updated_at: string
}

export interface Album {
  id: number  // Add numeric id for API operations
  uuid: string
  slug: string
  title: string
  artist_id: number
  format: AlbumFormat
  price: number
  sale_price?: number
  description?: string
  release_year?: number
  label?: string
  catalog_number?: string
  cover_image?: string
  avg_rating?: number
  reviews_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  artist: Artist
  genres: Genre[]
  tracks?: Track[]
  inventory?: Inventory
}

export interface Inventory {
  id: number
  album_id: string
  quantity: number
  reorder_level: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  album: Album
  quantity: number
  unit_price: number
  line_total: number
}

export interface Cart {
  items: CartItem[]
  coupon?: Coupon
  subtotal: number
  discount_amount: number
  total: number
  total_items: number
  is_empty: boolean
  updated_at: string
}

export interface Review {
  id: number
  user_id: string
  album_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
  user: User
  album?: Album
}

export interface OrderItem {
  id: number
  order_id: string
  album_id: string
  quantity: number
  price: number
  created_at: string
  updated_at: string
  album: Album
}

export interface Payment {
  uuid: string
  order_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: PaymentStatus
  payment_method?: string
  card_brand?: string
  card_last4?: string
  metadata?: Record<string, unknown>
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface Address {
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
}

export interface Order {
  uuid: string
  order_number: string
  user_id: string
  status: OrderStatus
  subtotal: number
  discount_amount: number
  shipping_amount: number
  tax_amount: number
  total: number
  shipping_address: Address
  billing_address: Address
  shipping_method: string
  tracking_number?: string
  coupon_code?: string
  coupon_discount?: number
  shipped_at?: string
  delivered_at?: string
  customer_notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: User
  items: OrderItem[]
  payment?: Payment
}

export interface Coupon {
  id: number
  code: string
  type: CouponType
  value: number
  min_order_amount?: number
  max_discount_amount?: number
  usage_limit?: number
  usage_count: number
  valid_from?: string
  valid_until?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  album: Album
  added_at: string
}

// Pagination
export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

// Dashboard Stats
export interface BestSellingAlbum {
  album: Album
  total_quantity: number
  total_revenue: number
}

export interface DashboardStats {
  total_sales: number
  total_orders: number
  total_users: number
  total_albums: number
  revenue_this_month: number
  revenue_this_year: number
  pending_orders_count: number
  low_stock_count: number
  out_of_stock_count: number
  average_rating: number
  total_reviews: number
  best_selling_albums: BestSellingAlbum[]
}

export interface SalesChartData {
  labels: string[]
  revenue: number[]
  sales: number[]
}

export interface RecentActivity {
  type: 'order' | 'review' | 'user' | 'inventory'
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Inventory Statistics
export interface InventoryStatistics {
  total_albums: number
  total_stock: number
  low_stock_count: number
  out_of_stock_count: number
  total_inventory_value: number
}

// Filter interfaces
export interface AlbumFilters {
  page?: number
  per_page?: number
  search?: string
  artist_id?: number
  genre_id?: number
  format?: AlbumFormat
  min_price?: number
  max_price?: number
  on_sale?: boolean
  is_featured?: boolean
  sort_by?: 'title' | 'price' | 'release_year' | 'created_at' | 'avg_rating'
  sort_order?: 'asc' | 'desc'
}

export interface OrderFilters {
  page?: number
  per_page?: number
  status?: OrderStatus
  search?: string
  date_from?: string
  date_to?: string
  sort_by?: 'created_at' | 'total' | 'order_number'
  sort_order?: 'asc' | 'desc'
}

export interface UserFilters {
  page?: number
  per_page?: number
  role?: UserRole
  search?: string
  sort_by?: 'name' | 'email' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface InventoryFilters {
  page?: number
  per_page?: number
  search?: string
  low_stock?: boolean
  out_of_stock?: boolean
  format?: AlbumFormat
  sort_by?: 'title' | 'quantity' | 'updated_at'
  sort_order?: 'asc' | 'desc'
}
