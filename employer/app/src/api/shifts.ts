import { apiClient } from './client';
import type { Shift, ApiResponse, ShiftFilters } from '@/types';

interface ShiftsResponse {
  success: boolean;
  message: string;
  data: Shift[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CreateShiftData {
  jobId: string;
  applicantId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instructions?: string;
  paymentAmount?: number;
}

export const shiftsApi = {
  getApplicantShifts: (params?: ShiftFilters) =>
    apiClient.get<ShiftsResponse>('/shifts/applicant/my-shifts', { params }),

  getEmployerShifts: (params?: ShiftFilters) =>
    apiClient.get<ShiftsResponse>('/shifts/employer/my-shifts', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Shift>>(`/shifts/${id}`),

  create: (data: CreateShiftData) =>
    apiClient.post('/shifts', data),

  update: (id: string, data: Partial<CreateShiftData>) =>
    apiClient.put(`/shifts/${id}`, data),

  confirm: (id: string) =>
    apiClient.put(`/shifts/${id}/confirm`),

  cancel: (id: string, cancellationReason?: string) =>
    apiClient.put(`/shifts/${id}/cancel`, { cancellationReason }),

  delete: (id: string) =>
    apiClient.delete(`/shifts/${id}`),
};
