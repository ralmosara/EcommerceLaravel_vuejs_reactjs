import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { ordersApi } from '@/api/endpoints/orders';
import type { Order, CreateOrderInput, OrderFilters, PaginatedResponse } from '@/api/types';

/**
 * Query keys for orders
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...orderKeys.details(), uuid] as const,
};

/**
 * Hook to fetch user's orders
 */
export function useOrders(filters?: OrderFilters): UseQueryResult<PaginatedResponse<Order>, Error> {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersApi.getOrders(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch single order
 */
export function useOrder(uuid: string): UseQueryResult<Order, Error> {
  return useQuery({
    queryKey: orderKeys.detail(uuid),
    queryFn: () => ordersApi.getOrder(uuid),
    enabled: !!uuid,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create order
 */
export function useCreateOrder(): UseMutationResult<Order, Error, CreateOrderInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * Hook to cancel order
 */
export function useCancelOrder(): UseMutationResult<Order, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => ordersApi.cancelOrder(uuid),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(uuid) });
    },
  });
}
