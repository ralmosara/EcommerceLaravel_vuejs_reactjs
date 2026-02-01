import type { AlbumFilters, OrderFilters, UserFilters, InventoryFilters } from '@/api/types/models'

export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Albums
  albums: {
    all: ['albums'] as const,
    lists: () => [...queryKeys.albums.all, 'list'] as const,
    list: (filters?: AlbumFilters) => [...queryKeys.albums.lists(), filters] as const,
    details: () => [...queryKeys.albums.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.albums.details(), slug] as const,
    featured: ['albums', 'featured'] as const,
    onSale: ['albums', 'on-sale'] as const,
    newReleases: ['albums', 'new-releases'] as const,
  },

  // Artists
  artists: {
    all: ['artists'] as const,
    lists: () => [...queryKeys.artists.all, 'list'] as const,
    list: (page?: number) => [...queryKeys.artists.lists(), page] as const,
    details: () => [...queryKeys.artists.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.artists.details(), slug] as const,
  },

  // Genres
  genres: {
    all: ['genres'] as const,
    lists: () => [...queryKeys.genres.all, 'list'] as const,
    list: (page?: number) => [...queryKeys.genres.lists(), page] as const,
    details: () => [...queryKeys.genres.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.genres.details(), slug] as const,
  },

  // Cart
  cart: {
    all: ['cart'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters?: OrderFilters) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.orders.details(), uuid] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    album: (albumSlug: string) => ['reviews', 'album', albumSlug] as const,
    my: ['reviews', 'my'] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
    check: (albumSlug: string) => ['wishlist', 'check', albumSlug] as const,
  },

  // Search
  search: {
    all: ['search'] as const,
    query: (q: string) => [...queryKeys.search.all, q] as const,
    results: (q: string) => ['search', 'results', q] as const,
    albums: (q: string) => ['search', 'albums', q] as const,
    artists: (q: string) => ['search', 'artists', q] as const,
    suggestions: (q: string) => ['search', 'suggestions', q] as const,
  },

  // Payments
  payments: {
    order: (orderUuid: string) => ['payments', 'order', orderUuid] as const,
  },

  // Admin - Dashboard
  admin: {
    dashboard: {
      stats: ['admin', 'dashboard', 'stats'] as const,
      salesChart: (period: string) => ['admin', 'dashboard', 'sales-chart', period] as const,
      activity: ['admin', 'dashboard', 'activity'] as const,
    },

    // Admin - Orders
    orders: {
      all: ['admin', 'orders'] as const,
      lists: () => [...queryKeys.admin.orders.all, 'list'] as const,
      list: (filters?: OrderFilters) => [...queryKeys.admin.orders.lists(), filters] as const,
      stats: ['admin', 'orders', 'statistics'] as const,
    },

    // Admin - Users
    users: {
      all: ['admin', 'users'] as const,
      lists: () => [...queryKeys.admin.users.all, 'list'] as const,
      list: (filters?: UserFilters) => [...queryKeys.admin.users.lists(), filters] as const,
      details: () => [...queryKeys.admin.users.all, 'detail'] as const,
      detail: (uuid: string) => [...queryKeys.admin.users.details(), uuid] as const,
      stats: ['admin', 'users', 'statistics'] as const,
    },

    // Admin - Inventory
    inventory: {
      all: ['admin', 'inventory'] as const,
      lists: () => [...queryKeys.admin.inventory.all, 'list'] as const,
      list: (filters?: InventoryFilters) => [...queryKeys.admin.inventory.lists(), filters] as const,
      lowStock: ['admin', 'inventory', 'low-stock'] as const,
      outOfStock: ['admin', 'inventory', 'out-of-stock'] as const,
      stats: ['admin', 'inventory', 'statistics'] as const,
    },
  },
} as const
