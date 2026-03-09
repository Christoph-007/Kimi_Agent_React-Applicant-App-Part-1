import { apiClient } from './client';
import type { Job, ApiResponse, JobFilters } from '@/types';

interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ApplyData {
  coverLetter?: string;
  expectedSalary?: number;
}

export const jobsApi = {
  getAll: (params?: JobFilters) =>
    apiClient.get<JobsResponse>('/jobs', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Job>>(`/jobs/${id}`),

  getEmployerJobs: (params?: Record<string, unknown>) =>
    apiClient.get<JobsResponse>('/jobs/employer/my-jobs', { params }),

  create: (data: Partial<Job>) =>
    apiClient.post('/jobs', data),

  update: (id: string, data: Partial<Job>) =>
    apiClient.put(`/jobs/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/jobs/${id}`),

  close: (id: string) =>
    apiClient.put(`/jobs/${id}/close`),

  reopen: (id: string) =>
    apiClient.put(`/jobs/${id}/reopen`),

  apply: (jobId: string, data: ApplyData) =>
    apiClient.post(`/applications/${jobId}`, data),

  toggleSave: (id: string) =>
    apiClient.post(`/jobs/${id}/save`),

  getSaved: () =>
    apiClient.get<ApiResponse<Job[]>>('/jobs/applicant/saved'),
};
