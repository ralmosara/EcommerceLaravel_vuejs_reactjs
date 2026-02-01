// Price formatting
export function formatPrice(price: number | null | undefined, currency: string = 'USD'): string {
  const numericPrice = Number(price) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(numericPrice)
}

// Date formatting
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj)
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(dateObj)
}

// Format album format enum to readable string
export function formatAlbumFormat(format: string): string {
  const formats: Record<string, string> = {
    'VINYL': 'Vinyl LP',
    'CD': 'CD',
    'CASSETTE': 'Cassette',
    'DIGITAL': 'Digital Download'
  }
  return formats[format] || format
}

// Format order status
export function formatOrderStatus(status: string): string {
  const statuses: Record<string, string> = {
    'PENDING': 'Pending Payment',
    'PROCESSING': 'Processing',
    'SHIPPED': 'Shipped',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled',
    'REFUNDED': 'Refunded'
  }
  return statuses[status] || status
}

// Truncate text
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
