import apiClient from '../client'
import type { Cart } from '../types/models'

export interface AddToCartData {
  album_id: string
  quantity?: number
}

export interface UpdateCartItemData {
  quantity: number
}

export interface ApplyCouponData {
  code: string
}

export const cartApi = {
  async getCart(): Promise<Cart> {
    const { data } = await apiClient.get<{ data: Cart }>('/cart')
    return data.data  // Extract nested data property from Laravel response
  },

  async addItem(itemData: AddToCartData): Promise<Cart> {
    const { data } = await apiClient.post<{ data: Cart }>('/cart/items', itemData)
    return data.data  // Extract nested data property from Laravel response
  },

  async updateItem(albumUuid: string, itemData: UpdateCartItemData): Promise<Cart> {
    const { data } = await apiClient.put<{ data: Cart }>(`/cart/items/${albumUuid}`, itemData)
    return data.data  // Extract nested data property from Laravel response
  },

  async removeItem(albumUuid: string): Promise<Cart> {
    const { data } = await apiClient.delete<{ data: Cart }>(`/cart/items/${albumUuid}`)
    return data.data  // Extract nested data property from Laravel response
  },

  async clearCart(): Promise<Cart> {
    const { data } = await apiClient.delete<{ data: Cart }>('/cart')
    return data.data  // Extract nested data property from Laravel response
  },

  async applyCoupon(couponData: ApplyCouponData): Promise<Cart> {
    const { data } = await apiClient.post<{ data: Cart }>('/cart/coupon', couponData)
    return data.data  // Extract nested data property from Laravel response
  },

  async removeCoupon(): Promise<Cart> {
    const { data } = await apiClient.delete<{ data: Cart }>('/cart/coupon')
    return data.data  // Extract nested data property from Laravel response
  }
}
