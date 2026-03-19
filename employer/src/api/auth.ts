import { apiClient } from './client';
import type { User, ApiResponse } from '@/types';

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface SignupData {
  name?: string;
  storeName?: string;
  ownerName?: string;
  email: string;
  phone: string;
  password: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  businessType?: string;
  businessDescription?: string;
  skills?: string[];
  experience?: number;
  preferredJobType?: string;
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  weeklyAvailability?: {
    days: string[];
    hoursPerWeek?: number;
  };
  expectedHourlyRate?: number;
}

export const authApi = {
  login: (data: { identifier: string; password: string; userType: string }) =>
    apiClient.post<LoginResponse>('/auth/login', data),

  signup: (data: SignupData, userType: 'applicant' | 'employer') =>
    apiClient.post<LoginResponse>(`/auth/${userType}/signup`, data),

  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>('/auth/me', data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/update-password', data),

  logout: () => apiClient.post('/auth/logout'),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count'),

  forgotPassword: (data: { email: string; userType: string }) =>
    apiClient.post('/auth/forgot-password', data),

  resetPassword: (token: string, data: { password: string; userType: string }) =>
    apiClient.post(`/auth/reset-password/${token}`, data),
};
