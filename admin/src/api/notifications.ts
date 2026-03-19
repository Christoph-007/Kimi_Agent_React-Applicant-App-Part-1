import { apiClient } from './client';
import type { Notification, ApiResponse, NotificationFilters } from '@/types';

interface NotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const notificationsApi = {
  getAll: (params?: NotificationFilters) =>
    apiClient.get<NotificationsResponse>('/notifications', { params }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/read-all'),

  dismiss: (id: string) =>
    apiClient.delete(`/notifications/${id}`),
};
