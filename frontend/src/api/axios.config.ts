import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY, ERROR_MESSAGES } from '@/utils/constants';
import type { ApiResponse, ApiError } from './types';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for session-based cart
});

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response data directly
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const apiError: ApiError = {
      message: ERROR_MESSAGES.SERVER_ERROR,
      status: error.response?.status,
    };

    if (error.response) {
      const { status, data } = error.response;

      // Handle different status codes
      switch (status) {
        case 400:
          apiError.message = data.message || ERROR_MESSAGES.VALIDATION_ERROR;
          apiError.errors = data.errors;
          break;

        case 401:
          apiError.message = data.message || ERROR_MESSAGES.UNAUTHORIZED;
          // Clear token and redirect to login
          localStorage.removeItem(AUTH_TOKEN_KEY);
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          apiError.message = data.message || ERROR_MESSAGES.UNAUTHORIZED;
          break;

        case 404:
          apiError.message = data.message || ERROR_MESSAGES.NOT_FOUND;
          break;

        case 422:
          apiError.message = data.message || ERROR_MESSAGES.VALIDATION_ERROR;
          apiError.errors = data.errors;
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          apiError.message = data.message || ERROR_MESSAGES.SERVER_ERROR;
          break;

        default:
          apiError.message = data.message || ERROR_MESSAGES.SERVER_ERROR;
      }
    } else if (error.request) {
      // Network error
      apiError.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      apiError.message = error.message || ERROR_MESSAGES.SERVER_ERROR;
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;

// Helper function to handle API errors
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return error as ApiError;
  }

  return {
    message: ERROR_MESSAGES.SERVER_ERROR,
  };
}

// Helper function to extract data from response
export function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!response.data || response.data.data === undefined || response.data.data === null) {
    throw new Error('API response data is missing or null');
  }
  return response.data.data;
}
