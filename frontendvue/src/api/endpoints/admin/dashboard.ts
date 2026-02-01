import apiClient from '../../client'
import type { DashboardStats, SalesChartData, RecentActivity } from '../../types/models'

export type ChartPeriod = 'week' | 'month' | 'year'

export const adminDashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<{ data: DashboardStats }>('/admin/dashboard/stats')
    return data.data
  },

  async getSalesChart(period: ChartPeriod = 'month'): Promise<SalesChartData[]> {
    const { data } = await apiClient.get<{ data: SalesChartData[] }>(
      `/admin/dashboard/sales-chart/${period}`
    )
    return data.data
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const { data } = await apiClient.get<{ data: RecentActivity[] }>('/admin/dashboard/activity')
    return data.data
  },
}
