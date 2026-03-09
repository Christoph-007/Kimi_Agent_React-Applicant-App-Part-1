import { apiClient } from './client';
import type { JobRequest, ApiResponse } from '@/types';

interface JobRequestsResponse {
  success: boolean;
  message: string;
  data: JobRequest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CreateJobRequestData {
  applicantId: string;
  jobTitle: string;
  jobDescription: string;
  shiftType: string;
  location: string;
  offeredHourlyRate: number;
  message?: string;
}

export const jobRequestsApi = {
  getReceivedRequests: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<JobRequestsResponse>('/job-requests/applicant/received', { params }),

  getSentRequests: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<JobRequestsResponse>('/job-requests/employer/sent', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<JobRequest>>(`/job-requests/${id}`),

  create: (data: CreateJobRequestData) =>
    apiClient.post('/job-requests', data),

  accept: (id: string) =>
    apiClient.put(`/job-requests/${id}/accept`),

  decline: (id: string, declineReason?: string) =>
    apiClient.put(`/job-requests/${id}/decline`, { declineReason }),
};
