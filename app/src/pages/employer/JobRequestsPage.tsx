import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Mail,
  MapPin,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { jobRequestsApi } from '@/api/jobRequests';
import type { JobRequest } from '@/types';

export function JobRequestsPage() {
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const statusOptions = ['all', 'sent', 'accepted', 'declined', 'expired'];

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, pagination.currentPage]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const params: { status?: string; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await jobRequestsApi.getSentRequests(params);
      setRequests(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch job requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-blue-50 text-blue-700',
      accepted: 'bg-forest-50 text-forest-800',
      declined: 'bg-red-50 text-red-700',
      expired: 'bg-[#F5F5ED] text-gray-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ElementType> = {
      sent: Clock,
      accepted: CheckCircle,
      declined: XCircle,
      expired: Clock,
    };
    return icons[status] || Clock;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Job Requests</h1>
          <p className="text-gray-500">Track job requests sent to applicants</p>
        </div>
        <NavLink
          to="/employer/applicants"
          className="px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Send New Request
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === status || (status === 'all' && !statusFilter)
                  ? 'bg-forest-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {requests.length} of {pagination.totalItems} requests
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No job requests sent</h3>
          <p className="text-gray-500 mb-4">Send job requests to applicants you're interested in</p>
          <NavLink
            to="/employer/applicants"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Browse Applicants
          </NavLink>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <div key={request._id} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                          <span className="text-forest-700 font-bold">
                            {request.applicant.name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.jobTitle}</h3>
                          <p className="text-sm text-gray-500">To: {request.applicant.name}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        {request.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {request.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{request.offeredHourlyRate}/hour
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expires {formatDate(request.expiresAt)}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F5F5ED] rounded-xl text-sm text-gray-600 mb-4">
                      {request.jobDescription}
                    </div>

                    {request.message && (
                      <div className="p-3 bg-forest-50 rounded-xl text-sm text-forest-700 mb-4">
                        <strong>Your Message:</strong> {request.message}
                      </div>
                    )}

                    {request.declineReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <strong>Decline Reason:</strong> {request.declineReason}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/employer/applicants/${request.applicant._id}`)}
                      className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

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
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
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
