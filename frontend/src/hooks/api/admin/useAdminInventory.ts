import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminInventoryApi } from '@/api/endpoints/admin/inventory';
import type { UpdateStockInput } from '@/api/endpoints/admin/inventory';
import type { InventoryFilters } from '@/api/types';
import toast from 'react-hot-toast';

export function useAdminInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ['admin', 'inventory', filters],
    queryFn: () => adminInventoryApi.getInventory(filters),
  });
}

export function useAdminInventoryStatistics() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'statistics'],
    queryFn: () => adminInventoryApi.getStatistics(),
  });
}

export function useAdminLowStockAlerts() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: () => adminInventoryApi.getLowStockAlerts(),
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumSlug, data }: { albumSlug: string; data: UpdateStockInput }) =>
      adminInventoryApi.updateStock(albumSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Stock updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update stock');
    },
  });
}
