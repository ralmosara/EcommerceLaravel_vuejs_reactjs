import apiClient from '../client'
import type { WishlistItem } from '../types/models'

export const wishlistApi = {
  async getWishlist(): Promise<WishlistItem[]> {
    const { data } = await apiClient.get<{ data: WishlistItem[] }>('/wishlist')
    return data.data
  },

  async addToWishlist(albumSlug: string): Promise<WishlistItem> {
    const { data } = await apiClient.post<{ data: WishlistItem }>(
      '/wishlist',
      { album_slug: albumSlug }
    )
    return data.data
  },

  async removeFromWishlist(albumSlug: string): Promise<void> {
    await apiClient.delete(`/wishlist/${albumSlug}`)
  },

  async clearWishlist(): Promise<void> {
    await apiClient.delete('/wishlist')
  },

  async checkInWishlist(albumSlug: string): Promise<boolean> {
    try {
      const { data } = await apiClient.get<{ data: { in_wishlist: boolean } }>(
        `/wishlist/check/${albumSlug}`
      )
      return data.data.in_wishlist
    } catch {
      return false
    }
  },
}
