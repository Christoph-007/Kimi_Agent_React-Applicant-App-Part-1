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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
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
}

interface ChartData {
  userGrowth: { month: string; applicants: number; employers: number }[];
  jobTrend: { month: string; jobs: number; applications: number }[];
}

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, chartsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAnalyticsCharts()
      ]);
      setStats(statsRes.data);
      setChartData(chartsRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
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

  // Current month data for platform summary
  const currentMonthUsers = chartData?.userGrowth[chartData.userGrowth.length - 1];
  const currentMonthJobs = chartData?.jobTrend[chartData.jobTrend.length - 1];

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
            value: stats?.applicants?.total || 0, 
            icon: Users, 
            color: 'bg-blue-50 text-blue-600',
            trend: '+12%'
          },
          { 
            label: 'Total Employers', 
            value: stats?.employers?.total || 0, 
            icon: Building2, 
            color: 'bg-forest-50 text-forest-700',
            trend: '+8%'
          },
          { 
            label: 'Total Jobs', 
            value: stats?.jobs?.total || 0, 
            icon: Briefcase, 
            color: 'bg-purple-50 text-purple-600',
            trend: '+15%'
          },
          { 
            label: 'Applications', 
            value: stats?.applications?.total || 0, 
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
              <span className="text-xs text-forest-700 font-medium flex items-center">
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
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.employers?.pending || 0}</div>
          <div className="text-sm text-gray-500">Pending Employer Approvals</div>
        </div>

        {/* Application Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-forest-700 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +5%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats?.jobs?.total ? Math.round((stats.applications.total / stats.jobs.total) * 10) / 10 : 0}
          </div>
          <div className="text-sm text-gray-500">Avg Applications per Job</div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-forest-700" />
            </div>
            <span className="text-xs text-forest-700 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Healthy
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {((stats?.applicants?.total || 0) + (stats?.employers?.total || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Platform Users</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            User Growth (Last 6 Months)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData?.userGrowth}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="applicants" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorApplicants)" 
                  name="Applicants"
                />
                <Area 
                  type="monotone" 
                  dataKey="employers" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEmployers)" 
                  name="Employers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Postings Trend Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Job Postings Trend
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.jobTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <RechartsTooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend iconType="circle" />
                <Bar 
                  dataKey="jobs" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]} 
                  name="Jobs Posted"
                  barSize={30}
                />
                <Bar 
                  dataKey="applications" 
                  fill="#F59E0B" 
                  radius={[4, 4, 0, 0]} 
                  name="Applications"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Highlights</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-[#F5F5ED] rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">New This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentMonthJobs?.jobs || 0}</p>
            <p className="text-sm text-gray-500">Jobs Posted</p>
          </div>
          <div className="p-4 bg-[#F5F5ED] rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">New This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentMonthUsers?.applicants || 0}</p>
            <p className="text-sm text-gray-500">Applicants Joined</p>
          </div>
          <div className="p-4 bg-[#F5F5ED] rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">New This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentMonthUsers?.employers || 0}</p>
            <p className="text-sm text-gray-500">Employers Joined</p>
          </div>
          <div className="p-4 bg-[#F5F5ED] rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">New This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentMonthJobs?.applications || 0}</p>
            <p className="text-sm text-gray-500">Applications Received</p>
          </div>
        </div>
      </div>
    </div>
  );
}
