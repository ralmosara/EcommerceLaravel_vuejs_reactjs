import axiosInstance, { unwrapResponse } from '../axios.config';
import type { WishlistItem, ApiResponse } from '../types';

export const wishlistApi = {
  /**
   * Get user's wishlist
   */
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await axiosInstance.get<ApiResponse<WishlistItem[]>>('/wishlist');
    return unwrapResponse(response);
  },

  /**
   * Add album to wishlist
   */
  async addToWishlist(albumSlug: string): Promise<WishlistItem> {
    const response = await axiosInstance.post<ApiResponse<WishlistItem>>('/wishlist', {
      album_slug: albumSlug,
    });
    return unwrapResponse(response);
  },

  /**
   * Remove album from wishlist
   */
  async removeFromWishlist(albumSlug: string): Promise<void> {
    await axiosInstance.delete(`/wishlist/${albumSlug}`);
  },

  /**
   * Clear entire wishlist
   */
  async clearWishlist(): Promise<void> {
    await axiosInstance.delete('/wishlist');
  },

  /**
   * Check if album is in wishlist
   */
  async checkInWishlist(albumSlug: string): Promise<boolean> {
    const response = await axiosInstance.get<ApiResponse<{ in_wishlist: boolean }>>(
      `/wishlist/check/${albumSlug}`
    );
    return unwrapResponse(response).in_wishlist;
  },
};
