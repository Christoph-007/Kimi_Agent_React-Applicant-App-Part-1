import { apiClient } from './client';
import type { User, Job, Pagination } from '@/types';

interface DashboardStats {
  totalApplicants: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  pendingApprovals: number;
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

  // Job Management
  deleteJob: (id: string) =>
    apiClient.delete(`/admin/jobs/${id}`),
};
