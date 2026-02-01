import { AlbumFormat, OrderStatus, PaymentStatus, UserRole } from '@/api/types';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Music Store';

// Local Storage Keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const THEME_KEY = 'theme';
export const CART_KEY = 'cart_id';

// Pagination
export const DEFAULT_PAGE_SIZE = 15;
export const MAX_PAGE_SIZE = 100;

// Format Labels
export const ALBUM_FORMAT_LABELS: Record<AlbumFormat, string> = {
  [AlbumFormat.VINYL]: 'Vinyl LP',
  [AlbumFormat.CD]: 'Compact Disc',
  [AlbumFormat.CASSETTE]: 'Cassette',
  [AlbumFormat.DIGITAL]: 'Digital Download',
};

// Order Status Labels
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
};

// Order Status Colors (Tailwind classes)
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [OrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  [OrderStatus.REFUNDED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// Payment Status Labels
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PROCESSING]: 'Processing',
  [PaymentStatus.SUCCEEDED]: 'Paid',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.REFUNDED]: 'Refunded',
  [PaymentStatus.CANCELLED]: 'Cancelled',
};

// User Role Labels
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.CUSTOMER]: 'Customer',
};

// Shipping Methods
export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 5.99 },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 12.99 },
  { id: 'priority', name: 'Priority Shipping', description: '1-2 business days', price: 19.99 },
];

// Countries
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
];

// Rating Stars
export const RATING_STARS = [1, 2, 3, 4, 5];

// Debounce Delays
export const SEARCH_DEBOUNCE_MS = 300;
export const INPUT_DEBOUNCE_MS = 500;

// Image Placeholders
export const ALBUM_PLACEHOLDER = '/images/album-placeholder.png';
export const ARTIST_PLACEHOLDER = '/images/artist-placeholder.png';
export const USER_PLACEHOLDER = '/images/user-placeholder.png';

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Chart Colors
export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

// Admin Sidebar Menu
export const ADMIN_MENU = [
  { name: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { name: 'Orders', path: '/admin/orders', icon: 'ShoppingBag' },
  { name: 'Users', path: '/admin/users', icon: 'Users' },
  { name: 'Albums', path: '/admin/albums', icon: 'Disc' },
  { name: 'Artists', path: '/admin/artists', icon: 'Mic' },
  { name: 'Genres', path: '/admin/genres', icon: 'Tags' },
  { name: 'Inventory', path: '/admin/inventory', icon: 'Package' },
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logged out successfully.',
  UPDATE_PROFILE: 'Profile updated successfully.',
  ADD_TO_CART: 'Added to cart.',
  UPDATE_CART: 'Cart updated.',
  REMOVE_FROM_CART: 'Removed from cart.',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  WISHLIST_ADDED: 'Added to wishlist.',
  WISHLIST_REMOVED: 'Removed from wishlist.',
};
