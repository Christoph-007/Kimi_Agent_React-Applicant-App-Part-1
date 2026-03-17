import React, { useEffect, useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const isApproved = user?.isApproved ?? false;

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <NavLink
          to="/employer/jobs/new"
          className="px-6 py-3 bg-lime-200 text-forest-900 rounded-full font-bold hover:bg-lime-300 transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Briefcase className="w-5 h-5" />
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
            color: 'bg-green-50 text-green-600',
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
            color: 'bg-lime-100 text-forest-700',
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
            className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-forest-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium flex items-center justify-between">
              {stat.label}
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-forest-500 transition-colors" />
            </div>
          </NavLink>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-forest-900">Recent Jobs</h2>
          <NavLink to="/employer/jobs" className="text-sm text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No jobs posted yet</p>
            <NavLink
              to="/employer/jobs/new"
              className="inline-block mt-6 px-6 py-3 bg-lime-200 text-forest-900 rounded-full font-bold hover:bg-lime-300 transition-all shadow-sm active:scale-95"
            >
              Post Your First Job
            </NavLink>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recentJobs.map((job) => (
              <NavLink
                to={`/employer/jobs/${job._id}`}
                key={job._id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100/50 hover:border-gray-200"
              >
                <div>
                  <h3 className="font-bold text-forest-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {job.totalApplications} applications
                  </p>
                </div>
                <span className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${job.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                  {job.status}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Shifts */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-forest-900">Upcoming Shifts</h2>
          <NavLink to="/employer/shifts" className="text-sm text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>

        {upcomingShifts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No upcoming shifts</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingShifts.map((shift) => (
              <div
                key={shift._id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="inline-flex px-3 py-1 bg-white rounded-md text-xs text-forest-700 font-bold shadow-sm mb-4">
                  {formatDate(shift.date)}
                </div>
                <h3 className="font-bold text-forest-900 text-lg mb-1 line-clamp-1">{shift.job.title}</h3>
                <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-xs uppercase">
                    {shift.applicant.name[0]}
                  </div>
                  {shift.applicant.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
