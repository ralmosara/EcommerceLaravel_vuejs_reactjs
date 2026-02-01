import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/api/endpoints/search';
import type { SearchSuggestion, SearchResults } from '@/api/endpoints/search';
import { queryKeys } from '@/utils/queryKeys';

export function useSearchSuggestions(query: string, enabled: boolean = true) {
  return useQuery<SearchSuggestion[]>({
    queryKey: queryKeys.search.suggestions(query),
    queryFn: () => searchApi.getSuggestions(query),
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSearch(query: string, enabled: boolean = true) {
  return useQuery<SearchResults>({
    queryKey: queryKeys.search.results(query),
    queryFn: () => searchApi.search(query),
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
