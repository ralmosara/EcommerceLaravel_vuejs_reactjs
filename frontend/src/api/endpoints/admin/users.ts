import axiosInstance, { unwrapResponse } from '../../axios.config';
import type { User, UserFilters, UserRole, PaginatedResponse, ApiResponse } from '../../types';

export interface UserStatistics {
  total_users: number;
  total_customers: number;
  total_admins: number;
  new_users_this_month: number;
}

export const adminUsersApi = {
  /**
   * Get paginated list of users
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', {
      params: filters,
    });
    return unwrapResponse(response);
  },

  /**
   * Get user by UUID
   */
  async getUser(uuid: string): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(`/admin/users/${uuid}`);
    return unwrapResponse(response);
  },

  /**
   * Update user role
   */
  async updateRole(uuid: string, role: UserRole): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(`/admin/users/${uuid}/role`, { role });
    return unwrapResponse(response);
  },

  /**
   * Delete user
   */
  async deleteUser(uuid: string): Promise<void> {
    await axiosInstance.delete(`/admin/users/${uuid}`);
  },

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<UserStatistics> {
    const response = await axiosInstance.get<ApiResponse<UserStatistics>>('/admin/users/statistics');
    return unwrapResponse(response);
  },
};
