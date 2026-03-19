import { useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus,
  Search,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Eye,
  RotateCcw
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';
import type { Job } from '@/types';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [showActions, setShowActions] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, unknown> = {
        page: pagination.currentPage,
        limit: 10,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== 'all') params.status = filters.status;

      const response = await jobsApi.getEmployerJobs(params);
      setJobs(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleCloseJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to close this job?')) return;
    try {
      await jobsApi.close(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Failed to close job:', error);
    }
  };

  const handleReopenJob = async (jobId: string) => {
    try {
      await jobsApi.reopen(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Failed to reopen job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    try {
      await jobsApi.delete(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-forest-50 text-forest-800',
      closed: 'bg-[#F5F5ED] text-gray-700',
      filled: 'bg-blue-50 text-blue-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">My Jobs</h1>
          <p className="text-gray-500">Manage your job postings and applications</p>
        </div>
        <NavLink
          to="/employer/jobs/new"
          className="px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full sm:w-40 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="filled">Filled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {jobs.length} of {pagination.totalItems} jobs
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet</h3>
          <p className="text-gray-500 mb-4">Start posting jobs to find the right candidates</p>
          <NavLink
            to="/employer/jobs/new"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Post Your First Job
          </NavLink>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-500">Posted on {formatDate(job.createdAt)}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === job._id ? null : job._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      {showActions === job._id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setShowActions(null)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                            <button
                              onClick={() => {
                                navigate(`/employer/jobs/${job._id}/applications`);
                                setShowActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F5F5ED] flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Applications
                            </button>
                            <button
                              onClick={() => {
                                navigate(`/employer/jobs/${job._id}/edit`);
                                setShowActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F5F5ED] flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Job
                            </button>
                            {job.status === 'open' ? (
                              <button
                                onClick={() => {
                                  handleCloseJob(job._id);
                                  setShowActions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F5F5ED] flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Close Job
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleReopenJob(job._id);
                                  setShowActions(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#F5F5ED] flex items-center gap-2"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Reopen Job
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDeleteJob(job._id);
                                setShowActions(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location.city}, {job.location.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.totalApplications} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.views} views
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    <NavLink
                      to={`/employer/jobs/${job._id}/applications`}
                      className="text-sm text-forest-700 hover:text-forest-900 font-medium"
                    >
                      View Applications →
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination((prev) => ({ ...prev, currentPage: page }))}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    pagination.currentPage === page
                      ? 'bg-forest-900 text-white'
                      : 'border border-gray-200 hover:bg-[#F5F5ED]'
                  }`}
                >
                  {page}
                </button>
              ))}
              
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
