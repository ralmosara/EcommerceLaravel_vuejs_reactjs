import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrdersApi } from '@/api/endpoints/admin/orders';
import type { OrderFilters } from '@/api/types';
import { OrderStatus } from '@/api/types';
import toast from 'react-hot-toast';

export function useAdminOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => adminOrdersApi.getOrders(filters),
  });
}

export function useAdminOrderStatistics() {
  return useQuery({
    queryKey: ['admin', 'orders', 'statistics'],
    queryFn: () => adminOrdersApi.getStatistics(),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderUuid, status }: { orderUuid: string; status: OrderStatus }) =>
      adminOrdersApi.updateStatus(orderUuid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
}
