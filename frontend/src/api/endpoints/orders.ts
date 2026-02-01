import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Order, CreateOrderInput, OrderFilters, PaginatedResponse, ApiResponse } from '../types';

export const ordersApi = {
  /**
   * Get user's orders
   */
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Order>>>('/orders', {
      params: filters,
    });
    return unwrapResponse(response);
  },

  /**
   * Get order by UUID
   */
  async getOrder(uuid: string): Promise<Order> {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${uuid}`);
    return unwrapResponse(response);
  },

  /**
   * Create order from cart
   */
  async createOrder(data: CreateOrderInput): Promise<Order> {
    const response = await axiosInstance.post<ApiResponse<Order>>('/orders', data);
    return unwrapResponse(response);
  },

  /**
   * Cancel order
   */
  async cancelOrder(uuid: string): Promise<Order> {
    const response = await axiosInstance.post<ApiResponse<Order>>(`/orders/${uuid}/cancel`);
    return unwrapResponse(response);
  },
};
