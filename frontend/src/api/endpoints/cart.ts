import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Cart, AddToCartInput, UpdateCartItemInput, ApplyCouponInput, ApiResponse } from '../types';

export const cartApi = {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    const response = await axiosInstance.get<ApiResponse<Cart>>('/cart');
    return unwrapResponse(response);
  },

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartInput): Promise<Cart> {
    const response = await axiosInstance.post<ApiResponse<Cart>>('/cart/items', data);
    return unwrapResponse(response);
  },

  /**
   * Update cart item quantity
   */
  async updateItem(albumId: string, data: UpdateCartItemInput): Promise<Cart> {
    const response = await axiosInstance.put<ApiResponse<Cart>>(`/cart/items/${albumId}`, data);
    return unwrapResponse(response);
  },

  /**
   * Remove item from cart
   */
  async removeItem(albumId: string): Promise<Cart> {
    const response = await axiosInstance.delete<ApiResponse<Cart>>(`/cart/items/${albumId}`);
    return unwrapResponse(response);
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    await axiosInstance.delete('/cart');
  },

  /**
   * Apply coupon to cart
   */
  async applyCoupon(data: ApplyCouponInput): Promise<Cart> {
    const response = await axiosInstance.post<ApiResponse<Cart>>('/cart/coupon', data);
    return unwrapResponse(response);
  },

  /**
   * Remove coupon from cart
   */
  async removeCoupon(): Promise<Cart> {
    const response = await axiosInstance.delete<ApiResponse<Cart>>('/cart/coupon');
    return unwrapResponse(response);
  },
};
