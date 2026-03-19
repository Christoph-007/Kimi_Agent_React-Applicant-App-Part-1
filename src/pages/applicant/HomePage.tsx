import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
  Loader2,
  Bookmark
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';
import { shiftsApi } from '@/api/shifts';
import { notificationsApi } from '@/api/notifications';
import { applicationsApi } from '@/api/applications';
import { toast } from 'sonner';
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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response: any = await jobsApi.toggleSave(jobId);
      const isSaved = response.data?.isSaved;
      setRecommendedJobs(recommendedJobs.map(job =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      ));
      toast.success(isSaved ? 'Job saved' : 'Job removed from saved');
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      toast.error(error.message || 'Failed to save job');
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
      <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center px-4 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search jobs by title, skills, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/applicant/jobs?search=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="flex-1 outline-none text-gray-700 placeholder:text-gray-400 font-medium bg-transparent"
          />
        </div>
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              navigate(`/applicant/jobs?search=${encodeURIComponent(searchQuery)}`);
            } else {
              navigate('/applicant/jobs');
            }
          }}
          className="bg-lime-200 text-forest-900 px-8 py-3 rounded-full font-bold hover:bg-lime-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
        >
          Search Jobs
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applied Jobs', value: stats.applied, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
          { label: 'Upcoming Shifts', value: stats.upcoming, icon: Calendar, color: 'bg-forest-50 text-forest-700' },
          { label: 'Completed Shifts', value: stats.completed, icon: CheckCircle, color: 'bg-lime-100 text-forest-700' },
          { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-orange-50 text-orange-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-forest-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Notifications */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-forest-900">Recent Notifications</h2>
              <NavLink to="/applicant/notifications" className="text-sm text-forest-700 hover:text-forest-900 font-bold">
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
                    className={`flex items-start gap-4 p-5 rounded-2xl transition-colors ${notification.isRead ? 'bg-[#F5F5ED] hover:bg-gray-100' : 'bg-forest-50 hover:bg-forest-100/80'
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${notification.isRead ? 'bg-gray-300' : 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.6)]'
                      }`} />
                    <div className="flex-1">
                      <h4 className="font-bold text-forest-900">{notification.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-400 mt-2 block font-medium">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-forest-900">Recommended For You</h2>
              <NavLink to="/applicant/jobs" className="text-sm text-forest-700 hover:text-forest-900 font-bold">
                View All
              </NavLink>
            </div>

            {recommendedJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recommended jobs yet</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <NavLink
                    key={job._id}
                    to={`/applicant/jobs/${job._id}`}
                    className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={(e) => handleToggleSave(e, job._id)}
                        className="p-2 bg-[#F5F5ED] rounded-xl hover:bg-gray-100 transition-colors"
                        title={job.isSaved ? "Remove from saved" : "Save job"}
                      >
                        <Bookmark className={`w-4 h-4 transition-colors ${job.isSaved ? 'text-forest-700 fill-forest-700' : 'text-gray-400 group-hover:text-forest-600'}`} />
                      </button>
                    </div>

                    <div className="w-12 h-12 bg-[#F5F5ED] rounded-2xl flex items-center justify-center text-xl font-bold border border-gray-100 group-hover:bg-forest-50 group-hover:border-forest-100 transition-colors mt-2 mb-4">
                      {job.employer.storeName[0]}
                    </div>

                    <h3 className="font-bold text-forest-900 mb-2 line-clamp-2 pr-6 group-hover:text-forest-700 transition-colors">{job.title}</h3>
                    <p className="text-sm text-gray-400 mb-6 font-medium">{job.employer.storeName}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 text-gray-300" />
                        {job.location.city}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 text-gray-300" />
                        <span className="font-semibold text-gray-900">₹{job.salary.amount}/{job.salary.period}</span>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Upcoming Shifts */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-fit">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-forest-900">Upcoming Shifts</h2>
            <NavLink to="/applicant/shifts" className="text-sm text-forest-700 hover:text-forest-900 font-bold">
              View All
            </NavLink>
          </div>

          {upcomingShifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming shifts</p>
              <NavLink
                to="/applicant/jobs"
                className="inline-block mt-6 px-6 py-3 bg-lime-200 text-forest-900 rounded-full font-bold hover:bg-lime-300 transition-all shadow-sm active:scale-95"
              >
                Browse Jobs
              </NavLink>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShifts.map((shift) => (
                <div
                  key={shift._id}
                  className="bg-[#F5F5ED] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="inline-flex px-3 py-1 bg-white rounded-lg text-sm text-forest-700 font-bold shadow-sm mb-4">
                    {formatDate(shift.date)}
                  </div>
                  <h4 className="font-bold text-forest-900 text-lg mb-1">
                    {shift.job.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium mb-4">{shift.employer.storeName}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {shift.location}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <NavLink
                      to={`/applicant/shifts/${shift._id}`}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 text-forest-900 rounded-xl text-sm font-bold text-center hover:bg-[#F5F5ED] transition-colors shadow-sm"
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
