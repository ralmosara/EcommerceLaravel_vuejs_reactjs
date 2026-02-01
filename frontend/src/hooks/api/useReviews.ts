import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { reviewsApi } from '@/api/endpoints/reviews';
import type { Review, ReviewInput, PaginatedResponse } from '@/api/types';
import { albumsKeys } from './useAlbums';

/**
 * Query keys for reviews
 */
export const reviewsKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsKeys.all, 'list'] as const,
  list: (albumSlug: string, page?: number) => [...reviewsKeys.lists(), albumSlug, page] as const,
  myReviews: () => [...reviewsKeys.all, 'my-reviews'] as const,
};

/**
 * Hook to fetch reviews for an album
 */
export function useAlbumReviews(
  albumSlug: string,
  page?: number
): UseQueryResult<PaginatedResponse<Review>, Error> {
  return useQuery({
    queryKey: reviewsKeys.list(albumSlug, page),
    queryFn: () => reviewsApi.getAlbumReviews(albumSlug, page),
    enabled: !!albumSlug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch user's own reviews
 */
export function useMyReviews(): UseQueryResult<Review[], Error> {
  return useQuery({
    queryKey: reviewsKeys.myReviews(),
    queryFn: () => reviewsApi.getMyReviews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a review
 */
export function useCreateReview(): UseMutationResult<
  Review,
  Error,
  { albumSlug: string; data: ReviewInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumSlug, data }) => reviewsApi.createReview(albumSlug, data),
    onSuccess: (_, variables) => {
      // Invalidate reviews list for the album
      queryClient.invalidateQueries({ queryKey: reviewsKeys.list(variables.albumSlug) });
      // Invalidate album details to update rating
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(variables.albumSlug) });
      // Invalidate user's reviews
      queryClient.invalidateQueries({ queryKey: reviewsKeys.myReviews() });
    },
  });
}

/**
 * Hook to update a review
 */
export function useUpdateReview(): UseMutationResult<
  Review,
  Error,
  { albumSlug: string; data: ReviewInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumSlug, data }) => reviewsApi.updateReview(albumSlug, data),
    onSuccess: (_, variables) => {
      // Invalidate reviews list for the album
      queryClient.invalidateQueries({ queryKey: reviewsKeys.list(variables.albumSlug) });
      // Invalidate album details to update rating
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(variables.albumSlug) });
      // Invalidate user's reviews
      queryClient.invalidateQueries({ queryKey: reviewsKeys.myReviews() });
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumSlug: string) => reviewsApi.deleteReview(albumSlug),
    onSuccess: (_, albumSlug) => {
      // Invalidate reviews list for the album
      queryClient.invalidateQueries({ queryKey: reviewsKeys.list(albumSlug) });
      // Invalidate album details to update rating
      queryClient.invalidateQueries({ queryKey: albumsKeys.detail(albumSlug) });
      // Invalidate user's reviews
      queryClient.invalidateQueries({ queryKey: reviewsKeys.myReviews() });
    },
  });
}
