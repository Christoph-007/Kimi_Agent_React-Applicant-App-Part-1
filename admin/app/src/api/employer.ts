import { apiClient } from './client';
import type { ApiResponse, Pagination } from '@/types';

interface ApplicantsResponse {
  success: boolean;
  message: string;
  data: Applicant[];
  pagination: Pagination;
}

interface Applicant {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  skills?: string[];
  experience?: number;
  preferredJobType?: string;
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  expectedHourlyRate?: number;
  availabilityDays?: string[];
  resume?: {
    url: string;
    publicId: string;
  };
}

interface ShortlistItem {
  _id: string;
  applicant: Applicant;
  label?: string;
  notes?: string;
  createdAt: string;
}

interface ShortlistResponse {
  success: boolean;
  message: string;
  data: ShortlistItem[];
  pagination: Pagination;
}

interface SavedFilter {
  _id: string;
  name: string;
  filters: Record<string, unknown>;
  createdAt: string;
}

interface SavedFiltersResponse {
  success: boolean;
  message: string;
  data: SavedFilter[];
}

export const employerApi = {
  // Browse Applicants
  getApplicants: (params?: {
    jobCategory?: string;
    preferredShiftType?: string;
    preferredWorkLocation?: string;
    minHourlyRate?: number;
    maxHourlyRate?: number;
    availableDay?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => apiClient.get<ApplicantsResponse>('/employer/applicants', { params }),

  getApplicantById: (id: string) =>
    apiClient.get<ApiResponse<Applicant>>(`/employer/applicants/${id}`),

  // Shortlist
  getShortlist: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ShortlistResponse>('/shortlist', { params }),

  addToShortlist: (applicantId: string, data?: { label?: string; notes?: string }) =>
    apiClient.post<ApiResponse<ShortlistItem>>('/shortlist', { applicantId, ...data }),

  updateShortlist: (id: string, data: { label?: string; notes?: string }) =>
    apiClient.put<ApiResponse<ShortlistItem>>(`/shortlist/${id}`, data),

  removeFromShortlist: (id: string) =>
    apiClient.delete(`/shortlist/${id}`),

  checkShortlist: (applicantId: string) =>
    apiClient.get<ApiResponse<{ isShortlisted: boolean }>>(`/shortlist/check/${applicantId}`),

  // Saved Filters
  getSavedFilters: () =>
    apiClient.get<SavedFiltersResponse>('/employer/saved-filters'),

  saveFilter: (name: string, filters: Record<string, unknown>) =>
    apiClient.post<ApiResponse<SavedFilter>>('/employer/saved-filters', { name, filters }),

  deleteSavedFilter: (id: string) =>
    apiClient.delete(`/employer/saved-filters/${id}`),

  // Dashboard Stats
  getDashboardStats: () =>
    apiClient.get<ApiResponse<{
      totalJobs: number;
      activeJobs: number;
      totalApplications: number;
      pendingApplications: number;
      totalShifts: number;
      upcomingShifts: number;
      totalShortlisted: number;
    }>>('/employer/dashboard-stats'),

  // Recent Activity
  getRecentActivity: () =>
    apiClient.get<ApiResponse<Array<{
      type: string;
      title: string;
      description: string;
      timestamp: string;
    }>>>('/employer/recent-activity'),
};
