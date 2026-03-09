import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Bell,
  MapPin,
  DollarSign,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';
import { shiftsApi } from '@/api/shifts';
import { notificationsApi } from '@/api/notifications';
import { applicationsApi } from '@/api/applications';
import type { Job, Shift, Notification } from '@/types';

export function HomePage() {
  const [stats, setStats] = useState({
    applied: 0,
    upcoming: 0,
    completed: 0,
    pending: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch applications for stats
      const appsResponse = await applicationsApi.getMyApplications({ limit: 100 });
      const applications = appsResponse.data || [];
      
      // Fetch shifts for stats
      const shiftsResponse = await shiftsApi.getApplicantShifts({ limit: 100 });
      const shifts = shiftsResponse.data || [];
      
      // Fetch notifications
      const notifsResponse = await notificationsApi.getAll({ limit: 5 });
      setNotifications(notifsResponse.data || []);
      
      // Fetch recommended jobs
      const jobsResponse = await jobsApi.getAll({ limit: 3, status: 'open' });
      setRecommendedJobs(jobsResponse.data || []);
      
      // Fetch upcoming shifts
      const upcomingResponse = await shiftsApi.getApplicantShifts({ status: 'scheduled', limit: 3 });
      setUpcomingShifts(upcomingResponse.data || []);
      
      // Calculate stats
      setStats({
        applied: applications.length,
        upcoming: shifts.filter((s) => s.status === 'scheduled' || s.status === 'confirmed').length,
        completed: shifts.filter((s) => s.status === 'completed').length,
        pending: applications.filter((a) => a.status === 'applied' || a.status === 'reviewing').length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Home Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, skills, or company..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <NavLink
            to="/jobs"
            className="px-6 py-3 bg-forest-900 text-white rounded-xl font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
          >
            Search Jobs
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applied Jobs', value: stats.applied, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
          { label: 'Upcoming Shifts', value: stats.upcoming, icon: Calendar, color: 'bg-green-50 text-green-600' },
          { label: 'Completed Shifts', value: stats.completed, icon: CheckCircle, color: 'bg-purple-50 text-purple-600' },
          { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-orange-50 text-orange-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <NavLink to="/notifications" className="text-sm text-forest-700 hover:text-forest-900 font-medium">
                View All
              </NavLink>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-start gap-4 p-4 rounded-xl ${
                      notification.isRead ? 'bg-gray-50' : 'bg-forest-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.isRead ? 'bg-gray-300' : 'bg-forest-600'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recommended For You</h2>
              <NavLink to="/jobs" className="text-sm text-forest-700 hover:text-forest-900 font-medium">
                View All Jobs
              </NavLink>
            </div>
            
            {recommendedJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recommended jobs yet</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <NavLink
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-card-hover transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{job.employer.storeName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{job.salary.amount}/{job.salary.period}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Upcoming Shifts */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
            <NavLink to="/shifts" className="text-sm text-forest-700 hover:text-forest-900 font-medium">
              View All
            </NavLink>
          </div>
          
          {upcomingShifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming shifts</p>
              <NavLink
                to="/jobs"
                className="inline-block mt-4 px-4 py-2 bg-forest-900 text-white rounded-full text-sm font-medium hover:bg-forest-800 transition-colors"
              >
                Browse Jobs
              </NavLink>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShifts.map((shift) => (
                <div
                  key={shift._id}
                  className="border border-gray-100 rounded-xl p-4"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(shift.date)}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {shift.job.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">{shift.employer.storeName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {shift.location}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <NavLink
                      to={`/shifts/${shift._id}`}
                      className="flex-1 px-3 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium text-center hover:bg-forest-100 transition-colors"
                    >
                      View Details
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
