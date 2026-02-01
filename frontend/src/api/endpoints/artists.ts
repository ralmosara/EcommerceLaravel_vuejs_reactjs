import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Artist, ArtistInput, PaginatedResponse, ApiResponse } from '../types';

export const artistsApi = {
  /**
   * Get paginated list of artists
   */
  async getArtists(params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Artist>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Artist>>>('/artists', {
      params,
    });
    return unwrapResponse(response);
  },

  /**
   * Get artist by slug
   */
  async getArtist(slug: string): Promise<Artist> {
    const response = await axiosInstance.get<ApiResponse<Artist>>(`/artists/${slug}`);
    return unwrapResponse(response);
  },

  /**
   * Create a new artist (Admin)
   */
  async createArtist(data: ArtistInput): Promise<Artist> {
    const response = await axiosInstance.post<ApiResponse<Artist>>('/admin/artists', data);
    return unwrapResponse(response);
  },

  /**
   * Update an artist (Admin)
   */
  async updateArtist(slug: string, data: ArtistInput): Promise<Artist> {
    const response = await axiosInstance.put<ApiResponse<Artist>>(`/admin/artists/${slug}`, data);
    return unwrapResponse(response);
  },

  /**
   * Delete an artist (Admin)
   */
  async deleteArtist(slug: string): Promise<void> {
    await axiosInstance.delete(`/admin/artists/${slug}`);
  },
};
