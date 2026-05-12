import axios, { AxiosInstance, AxiosError } from 'axios';
import { QueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiMethods = {
  get: async <T,>(url: string, config = {}) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T,>(url: string, data?: any, config = {}) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T,>(url: string, data?: any, config = {}) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T,>(url: string, data?: any, config = {}) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T,>(url: string, config = {}) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};
