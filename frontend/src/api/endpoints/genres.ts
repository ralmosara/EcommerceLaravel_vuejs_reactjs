import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Genre, GenreInput, PaginatedResponse, ApiResponse } from '../types';

export const genresApi = {
  /**
   * Get paginated list of genres
   */
  async getGenres(params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Genre>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Genre>>>('/genres', {
      params,
    });
    return unwrapResponse(response);
  },

  /**
   * Get genre by slug
   */
  async getGenre(slug: string): Promise<Genre> {
    const response = await axiosInstance.get<ApiResponse<Genre>>(`/genres/${slug}`);
    return unwrapResponse(response);
  },

  /**
   * Create a new genre (Admin)
   */
  async createGenre(data: GenreInput): Promise<Genre> {
    const response = await axiosInstance.post<ApiResponse<Genre>>('/admin/genres', data);
    return unwrapResponse(response);
  },

  /**
   * Update a genre (Admin)
   */
  async updateGenre(slug: string, data: GenreInput): Promise<Genre> {
    const response = await axiosInstance.put<ApiResponse<Genre>>(`/admin/genres/${slug}`, data);
    return unwrapResponse(response);
  },

  /**
   * Delete a genre (Admin)
   */
  async deleteGenre(slug: string): Promise<void> {
    await axiosInstance.delete(`/admin/genres/${slug}`);
  },
};
