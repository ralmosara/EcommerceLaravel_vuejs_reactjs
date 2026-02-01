import axiosInstance, { unwrapResponse } from '../../axios.config';
import type { Album, InventoryFilters, PaginatedResponse, ApiResponse } from '../../types';

export interface InventoryStatistics {
  total_albums: number;
  total_stock: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_inventory_value: number;
}

export interface UpdateStockInput {
  quantity: number;
}

export interface AddStockInput {
  quantity: number;
}

export const adminInventoryApi = {
  /**
   * Get paginated list of inventory
   */
  async getInventory(filters?: InventoryFilters): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/admin/inventory', {
      params: filters,
    });
    return unwrapResponse(response);
  },

  /**
   * Update stock quantity
   */
  async updateStock(albumSlug: string, data: UpdateStockInput): Promise<Album> {
    const response = await axiosInstance.put<ApiResponse<Album>>(`/admin/inventory/${albumSlug}/stock`, data);
    return unwrapResponse(response);
  },

  /**
   * Add stock quantity
   */
  async addStock(albumSlug: string, data: AddStockInput): Promise<Album> {
    const response = await axiosInstance.post<ApiResponse<Album>>(`/admin/inventory/${albumSlug}/add-stock`, data);
    return unwrapResponse(response);
  },

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/admin/inventory/low-stock');
    return unwrapResponse(response);
  },

  /**
   * Get out of stock items
   */
  async getOutOfStock(): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/admin/inventory/out-of-stock');
    return unwrapResponse(response);
  },

  /**
   * Get inventory statistics
   */
  async getStatistics(): Promise<InventoryStatistics> {
    const response = await axiosInstance.get<ApiResponse<InventoryStatistics>>('/admin/inventory/statistics');
    return unwrapResponse(response);
  },
};
