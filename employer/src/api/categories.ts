import { apiClient } from './client';
import type { Category, ApiResponse } from '@/types';

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const categoriesApi = {
  getAll: () =>
    apiClient.get<CategoriesResponse>('/categories'),

  create: (data: { name: string; slug: string; description?: string; icon?: string }) =>
    apiClient.post<ApiResponse<Category>>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};
