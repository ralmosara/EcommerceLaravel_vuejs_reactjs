import apiClient from '../client'
import type { LoginResponse, RegisterResponse } from '../types/responses'
import type { User } from '../types/models'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  password?: string
  password_confirmation?: string
  current_password?: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post<{ data: LoginResponse }>('/auth/login', credentials)
    return data.data  // Extract nested data property from Laravel response
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    const { data } = await apiClient.post<{ data: RegisterResponse }>('/auth/register', userData)
    return data.data  // Extract nested data property from Laravel response
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<{ data: User }>('/auth/me')
    return data.data  // Extract nested data property from Laravel response
  },

  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    const { data } = await apiClient.put<{ data: User }>('/auth/me', profileData)
    return data.data  // Extract nested data property from Laravel response
  }
}
