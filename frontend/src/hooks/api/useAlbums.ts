import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { albumsApi } from '@/api/endpoints/albums';
import type { Album, AlbumFilters, PaginatedResponse } from '@/api/types';

/**
 * Query keys for albums
 */
export const albumsKeys = {
  all: ['albums'] as const,
  lists: () => [...albumsKeys.all, 'list'] as const,
  list: (filters?: AlbumFilters) => [...albumsKeys.lists(), filters] as const,
  details: () => [...albumsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...albumsKeys.details(), slug] as const,
  featured: () => [...albumsKeys.all, 'featured'] as const,
  onSale: () => [...albumsKeys.all, 'on-sale'] as const,
  newReleases: () => [...albumsKeys.all, 'new-releases'] as const,
};

/**
 * Hook to fetch albums with optional filters
 */
export function useAlbums(
  filters?: AlbumFilters
): UseQueryResult<PaginatedResponse<Album>, Error> {
  return useQuery({
    queryKey: albumsKeys.list(filters),
    queryFn: () => albumsApi.getAlbums(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single album by slug
 */
export function useAlbum(slug: string): UseQueryResult<Album, Error> {
  return useQuery({
    queryKey: albumsKeys.detail(slug),
    queryFn: () => albumsApi.getAlbum(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch featured albums
 */
export function useFeaturedAlbums(): UseQueryResult<PaginatedResponse<Album>, Error> {
  return useQuery({
    queryKey: albumsKeys.featured(),
    queryFn: () => albumsApi.getFeaturedAlbums(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch albums on sale
 */
export function useOnSaleAlbums(): UseQueryResult<PaginatedResponse<Album>, Error> {
  return useQuery({
    queryKey: albumsKeys.onSale(),
    queryFn: () => albumsApi.getOnSaleAlbums(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch new releases
 */
export function useNewReleases(): UseQueryResult<PaginatedResponse<Album>, Error> {
  return useQuery({
    queryKey: albumsKeys.newReleases(),
    queryFn: () => albumsApi.getNewReleases(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
