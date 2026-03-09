import { useEffect, useState, useCallback } from 'react';
import { 
  Users,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';
import { adminApi } from '@/api/admin';
import type { User } from '@/types';

export function ApplicantsPage() {
  const [applicants, setApplicants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, unknown> = {
        page: pagination.currentPage,
        limit: 10,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.isActive !== '') params.isActive = filters.isActive === 'true';

      const response = await adminApi.getApplicants(params);
      setApplicants(response.data || []);
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

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this applicant?')) return;
    
    setIsProcessing(id);
    try {
      await adminApi.deactivateApplicant(id);
      fetchApplicants();
    } catch (error) {
      console.error('Failed to deactivate applicant:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      isActive: '',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Manage Applicants</h1>
        <p className="text-gray-500">View and manage applicant accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-forest-700 hover:text-forest-900 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {applicants.length} of {pagination.totalItems} applicants
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                        <span className="text-forest-700 font-bold">
                          {applicant.name?.[0] || 'A'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                        <p className="text-sm text-gray-500">
                          {applicant.experience ? `${applicant.experience} years experience` : 'No experience listed'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {applicant.isActive === false ? (
                        <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{applicant.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{applicant.phone || 'N/A'}</span>
                    </div>
                    {applicant.preferredWorkLocation && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{applicant.preferredWorkLocation}</span>
                      </div>
                    )}
                  </div>

                  {applicant.skills && applicant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {applicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {applicant.isActive !== false && (
                    <button
                      onClick={() => handleDeactivate(applicant._id)}
                      disabled={isProcessing === applicant._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing === applicant._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Deactivate
                    </button>
                  )}
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
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
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
      )}
    </div>
  );
}
