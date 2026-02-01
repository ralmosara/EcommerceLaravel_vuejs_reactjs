import axiosInstance, { unwrapResponse } from '../../axios.config';
import type { DashboardStats, SalesChartData, RecentActivity, ApiResponse } from '../../types';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return unwrapResponse(response);
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<RecentActivity[]> {
    const response = await axiosInstance.get<ApiResponse<RecentActivity[]>>('/admin/dashboard/activity');
    return unwrapResponse(response);
  },

  /**
   * Get sales chart data
   */
  async getSalesChart(period?: 'week' | 'month' | 'year'): Promise<SalesChartData> {
    const url = period ? `/admin/dashboard/sales-chart/${period}` : '/admin/dashboard/sales-chart';
    const response = await axiosInstance.get<ApiResponse<SalesChartData>>(url);
    return unwrapResponse(response);
  },
};
