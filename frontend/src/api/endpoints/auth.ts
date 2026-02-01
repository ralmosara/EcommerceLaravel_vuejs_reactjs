import axiosInstance, { unwrapResponse } from '../axios.config';
import type { User, RegisterInput, LoginInput, ApiResponse } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<RegisterResponse> {
    const response = await axiosInstance.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return unwrapResponse(response);
  },

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return unwrapResponse(response);
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return unwrapResponse(response);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>('/auth/me', data);
    return unwrapResponse(response);
  },
};
