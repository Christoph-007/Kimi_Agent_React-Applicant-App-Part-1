import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle,
  Briefcase,
  Calendar,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Check
} from 'lucide-react';
import { notificationsApi } from '@/api/notifications';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification } from '@/types';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const { fetchUnreadCount, user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [pagination.currentPage, activeFilter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params: { isRead?: boolean; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      if (activeFilter === 'unread') {
        params.isRead = false;
      }
      
      const response = await notificationsApi.getAll(params);
      setNotifications(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      await notificationsApi.dismiss(notificationId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      application: Briefcase,
      shift: Calendar,
      job_request: User,
      attendance: CheckCircle,
      default: Bell,
    };
    return icons[type] || icons.default;
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      application: 'bg-blue-50 text-blue-600',
      shift: 'bg-forest-50 text-forest-700',
      job_request: 'bg-purple-50 text-purple-600',
      attendance: 'bg-orange-50 text-orange-600',
      default: 'bg-[#F5F5ED] text-gray-600',
    };
    return colors[type] || colors.default;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with your job applications and shifts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 rounded-lg font-medium hover:bg-forest-100 transition-colors"
          >
            <Check className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveFilter('all');
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-forest-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => {
            setActiveFilter('unread');
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'unread'
              ? 'bg-forest-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">
            {activeFilter === 'unread'
              ? 'You have no unread notifications'
              : 'You will receive notifications about your applications and shifts here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <div
                key={notification._id}
                className={`bg-white rounded-2xl p-6 shadow-card transition-all ${
                  notification.isRead ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-500 mt-1">{notification.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(notification._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Action buttons based on notification type */}
                    {notification.data && (
                      <div className="mt-4 flex gap-2">
                        {notification.type === 'application' && (notification.data as { applicationId?: string }).applicationId && (
                          <NavLink
                            to={user?.type === 'employer' ? `/employer/jobs/${(notification.data as { jobId?: string }).jobId}/applications` : "/my-jobs"}
                            className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                          >
                            View Application
                          </NavLink>
                        )}
                        {notification.type === 'shift' && (notification.data as { shiftId?: string }).shiftId && (
                          <NavLink
                            to={user?.type === 'employer' ? "/employer/shifts" : "/shifts"}
                            className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                          >
                            View Shift
                          </NavLink>
                        )}
                        {notification.type === 'job_request' && (notification.data as { requestId?: string }).requestId && (
                          <NavLink
                            to={user?.type === 'employer' ? "/employer/requests" : "/my-jobs"}
                            className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                          >
                            View Request
                          </NavLink>
                        )}
                        {notification.type === 'attendance' && (notification.data as { shiftId?: string }).shiftId && (
                          <NavLink
                            to={user?.type === 'employer' ? "/employer/attendance" : "/attendance"}
                            className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors"
                          >
                            View Attendance
                          </NavLink>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5ED]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F5ED]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
