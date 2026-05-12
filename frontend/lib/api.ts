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

// ── Domain API helpers ──────────────────────────────────────

export interface PagedResponse<T> {
  data: { content: T[]; totalElements: number; totalPages: number; page: number; size: number };
  success: boolean; message: string;
}

function qs(params: Record<string, unknown>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const clientsApi = {
  list: (p: Record<string, unknown> = {}) => apiMethods.get<PagedResponse<any>>(`/clients${qs(p)}`),
  get:  (id: string)            => apiMethods.get<{ data: any }>(`/clients/${id}`),
  create: (body: any)           => apiMethods.post<{ data: any }>('/clients', body),
  update: (id: string, body: any) => apiMethods.put<{ data: any }>(`/clients/${id}`, body),
  delete: (id: string)          => apiMethods.delete(`/clients/${id}`),
  search: (name: string, p: Record<string, unknown> = {}) =>
    apiMethods.get<PagedResponse<any>>(`/clients/search${qs({ name, ...p })}`),
};

export const directorsApi = {
  list: (p: Record<string, unknown> = {}) => apiMethods.get<PagedResponse<any>>(`/directors${qs(p)}`),
  get:  (id: string)            => apiMethods.get<{ data: any }>(`/directors/${id}`),
  byEntity: (entityId: string)  => apiMethods.get<{ data: any[] }>(`/directors/by-entity/${entityId}`),
  create: (body: any)           => apiMethods.post<{ data: any }>('/directors', body),
  update: (id: string, body: any) => apiMethods.put<{ data: any }>(`/directors/${id}`, body),
  delete: (id: string)          => apiMethods.delete(`/directors/${id}`),
};

export const jobsApi = {
  list: (p: Record<string, unknown> = {}) => apiMethods.get<PagedResponse<any>>(`/jobs${qs(p)}`),
  get:  (id: string)            => apiMethods.get<{ data: any }>(`/jobs/${id}`),
  overdue: ()                   => apiMethods.get<{ data: any[] }>('/jobs/overdue'),
  recent:  (limit = 10)         => apiMethods.get<{ data: any[] }>(`/jobs/recent?limit=${limit}`),
  create: (body: any)           => apiMethods.post<{ data: any }>('/jobs', body),
  update: (id: string, body: any) => apiMethods.put<{ data: any }>(`/jobs/${id}`, body),
  status: (id: string, status: string) => apiMethods.patch<{ data: any }>(`/jobs/${id}/status`, { status }),
  delete: (id: string)          => apiMethods.delete(`/jobs/${id}`),
};

export const invoicesApi = {
  list: (p: Record<string, unknown> = {}) => apiMethods.get<PagedResponse<any>>(`/invoices${qs(p)}`),
  get:  (id: string)            => apiMethods.get<{ data: any }>(`/invoices/${id}`),
  summary: ()                   => apiMethods.get<{ data: any }>('/invoices/summary'),
  create: (body: any)           => apiMethods.post<{ data: any }>('/invoices', body),
  update: (id: string, body: any) => apiMethods.put<{ data: any }>(`/invoices/${id}`, body),
  delete: (id: string)          => apiMethods.delete(`/invoices/${id}`),
};

export const dashboardApi = {
  stats: () => apiMethods.get<{ data: any }>('/dashboard/stats'),
};

export const aiApi = {
  chat: (message: string) => apiMethods.post<{ data: { reply: string } }>('/ai/chat', { message }),
};

