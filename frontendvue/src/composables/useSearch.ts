import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { searchApi } from '@/api/endpoints/search'
import type { SearchResults, SearchSuggestion } from '@/api/endpoints/search'

export function useSearch() {
  const query = ref('')
  const results = ref<SearchResults | null>(null)
  const suggestions = ref<SearchSuggestion[]>([])
  const isSearching = ref(false)
  const showSuggestions = ref(false)

  const hasResults = computed(() => {
    return results.value && (
      results.value.albums.length > 0 ||
      results.value.artists.length > 0
    )
  })

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      results.value = null
      return
    }

    try {
      isSearching.value = true
      const data = await searchApi.globalSearch(searchQuery.trim())
      results.value = data
    } catch (error) {
      console.error('Search error:', error)
      results.value = null
    } finally {
      isSearching.value = false
    }
  }

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      suggestions.value = []
      showSuggestions.value = false
      return
    }

    try {
      const data = await searchApi.getSuggestions(searchQuery.trim())
      suggestions.value = data
      showSuggestions.value = data.length > 0
    } catch (error) {
      console.error('Suggestions error:', error)
      suggestions.value = []
      showSuggestions.value = false
    }
  }

  // Debounced search for suggestions (300ms delay)
  const debouncedSuggestions = useDebounceFn((searchQuery: string) => {
    fetchSuggestions(searchQuery)
  }, 300)

  const clearSearch = () => {
    query.value = ''
    results.value = null
    suggestions.value = []
    showSuggestions.value = false
  }

  const hideSuggestions = () => {
    showSuggestions.value = false
  }

  return {
    query,
    results,
    suggestions,
    isSearching,
    showSuggestions,
    hasResults,
    performSearch,
    fetchSuggestions: debouncedSuggestions,
    clearSearch,
    hideSuggestions
  }
}
