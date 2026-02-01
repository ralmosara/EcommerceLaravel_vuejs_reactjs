import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Album, Artist, ApiResponse } from '../types';

export interface SearchResults {
  albums: Album[];
  artists: Artist[];
}

export interface SearchSuggestion {
  type: 'album' | 'artist';
  id: string;
  name: string;
  slug: string;
}

export const searchApi = {
  /**
   * Search for albums and artists
   */
  async search(query: string): Promise<SearchResults> {
    const response = await axiosInstance.get<ApiResponse<SearchResults>>('/search', {
      params: { q: query },
    });
    return unwrapResponse(response);
  },

  /**
   * Search albums only
   */
  async searchAlbums(query: string): Promise<Album[]> {
    const response = await axiosInstance.get<ApiResponse<Album[]>>('/search/albums', {
      params: { q: query },
    });
    return unwrapResponse(response);
  },

  /**
   * Search artists only
   */
  async searchArtists(query: string): Promise<Artist[]> {
    const response = await axiosInstance.get<ApiResponse<Artist[]>>('/search/artists', {
      params: { q: query },
    });
    return unwrapResponse(response);
  },

  /**
   * Get search suggestions for autocomplete
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const response = await axiosInstance.get<ApiResponse<SearchSuggestion[]>>('/search/suggestions', {
      params: { q: query },
    });
    return unwrapResponse(response);
  },
};
