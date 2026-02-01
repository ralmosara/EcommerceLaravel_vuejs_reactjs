import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format currency value
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Format date string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date and time string
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format track duration (e.g., "3:45" or "1:23:45")
 */
export function formatDuration(duration: string): string {
  // Duration comes from backend as HH:MM:SS or MM:SS
  return duration;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Basic formatting - can be enhanced based on locale
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Format order number
 */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format rating (e.g., "4.5")
 */
export function formatRating(rating: number, decimals: number = 1): string {
  return rating.toFixed(decimals);
}

/**
 * Format discount amount
 */
export function formatDiscount(type: 'percentage' | 'fixed', value: number): string {
  if (type === 'percentage') {
    return `-${value}%`;
  }
  return `-${formatPrice(value)}`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert slug to title case
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Mask card number (show only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

/**
 * Format expiry date
 */
export function formatExpiryDate(month: string, year: string): string {
  return `${month.padStart(2, '0')}/${year.slice(-2)}`;
}
