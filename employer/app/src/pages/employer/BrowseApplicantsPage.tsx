import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Eye,
  Send
} from 'lucide-react';
import { employerApi } from '@/api/employer';
import type { Applicant } from '@/types';

interface ApplicantWithShortlist extends Applicant {
  isShortlisted?: boolean;
}

export function BrowseApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantWithShortlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    jobCategory: '',
    preferredShiftType: '',
    preferredWorkLocation: '',
    minHourlyRate: '',
    maxHourlyRate: '',
    availableDay: '',
    sortBy: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const jobCategories = ['Food Service', 'Retail', 'Logistics', 'Healthcare', 'Hospitality', 'Warehouse', 'Security', 'Driver'];
  const shiftTypes = ['morning', 'evening', 'night', 'flexible', 'weekends-only'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, unknown> = {
        page: pagination.currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        order: filters.order,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.jobCategory) params.jobCategory = filters.jobCategory;
      if (filters.preferredShiftType) params.preferredShiftType = filters.preferredShiftType;
      if (filters.preferredWorkLocation) params.preferredWorkLocation = filters.preferredWorkLocation;
      if (filters.minHourlyRate) params.minHourlyRate = parseInt(filters.minHourlyRate);
      if (filters.maxHourlyRate) params.maxHourlyRate = parseInt(filters.maxHourlyRate);
      if (filters.availableDay) params.availableDay = filters.availableDay;

      const response = await employerApi.getApplicants(params);
      const applicantsData = response.data || [];
      
      // Check shortlist status for each applicant
      const applicantsWithShortlist = await Promise.all(
        applicantsData.map(async (applicant) => {
          try {
            const checkResponse = await employerApi.checkShortlist(applicant._id);
            return { ...applicant, isShortlisted: checkResponse.data?.isShortlisted };
          } catch {
            return { ...applicant, isShortlisted: false };
          }
        })
      );
      
      setApplicants(applicantsWithShortlist);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      jobCategory: '',
      preferredShiftType: '',
      preferredWorkLocation: '',
      minHourlyRate: '',
      maxHourlyRate: '',
      availableDay: '',
      sortBy: 'createdAt',
      order: 'desc',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleShortlist = async (applicantId: string) => {
    try {
      await employerApi.addToShortlist(applicantId);
      fetchApplicants();
    } catch (error) {
      console.error('Failed to add to shortlist:', error);
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== 'createdAt' && v !== 'desc');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Browse Applicants</h1>
          <p className="text-gray-500">Find and connect with qualified candidates</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-forest-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, skills, or location..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Category</label>
              <select
                value={filters.jobCategory}
                onChange={(e) => handleFilterChange('jobCategory', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {jobCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
              <select
                value={filters.preferredShiftType}
                onChange={(e) => handleFilterChange('preferredShiftType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
              >
                <option value="">All Shifts</option>
                {shiftTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Day</label>
              <select
                value={filters.availableDay}
                onChange={(e) => handleFilterChange('availableDay', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
              >
                <option value="">Any Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="City name"
                value={filters.preferredWorkLocation}
                onChange={(e) => handleFilterChange('preferredWorkLocation', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rate (₹/hr)</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minHourlyRate}
                onChange={(e) => handleFilterChange('minHourlyRate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate (₹/hr)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxHourlyRate}
                onChange={(e) => handleFilterChange('maxHourlyRate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-forest-700 hover:text-forest-900 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count & Sort */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {applicants.length} of {pagination.totalItems} applicants
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none bg-white"
          >
            <option value="createdAt">Newest</option>
            <option value="expectedHourlyRate">Rate</option>
            <option value="experience">Experience</option>
          </select>
        </div>
      </div>

      {/* Applicants Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center">
                  <span className="text-forest-700 font-bold text-lg">{(applicant.name || 'U')[0]}</span>
                </div>
                <button
                  onClick={() => handleShortlist(applicant._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    applicant.isShortlisted
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-5 h-5 ${applicant.isShortlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 text-lg mb-1">{applicant.name || 'Unknown Applicant'}</h3>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {applicant.preferredWorkLocation || 'Location not specified'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {applicant.preferredShiftType
                    ? applicant.preferredShiftType.charAt(0).toUpperCase() + applicant.preferredShiftType.slice(1).replace('-', ' ')
                    : 'Shift not specified'}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {applicant.expectedHourlyRate
                    ? `₹${applicant.expectedHourlyRate}/hr`
                    : 'Rate not specified'}
                </div>
                {applicant.experience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {applicant.experience} years experience
                  </div>
                )}
              </div>

              {applicant.jobCategories && applicant.jobCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {applicant.jobCategories.slice(0, 3).map((cat) => (
                    <span key={cat} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {cat}
                    </span>
                  ))}
                  {applicant.jobCategories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{applicant.jobCategories.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/employer/applicants/${applicant._id}`)}
                  className="flex-1 px-3 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => navigate(`/employer/applicants/${applicant._id}/request`)}
                  className="flex-1 px-3 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="w-4 h-4" />
                  Request
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
  );
}
