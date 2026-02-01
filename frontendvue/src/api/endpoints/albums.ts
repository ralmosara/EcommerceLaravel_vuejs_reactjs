import apiClient from '../client'
import type { Album, PaginatedResponse } from '../types/models'

export interface AlbumsQueryParams {
  page?: number
  per_page?: number
  genre?: string
  format?: string
  min_price?: number
  max_price?: number
  sort?: 'price_asc' | 'price_desc' | 'title' | 'newest' | 'rating' | ''
  search?: string
}

export const albumsApi = {
  async getAlbums(params?: AlbumsQueryParams): Promise<PaginatedResponse<Album>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Album> }>('/albums', { params })
    return data.data  // Extract nested data property from Laravel response
  },

  async getFeaturedAlbums(): Promise<Album[]> {
    const { data } = await apiClient.get<{ data: Album[] }>('/albums/featured')
    return data.data  // Extract nested data property from Laravel response
  },

  async getOnSaleAlbums(): Promise<Album[]> {
    const { data } = await apiClient.get<{ data: Album[] }>('/albums/on-sale')
    return data.data  // Extract nested data property from Laravel response
  },

  async getNewReleases(): Promise<Album[]> {
    const { data } = await apiClient.get<{ data: Album[] }>('/albums/new-releases')
    return data.data  // Extract nested data property from Laravel response
  },

  async getAlbumBySlug(slug: string): Promise<Album> {
    const { data } = await apiClient.get<{ data: Album }>(`/albums/${slug}`)
    return data.data  // Extract nested data property from Laravel response
  }
}
