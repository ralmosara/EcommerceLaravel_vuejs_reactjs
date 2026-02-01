import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/endpoints/admin/dashboard';
import { adminInventoryApi } from '@/api/endpoints/admin/inventory';

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });
}

export function useAdminRecentActivity() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'activity'],
    queryFn: () => dashboardApi.getRecentActivity(),
  });
}

export function useAdminSalesChart(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'sales-chart', period],
    queryFn: () => dashboardApi.getSalesChart(period),
  });
}

export function useAdminLowStockAlerts() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: () => adminInventoryApi.getLowStockAlerts(),
  });
}
