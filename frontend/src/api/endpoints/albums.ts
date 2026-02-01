import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Album, AlbumFilters, AlbumInput, PaginatedResponse, ApiResponse } from '../types';

export const albumsApi = {
  /**
   * Get paginated list of albums
   */
  async getAlbums(filters?: AlbumFilters): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/albums', {
      params: filters,
    });
    return unwrapResponse(response);
  },

  /**
   * Get album by slug
   */
  async getAlbum(slug: string): Promise<Album> {
    const response = await axiosInstance.get<ApiResponse<Album>>(`/albums/${slug}`);
    return unwrapResponse(response);
  },

  /**
   * Get featured albums
   */
  async getFeaturedAlbums(): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/albums/featured');
    return unwrapResponse(response);
  },

  /**
   * Get albums on sale
   */
  async getOnSaleAlbums(): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/albums/on-sale');
    return unwrapResponse(response);
  },

  /**
   * Get new releases
   */
  async getNewReleases(): Promise<PaginatedResponse<Album>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Album>>>('/albums/new-releases');
    return unwrapResponse(response);
  },

  /**
   * Create a new album (Admin)
   */
  async createAlbum(data: AlbumInput): Promise<Album> {
    const response = await axiosInstance.post<ApiResponse<Album>>('/admin/albums', data);
    return unwrapResponse(response);
  },

  /**
   * Update an album (Admin)
   */
  async updateAlbum(slug: string, data: AlbumInput): Promise<Album> {
    const response = await axiosInstance.put<ApiResponse<Album>>(`/admin/albums/${slug}`, data);
    return unwrapResponse(response);
  },

  /**
   * Delete an album (Admin)
   */
  async deleteAlbum(slug: string): Promise<void> {
    await axiosInstance.delete(`/admin/albums/${slug}`);
  },
};
