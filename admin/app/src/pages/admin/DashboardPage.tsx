import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '@/api/admin';

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
  recentJobs: Array<{
    _id: string;
    title: string;
    employer: { storeName: string };
    status: string;
    totalApplications: number;
    createdAt: string;
  }>;
  recentApplications: Array<{
    _id: string;
    applicant: { name: string };
    job: { title: string };
    employer: { storeName: string };
    status: string;
    createdAt: string;
  }>;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
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
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of platform activity and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { 
            label: 'Total Applicants', 
            value: stats?.applicants?.total || 0, 
            icon: Users, 
            color: 'bg-blue-50 text-blue-600',
            href: '/admin/applicants'
          },
          { 
            label: 'Total Employers', 
            value: stats?.employers?.total || 0, 
            icon: Building2, 
            color: 'bg-green-50 text-green-600',
            href: '/admin/employers'
          },
          { 
            label: 'Total Jobs', 
            value: stats?.jobs?.total || 0, 
            icon: Briefcase, 
            color: 'bg-purple-50 text-purple-600',
            href: '/admin/jobs'
          },
          { 
            label: 'Applications', 
            value: stats?.applications?.total || 0, 
            icon: FileText, 
            color: 'bg-orange-50 text-orange-600',
            href: '/admin/analytics'
          },
          { 
            label: 'Pending Approvals', 
            value: stats?.employers?.pending || 0, 
            icon: AlertCircle, 
            color: 'bg-red-50 text-red-600',
            href: '/admin/employers'
          },
        ].map((stat, index) => (
          <NavLink
            key={index}
            to={stat.href}
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

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <NavLink to="/admin/jobs" className="text-sm text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
          
          {!stats?.recentJobs || stats.recentJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No jobs posted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentJobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.employer.storeName} • {job.totalApplications} applications
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <NavLink to="/admin/analytics" className="text-sm text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
          
          {!stats?.recentApplications || stats.recentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentApplications.slice(0, 5).map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{app.applicant.name}</h3>
                    <p className="text-sm text-gray-500">
                      Applied for {app.job.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      app.status === 'applied' ? 'bg-blue-50 text-blue-700' :
                      app.status === 'reviewing' ? 'bg-yellow-50 text-yellow-700' :
                      app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(app.createdAt)}</span>
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
