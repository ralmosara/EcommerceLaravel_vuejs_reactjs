import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { cartApi } from '@/api/endpoints/cart';
import type { Cart, AddToCartInput, UpdateCartItemInput, ApplyCouponInput } from '@/api/types';

/**
 * Query keys for cart
 */
export const cartKeys = {
  all: ['cart'] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch the current cart
 */
export function useCart(): UseQueryResult<Cart, Error> {
  return useQuery({
    queryKey: cartKeys.details(),
    queryFn: () => cartApi.getCart(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to add item to cart
 */
export function useAddToCart(): UseMutationResult<Cart, Error, AddToCartInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartInput) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

/**
 * Hook to update cart item
 */
export function useUpdateCartItem(): UseMutationResult<
  Cart,
  Error,
  { albumId: string; data: UpdateCartItemInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, data }) => cartApi.updateItem(albumId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart(): UseMutationResult<Cart, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: string) => cartApi.removeItem(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

/**
 * Hook to clear cart
 */
export function useClearCart(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

/**
 * Hook to apply coupon to cart
 */
export function useApplyCoupon(): UseMutationResult<Cart, Error, ApplyCouponInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyCouponInput) => cartApi.applyCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}
