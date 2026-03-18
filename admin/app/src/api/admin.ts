import { apiClient } from './client';
import type { User, Job, Pagination } from '@/types';

interface DashboardStats {
  employers: {
    total: number;
    pending: number;
    approved: number;
    blocked: number;
  };
  applicants: {
    total: number;
    active: number;
  };
  jobs: {
    total: number;
    open: number;
    closed: number;
  };
  applications: {
    total: number;
    pending: number;
    accepted: number;
  };
  shifts: {
    total: number;
    upcoming: number;
  };
  recentJobs: Job[];
  recentApplications: {
    _id: string;
    applicant: {
      _id: string;
      name: string;
    };
    job: {
      _id: string;
      title: string;
    };
    employer: {
      _id: string;
      storeName: string;
    };
    status: string;
    createdAt: string;
  }[];
}

interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

interface EmployersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

interface ApplicantsResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: () =>
    apiClient.get<DashboardStatsResponse>('/admin/dashboard/stats'),

  // Analytics
  getAnalyticsCharts: () =>
    apiClient.get<{
      success: boolean;
      data: {
        userGrowth: { month: string; applicants: number; employers: number }[];
        jobTrend: { month: string; jobs: number; applications: number }[];
      };
    }>('/admin/analytics/charts'),

  // Employer Management
  getEmployers: (params?: { 
    isApproved?: boolean; 
    isBlocked?: boolean; 
    businessType?: string; 
    search?: string; 
    page?: number; 
    limit?: number 
  }) =>
    apiClient.get<EmployersResponse>('/admin/employers', { params }),

  approveEmployer: (id: string) =>
    apiClient.put(`/admin/employers/${id}/approve`),

  blockEmployer: (id: string) =>
    apiClient.put(`/admin/employers/${id}/block`),

  unblockEmployer: (id: string) =>
    apiClient.put(`/admin/employers/${id}/unblock`),

  // Applicant Management
  getApplicants: (params?: { 
    isActive?: boolean; 
    search?: string; 
    page?: number; 
    limit?: number 
  }) =>
    apiClient.get<ApplicantsResponse>('/admin/applicants', { params }),

  deactivateApplicant: (id: string) =>
    apiClient.put(`/admin/applicants/${id}/deactivate`),

  activateApplicant: (id: string) =>
    apiClient.put(`/admin/applicants/${id}/activate`),

  // Job Management
  getJobs: (params?: Record<string, unknown>) =>
    apiClient.get<{ success: boolean; message: string; data: Job[]; pagination: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number; hasNextPage: boolean; hasPrevPage: boolean } }>('/admin/jobs', { params }),

  getJobById: (id: string) =>
    apiClient.get<{ success: boolean; data: Job }>(`/jobs/${id}`),

  deleteJob: (id: string) =>
    apiClient.delete(`/admin/jobs/${id}`),
};
