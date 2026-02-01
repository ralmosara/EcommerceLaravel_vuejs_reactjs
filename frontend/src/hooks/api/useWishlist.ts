import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { wishlistApi } from '@/api/endpoints/wishlist';
import type { WishlistItem } from '@/api/types';

/**
 * Query keys for wishlist
 */
export const wishlistKeys = {
  all: ['wishlist'] as const,
  lists: () => [...wishlistKeys.all, 'list'] as const,
  check: (albumSlug: string) => [...wishlistKeys.all, 'check', albumSlug] as const,
};

/**
 * Hook to fetch user's wishlist
 */
export function useWishlist(): UseQueryResult<WishlistItem[], Error> {
  return useQuery({
    queryKey: wishlistKeys.lists(),
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to check if album is in wishlist
 */
export function useCheckInWishlist(albumSlug: string): UseQueryResult<boolean, Error> {
  return useQuery({
    queryKey: wishlistKeys.check(albumSlug),
    queryFn: () => wishlistApi.checkInWishlist(albumSlug),
    enabled: !!albumSlug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to add album to wishlist
 */
export function useAddToWishlist(): UseMutationResult<WishlistItem, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumSlug: string) => wishlistApi.addToWishlist(albumSlug),
    onSuccess: (_, albumSlug) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(albumSlug) });
    },
  });
}

/**
 * Hook to remove album from wishlist
 */
export function useRemoveFromWishlist(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumSlug: string) => wishlistApi.removeFromWishlist(albumSlug),
    onSuccess: (_, albumSlug) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(albumSlug) });
    },
  });
}

/**
 * Hook to clear entire wishlist
 */
export function useClearWishlist(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistApi.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

/**
 * Hook to toggle album in/out of wishlist
 */
export function useToggleWishlist(): UseMutationResult<
  void,
  Error,
  { albumSlug: string; isInWishlist: boolean }
> {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return useMutation({
    mutationFn: async ({ albumSlug, isInWishlist }) => {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(albumSlug);
      } else {
        await addToWishlist.mutateAsync(albumSlug);
      }
    },
  });
}
