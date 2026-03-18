import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
  Bookmark,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/api/jobs';
import { toast } from 'sonner';
import type { Job } from '@/types';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    jobType: searchParams.get('jobType') || '',
    city: searchParams.get('city') || '',
    minSalary: '',
    maxSalary: '',
    category: searchParams.get('category') || '',
    skills: searchParams.get('skills') || '',
    locationSearch: searchParams.get('locationSearch') || '',
  });

  // Sync URL params to filters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const jobType = searchParams.get('jobType') || '';
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || '';
    const skills = searchParams.get('skills') || '';
    const locationSearch = searchParams.get('locationSearch') || '';

    setFilters(prev => ({
      ...prev,
      search,
      jobType,
      city,
      category,
      skills,
      locationSearch
    }));
  }, [searchParams]);

  const jobTypes = ['full-time', 'part-time', 'shift', 'contract'];
  const categories = ['Food Service', 'Retail', 'Logistics', 'Healthcare', 'Hospitality', 'Warehouse', 'Security', 'Driver'];

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, unknown> = {
        page: pagination.currentPage,
        limit: 12,
        status: 'open',
      };

      if (filters.search) params.search = filters.search;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.city) params.city = filters.city;
      if (filters.minSalary) params.minSalary = parseInt(filters.minSalary);
      if (filters.maxSalary) params.maxSalary = parseInt(filters.maxSalary);
      if (filters.category) params.category = filters.category;
      if (filters.skills) params.skills = filters.skills;
      if (filters.locationSearch) params.locationSearch = filters.locationSearch;

      const response = await jobsApi.getAll(params);
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

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      toast.info('Please sign in to save jobs');
      return;
    }
    try {
      const response: any = await jobsApi.toggleSave(jobId);
      const isSaved = response.data?.isSaved;
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
      ));
      toast.success(isSaved ? 'Job saved' : 'Job removed from saved');
    } catch (error: any) {
      console.error('Failed to toggle save:', error);
      toast.error(error.message || 'Failed to save job');
    }
  };

  const handleShare = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    const url = `${window.location.origin}/jobs/${job._id}`;
    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.employer.storeName}`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      jobType: '',
      city: '',
      minSalary: '',
      maxSalary: '',
      category: '',
      skills: '',
      locationSearch: '',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const formatSalary = (job: Job) => {
    return `₹${job.salary.amount.toLocaleString()}/${job.salary.period}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Browse Jobs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative bg-gray-50 rounded-2xl flex items-center px-4">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search jobs by title, skills, or company..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full py-3 bg-transparent outline-none text-gray-700 font-medium"
            />
          </div>
          <div className="relative">
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="w-full sm:w-40 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
            >
              <option value="">All Types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full sm:w-40 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <div className="flex-1 relative bg-gray-50 rounded-2xl flex items-center px-4">
            <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Filter by skills (e.g. cooking, driving)..."
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="w-full py-3 bg-transparent outline-none text-gray-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Filters Panel (Mobile) */}
      {showFilters && (
        <div className="lg:hidden bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
              <input
                type="number"
                placeholder="Min salary"
                value={filters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
              <input
                type="number"
                placeholder="Max salary"
                value={filters.maxSalary}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex-1 flex items-center gap-4">
          <input
            type="text"
            placeholder="City or location..."
            value={filters.locationSearch || filters.city}
            onChange={(e) => handleFilterChange('locationSearch', e.target.value)}
            className="w-48 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <input
            type="number"
            placeholder="Min salary"
            value={filters.minSalary}
            onChange={(e) => handleFilterChange('minSalary', e.target.value)}
            className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <input
            type="number"
            placeholder="Max salary"
            value={filters.maxSalary}
            onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
            className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-forest-700 hover:text-forest-900 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {jobs.length} of {pagination.totalItems} jobs
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-50">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6 font-medium">Try adjusting your filters or search criteria</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-lime-200 text-forest-900 rounded-full font-bold hover:bg-lime-300 transition-all shadow-sm active:scale-95"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="group bg-white rounded-3xl p-8 border border-gray-50 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 z-10" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleToggleSave(e, job._id)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    title={job.isSaved ? "Remove from saved" : "Save job"}
                  >
                    <Bookmark className={`w-5 h-5 transition-colors ${job.isSaved ? 'text-forest-700 fill-forest-700' : 'text-gray-400 group-hover:text-forest-600'}`} />
                  </button>
                  <button
                    onClick={(e) => handleShare(e, job)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    title="Share job"
                  >
                    <Share2 className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-bold border border-gray-100 group-hover:bg-forest-50 group-hover:border-forest-100 transition-colors mb-6">
                {job.employer.storeName[0]}
              </div>

              <h3 className="text-xl font-bold text-forest-900 mb-2 line-clamp-2 group-hover:text-forest-700 transition-colors">{job.title}</h3>
              <p className="text-sm text-gray-400 mb-8 font-medium">{job.employer.storeName}</p>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-500 mb-10 mt-auto">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-300" />
                  <span className="truncate">{job.location.city}, {job.location.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-300" />
                  <span className="font-semibold text-gray-900">{formatSalary(job)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-300" />
                  <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-300" />
                  <span>{job.totalApplications} apps</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job._id}`);
                  }}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold text-base shadow-sm transition-all duration-300",
                    'bg-forest-900 text-white hover:bg-forest-800 hover:shadow-lg'
                  )}
                >
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: window.location.pathname } });
                      toast.info('Please sign in to apply for this job');
                    } else {
                      navigate(`/jobs/${job._id}?apply=true`);
                    }
                  }}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-bold text-base shadow-sm transition-all duration-300",
                    'bg-lime-200 text-forest-900 hover:bg-lime-300 hover:shadow-md'
                  )}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPagination((prev) => ({ ...prev, currentPage: page }))}
              className={`w-10 h-10 rounded-lg font-medium ${pagination.currentPage === page
                ? 'bg-forest-900 text-white'
                : 'border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
