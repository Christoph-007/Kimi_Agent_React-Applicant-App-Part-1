import { apiClient } from './client';
import type { Application, ApiResponse, ApplicationFilters } from '@/types';

interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const applicationsApi = {
  getMyApplications: (params?: ApplicationFilters) =>
    apiClient.get<ApplicationsResponse>('/applications/my-applications', { params }),

  getJobApplications: (jobId: string, params?: ApplicationFilters) =>
    apiClient.get<ApplicationsResponse>(`/applications/job/${jobId}`, { params }),

  getAllEmployerApplications: (params?: ApplicationFilters) =>
    apiClient.get<ApplicationsResponse>('/applications/employer/all', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Application>>(`/applications/${id}`),

  withdraw: (id: string) =>
    apiClient.put(`/applications/${id}/withdraw`),

  accept: (id: string, note?: string) =>
    apiClient.put(`/applications/${id}/accept`, { note }),

  reject: (id: string, rejectionReason: string) =>
    apiClient.put(`/applications/${id}/reject`, { rejectionReason }),
};
