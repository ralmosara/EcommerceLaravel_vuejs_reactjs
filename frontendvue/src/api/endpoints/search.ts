import apiClient from '../client'
import type { Album, Artist } from '../types/models'

export interface SearchResults {
  albums: Album[]
  artists: Artist[]
}

export interface SearchSuggestion {
  type: 'album' | 'artist'
  id: string | number
  title: string
  subtitle?: string
  slug: string
}

export const searchApi = {
  async globalSearch(query: string): Promise<SearchResults> {
    const { data } = await apiClient.get<{ data: SearchResults }>('/search', {
      params: { q: query }
    })
    return data.data  // Extract nested data property from Laravel response
  },

  async searchAlbums(query: string): Promise<Album[]> {
    const { data } = await apiClient.get<{ data: Album[] }>('/search/albums', {
      params: { q: query }
    })
    return data.data  // Extract nested data property from Laravel response
  },

  async searchArtists(query: string): Promise<Artist[]> {
    const { data } = await apiClient.get<{ data: Artist[] }>('/search/artists', {
      params: { q: query }
    })
    return data.data  // Extract nested data property from Laravel response
  },

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const { data } = await apiClient.get<{ data: SearchSuggestion[] }>('/search/suggestions', {
      params: { q: query }
    })
    return data.data  // Extract nested data property from Laravel response
  }
}
