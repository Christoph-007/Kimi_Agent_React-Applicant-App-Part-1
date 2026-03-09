import { useEffect, useState, useCallback } from 'react';
import { 
  Building2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { adminApi } from '@/api/admin';
import type { User } from '@/types';

export function EmployersPage() {
  const [employers, setEmployers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    isApproved: '',
    isBlocked: '',
    businessType: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const businessTypes = ['Restaurant', 'Retail', 'Hotel', 'Warehouse', 'Healthcare', 'Logistics', 'Security', 'Other'];

  const fetchEmployers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, unknown> = {
        page: pagination.currentPage,
        limit: 10,
      };
      
      if (filters.search) params.search = filters.search;
      if (filters.isApproved !== '') params.isApproved = filters.isApproved === 'true';
      if (filters.isBlocked !== '') params.isBlocked = filters.isBlocked === 'true';
      if (filters.businessType) params.businessType = filters.businessType;

      const response = await adminApi.getEmployers(params);
      setEmployers(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch employers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchEmployers();
  }, [fetchEmployers]);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    try {
      await adminApi.approveEmployer(id);
      fetchEmployers();
    } catch (error) {
      console.error('Failed to approve employer:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleBlock = async (id: string) => {
    setIsProcessing(id);
    try {
      await adminApi.blockEmployer(id);
      fetchEmployers();
    } catch (error) {
      console.error('Failed to block employer:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUnblock = async (id: string) => {
    setIsProcessing(id);
    try {
      await adminApi.unblockEmployer(id);
      fetchEmployers();
    } catch (error) {
      console.error('Failed to unblock employer:', error);
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
      isApproved: '',
      isBlocked: '',
      businessType: '',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Manage Employers</h1>
        <p className="text-gray-500">View, approve, and manage employer accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by store name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.isApproved}
              onChange={(e) => handleFilterChange('isApproved', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="">All Approval Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
            <select
              value={filters.isBlocked}
              onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="">All Block Status</option>
              <option value="true">Blocked</option>
              <option value="false">Active</option>
            </select>
            <select
              value={filters.businessType}
              onChange={(e) => handleFilterChange('businessType', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="">All Business Types</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
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
        Showing {employers.length} of {pagination.totalItems} employers
      </div>

      {/* Employers List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : employers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No employers found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {employers.map((employer) => (
            <div key={employer._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                        <span className="text-forest-700 font-bold">
                          {employer.storeName?.[0] || 'E'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{employer.storeName}</h3>
                        <p className="text-sm text-gray-500">{employer.businessType}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!employer.isApproved && (
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                          Pending Approval
                        </span>
                      )}
                      {employer.isBlocked && (
                        <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                          Blocked
                        </span>
                      )}
                      {employer.isApproved && !employer.isBlocked && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{employer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{employer.phone || 'N/A'}</span>
                    </div>
                    {employer.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{employer.address.city}, {employer.address.state}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!employer.isApproved && (
                    <button
                      onClick={() => handleApprove(employer._id)}
                      disabled={isProcessing === employer._id}
                      className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing === employer._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  )}
                  {employer.isBlocked ? (
                    <button
                      onClick={() => handleUnblock(employer._id)}
                      disabled={isProcessing === employer._id}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(employer._id)}
                      disabled={isProcessing === employer._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Block
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
