import apiClient from '../client'
import type { Genre } from '../types/models'

export const genresApi = {
  async getGenres(): Promise<Genre[]> {
    const { data } = await apiClient.get<{ data: Genre[] }>('/genres')
    return data.data  // Extract nested data property from Laravel response
  },

  async getGenreBySlug(slug: string): Promise<Genre> {
    const { data } = await apiClient.get<{ data: Genre }>(`/genres/${slug}`)
    return data.data  // Extract nested data property from Laravel response
  }
}
