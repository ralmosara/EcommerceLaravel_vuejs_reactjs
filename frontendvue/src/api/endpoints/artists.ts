import apiClient from '../client'
import type { Artist } from '../types/models'

export const artistsApi = {
  async getArtists(): Promise<Artist[]> {
    const { data } = await apiClient.get<{ data: Artist[] }>('/artists')
    return data.data  // Extract nested data property from Laravel response
  },

  async getArtistBySlug(slug: string): Promise<Artist> {
    const { data } = await apiClient.get<{ data: Artist }>(`/artists/${slug}`)
    return data.data  // Extract nested data property from Laravel response
  }
}
