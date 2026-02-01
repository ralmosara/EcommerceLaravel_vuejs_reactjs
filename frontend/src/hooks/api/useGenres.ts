import { useQuery } from '@tanstack/react-query';
import { genresApi } from '@/api/endpoints/genres';
import type { Genre, PaginatedResponse } from '@/api/types';
import { queryKeys } from '@/utils/queryKeys';

interface UseGenresParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export function useGenres(params?: UseGenresParams) {
  return useQuery<PaginatedResponse<Genre>>({
    queryKey: queryKeys.genres.list(params?.page),
    queryFn: () => genresApi.getGenres(params),
    staleTime: 1000 * 60 * 10, // 10 minutes - genres rarely change
  });
}

export function useAllGenres() {
  return useQuery<PaginatedResponse<Genre>>({
    queryKey: [...queryKeys.genres.all, 'all'],
    queryFn: () => genresApi.getGenres({ per_page: 100 }),
    staleTime: 1000 * 60 * 10,
  });
}

export function useGenre(slug: string) {
  return useQuery<Genre>({
    queryKey: queryKeys.genres.detail(slug),
    queryFn: () => genresApi.getGenre(slug),
    enabled: !!slug,
  });
}
