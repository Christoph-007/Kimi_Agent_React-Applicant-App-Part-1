import { apiClient } from './client';
import type { Attendance, ApiResponse } from '@/types';

interface AttendanceResponse {
  success: boolean;
  message: string;
  data: Attendance[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CheckInData {
  latitude: number;
  longitude: number;
}

interface CheckOutData {
  latitude: number;
  longitude: number;
  remarks?: string;
}

export const attendanceApi = {
  getApplicantHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get<AttendanceResponse>('/attendance/applicant/history', { params }),

  getEmployerRecords: (params?: { status?: string; isApproved?: boolean; page?: number; limit?: number }) =>
    apiClient.get<AttendanceResponse>('/attendance/employer/records', { params }),

  getShiftAttendance: (shiftId: string) =>
    apiClient.get<ApiResponse<Attendance>>(`/attendance/shift/${shiftId}`),

  checkIn: (shiftId: string, data: CheckInData) =>
    apiClient.post(`/attendance/${shiftId}/checkin`, data),

  checkOut: (shiftId: string, data: CheckOutData) =>
    apiClient.post(`/attendance/${shiftId}/checkout`, data),

  approve: (id: string, employerRemarks?: string) =>
    apiClient.put(`/attendance/${id}/approve`, { employerRemarks }),

  markManual: (data: {
    shiftId: string;
    checkInTime: string;
    checkOutTime: string;
    status: string;
    employerRemarks?: string;
  }) =>
    apiClient.post('/attendance/manual', data),
};
