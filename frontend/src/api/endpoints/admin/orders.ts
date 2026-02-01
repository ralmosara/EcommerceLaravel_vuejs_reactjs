import axiosInstance, { unwrapResponse } from '../../axios.config';
import type { Order, OrderStatus, OrderFilters, PaginatedResponse, ApiResponse } from '../../types';

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
}

export const adminOrdersApi = {
  /**
   * Get paginated list of orders
   */
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Order>>>('/admin/orders', {
      params: filters,
    });
    return unwrapResponse(response);
  },

  /**
   * Update order status
   */
  async updateStatus(orderUuid: string, status: OrderStatus): Promise<Order> {
    const response = await axiosInstance.put<ApiResponse<Order>>(`/admin/orders/${orderUuid}/status`, { status });
    return unwrapResponse(response);
  },

  /**
   * Get order statistics
   */
  async getStatistics(): Promise<OrderStatistics> {
    const response = await axiosInstance.get<ApiResponse<OrderStatistics>>('/admin/orders/statistics');
    return unwrapResponse(response);
  },
};
