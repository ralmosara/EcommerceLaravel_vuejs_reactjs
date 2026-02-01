import type { User } from './models'

// Auth Responses
export interface LoginResponse {
  user: User
  token: string
  token_type: string
}

export interface RegisterResponse {
  user: User
  token: string
  token_type: string
}

// Payment Responses
export interface PaymentIntentResponse {
  client_secret: string
  amount: number
  currency: string
}

// API Error Response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Generic API Response
export interface ApiResponse<T> {
  data: T
  message?: string
}
