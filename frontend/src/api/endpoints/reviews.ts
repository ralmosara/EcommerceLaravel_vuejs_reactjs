import axiosInstance, { unwrapResponse } from '../axios.config';
import type { Review, ReviewInput, PaginatedResponse, ApiResponse } from '../types';

export const reviewsApi = {
  /**
   * Get reviews for an album
   */
  async getAlbumReviews(albumSlug: string, page?: number): Promise<PaginatedResponse<Review>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Review>>>(
      `/albums/${albumSlug}/reviews`,
      { params: { page } }
    );
    return unwrapResponse(response);
  },

  /**
   * Get my reviews
   */
  async getMyReviews(): Promise<Review[]> {
    const response = await axiosInstance.get<ApiResponse<Review[]>>('/reviews');
    return unwrapResponse(response);
  },

  /**
   * Create review for album
   */
  async createReview(albumSlug: string, data: ReviewInput): Promise<Review> {
    const response = await axiosInstance.post<ApiResponse<Review>>(
      `/albums/${albumSlug}/reviews`,
      data
    );
    return unwrapResponse(response);
  },

  /**
   * Update my review for album
   */
  async updateReview(albumSlug: string, data: ReviewInput): Promise<Review> {
    const response = await axiosInstance.put<ApiResponse<Review>>(
      `/albums/${albumSlug}/reviews`,
      data
    );
    return unwrapResponse(response);
  },

  /**
   * Delete my review for album
   */
  async deleteReview(albumSlug: string): Promise<void> {
    await axiosInstance.delete(`/albums/${albumSlug}/reviews`);
  },
};
