import apiClient from '../client'
import type { Order, PaginatedResponse } from '../types/models'

export interface ShippingAddress {
  full_name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
}

export interface CreateOrderData {
  shipping_address: ShippingAddress
  billing_address?: ShippingAddress
  shipping_method?: string
  customer_notes?: string
}

export const ordersApi = {
  async getOrders(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Order> }>('/orders', {
      params: { page, per_page: perPage }
    })
    return data.data  // Extract nested data property from Laravel response
  },

  async getOrderByUuid(uuid: string): Promise<Order> {
    const { data } = await apiClient.get<{ data: Order }>(`/orders/${uuid}`)
    return data.data  // Extract nested data property from Laravel response
  },

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const { data } = await apiClient.post<{ data: Order }>('/orders', orderData)
    return data.data  // Extract nested data property from Laravel response
  },

  async cancelOrder(uuid: string): Promise<Order> {
    const { data } = await apiClient.post<{ data: Order }>(`/orders/${uuid}/cancel`)
    return data.data  // Extract nested data property from Laravel response
  }
}
