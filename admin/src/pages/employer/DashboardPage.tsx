import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Star,
  ArrowRight,
  Loader2,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { employerApi } from '@/api/employer';
import { jobsApi } from '@/api/jobs';
import { shiftsApi } from '@/api/shifts';
import type { Job, Shift } from '@/types';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    upcomingShifts: 0,
    totalShortlisted: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await employerApi.getDashboardStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Fetch recent jobs
      const jobsResponse = await jobsApi.getEmployerJobs({ limit: 5 });
      setRecentJobs(jobsResponse.data || []);

      // Fetch upcoming shifts
      const shiftsResponse = await shiftsApi.getEmployerShifts({ status: 'confirmed', limit: 5 });
      setUpcomingShifts(shiftsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">Account Pending Approval</h2>
          <p className="text-yellow-700 mb-4">
            Your business account is currently under review. You'll be able to post jobs and manage applicants once approved.
          </p>
          <p className="text-yellow-600 text-sm">
            This usually takes 1-2 business days. We'll notify you via email once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your business.</p>
        </div>
        <NavLink
          to="/employer/jobs/new"
          className="px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Post New Job
        </NavLink>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { 
            label: 'Total Jobs', 
            value: stats.totalJobs, 
            icon: Briefcase, 
            color: 'bg-blue-50 text-blue-600',
            link: '/employer/jobs'
          },
          { 
            label: 'Active Jobs', 
            value: stats.activeJobs, 
            icon: TrendingUp, 
            color: 'bg-forest-50 text-forest-700',
            link: '/employer/jobs'
          },
          { 
            label: 'Total Applications', 
            value: stats.totalApplications, 
            icon: Users, 
            color: 'bg-purple-50 text-purple-600',
            link: '/employer/jobs'
          },
          { 
            label: 'Pending Review', 
            value: stats.pendingApplications, 
            icon: Clock, 
            color: 'bg-orange-50 text-orange-600',
            link: '/employer/jobs'
          },
          { 
            label: 'Upcoming Shifts', 
            value: stats.upcomingShifts, 
            icon: Calendar, 
            color: 'bg-indigo-50 text-indigo-600',
            link: '/employer/shifts'
          },
          { 
            label: 'Shortlisted', 
            value: stats.totalShortlisted, 
            icon: Star, 
            color: 'bg-yellow-50 text-yellow-600',
            link: '/employer/shortlist'
          },
        ].map((stat, index) => (
          <NavLink
            key={index}
            to={stat.link}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </NavLink>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          <NavLink to="/employer/jobs" className="text-sm text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
        
        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No jobs posted yet</p>
            <NavLink
              to="/employer/jobs/new"
              className="inline-block mt-4 px-4 py-2 bg-forest-900 text-white rounded-full text-sm font-medium hover:bg-forest-800 transition-colors"
            >
              Post Your First Job
            </NavLink>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recentJobs.map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-4 bg-[#F5F5ED] rounded-xl"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {job.totalApplications} applications • {job.status}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  job.status === 'open' ? 'bg-forest-50 text-forest-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
          <NavLink to="/employer/shifts" className="text-sm text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
        
        {upcomingShifts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No upcoming shifts</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingShifts.map((shift) => (
              <div
                key={shift._id}
                className="border border-gray-100 rounded-xl p-4"
              >
                <div className="text-sm text-gray-500 mb-2">{formatDate(shift.date)}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{shift.job.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{shift.applicant.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {shift.startTime} - {shift.endTime}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
