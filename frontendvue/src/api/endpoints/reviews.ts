import apiClient from '../client'
import type { Review, PaginatedResponse } from '../types/models'

export interface ReviewInput {
  rating: number
  title?: string
  body?: string
}

export const reviewsApi = {
  async getAlbumReviews(albumSlug: string, page?: number): Promise<PaginatedResponse<Review>> {
    const { data } = await apiClient.get<{ data: PaginatedResponse<Review> }>(
      `/albums/${albumSlug}/reviews`,
      { params: { page } }
    )
    return data.data
  },

  async getMyReviews(): Promise<Review[]> {
    const { data } = await apiClient.get<{ data: Review[] }>('/reviews')
    return data.data
  },

  async createReview(albumSlug: string, input: ReviewInput): Promise<Review> {
    const { data } = await apiClient.post<{ data: Review }>(
      `/albums/${albumSlug}/reviews`,
      input
    )
    return data.data
  },

  async updateReview(albumSlug: string, input: ReviewInput): Promise<Review> {
    const { data } = await apiClient.put<{ data: Review }>(
      `/albums/${albumSlug}/reviews`,
      input
    )
    return data.data
  },

  async deleteReview(albumSlug: string): Promise<void> {
    await apiClient.delete(`/albums/${albumSlug}/reviews`)
  },
}
