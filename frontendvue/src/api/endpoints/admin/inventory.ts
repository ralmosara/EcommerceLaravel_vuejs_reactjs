import apiClient from '../../client'
import type { Album, InventoryFilters, InventoryStatistics, PaginatedResponse } from '../../types/models'

export interface UpdateStockInput {
  quantity: number
}

export interface AddStockInput {
  quantity: number
}

export const adminInventoryApi = {
  /**
   * Get paginated list of inventory
   */
  async getInventory(filters?: InventoryFilters): Promise<PaginatedResponse<Album>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Album> }>('/admin/inventory', {
      params: filters,
    })
    return data.data
  },

  /**
   * Update stock quantity
   */
  async updateStock(albumSlug: string, input: UpdateStockInput): Promise<Album> {
    const { data } = await apiClient.put<{ data: Album }>(
      `/admin/inventory/${albumSlug}/stock`,
      input
    )
    return data.data
  },

  /**
   * Add stock quantity
   */
  async addStock(albumSlug: string, input: AddStockInput): Promise<Album> {
    const { data } = await apiClient.post<{ data: Album }>(
      `/admin/inventory/${albumSlug}/add-stock`,
      input
    )
    return data.data
  },

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<PaginatedResponse<Album>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Album> }>('/admin/inventory/low-stock')
    return data.data
  },

  /**
   * Get out of stock items
   */
  async getOutOfStock(): Promise<PaginatedResponse<Album>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Album> }>('/admin/inventory/out-of-stock')
    return data.data
  },

  /**
   * Get inventory statistics
   */
  async getStatistics(): Promise<InventoryStatistics> {
    const { data } = await apiClient.get<{ data: InventoryStatistics }>('/admin/inventory/statistics')
    return data.data
  },
}
