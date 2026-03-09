import { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  TrendingUp,
  Loader2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { adminApi } from '@/api/admin';

interface DashboardStats {
  totalApplicants: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  pendingApprovals: number;
}

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-forest-900">Platform Analytics</h1>
        <p className="text-gray-500">Detailed insights and metrics about platform activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Applicants', 
            value: stats?.totalApplicants || 0, 
            icon: Users, 
            color: 'bg-blue-50 text-blue-600',
            trend: '+12%'
          },
          { 
            label: 'Total Employers', 
            value: stats?.totalEmployers || 0, 
            icon: Building2, 
            color: 'bg-green-50 text-green-600',
            trend: '+8%'
          },
          { 
            label: 'Total Jobs', 
            value: stats?.totalJobs || 0, 
            icon: Briefcase, 
            color: 'bg-purple-50 text-purple-600',
            trend: '+15%'
          },
          { 
            label: 'Applications', 
            value: stats?.totalApplications || 0, 
            icon: FileText, 
            color: 'bg-orange-50 text-orange-600',
            trend: '+23%'
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className="text-xs text-green-600 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs text-yellow-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Needs attention
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.pendingApprovals || 0}</div>
          <div className="text-sm text-gray-500">Pending Employer Approvals</div>
        </div>

        {/* Application Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +5%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.totalJobs ? Math.round((stats.totalApplications / stats.totalJobs) * 10) / 10 : 0}
          </div>
          <div className="text-sm text-gray-500">Avg Applications per Job</div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Healthy
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {((stats?.totalApplicants || 0) + (stats?.totalEmployers || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Platform Users</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would appear here</p>
              <p className="text-sm">Connect to analytics service for detailed charts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Postings Trend</h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would appear here</p>
              <p className="text-sm">Connect to analytics service for detailed charts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Summary</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            <p className="text-sm text-gray-500">New Jobs Posted</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalApplicants || 0}</p>
            <p className="text-sm text-gray-500">New Applicants</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalEmployers || 0}</p>
            <p className="text-sm text-gray-500">New Employers</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
            <p className="text-sm text-gray-500">Applications Received</p>
          </div>
        </div>
      </div>
    </div>
  );
}
