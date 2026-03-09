import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Briefcase, 
  Clock,
  MapPin,
  DollarSign,
  Building2,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { applicationsApi } from '@/api/applications';
import { jobRequestsApi } from '@/api/jobRequests';
import type { Application, JobRequest } from '@/types';

export function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'requests' | 'saved'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<JobRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab, pagination.currentPage]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await applicationsApi.getMyApplications({
        page: pagination.currentPage,
        limit: 10,
      });
      setApplications(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await jobRequestsApi.getReceivedRequests({
        page: pagination.currentPage,
        limit: 10,
      });
      setRequests(response.data || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    
    try {
      await applicationsApi.withdraw(applicationId);
      fetchApplications();
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setIsProcessing(true);
    try {
      await jobRequestsApi.accept(requestId);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    try {
      await jobRequestsApi.decline(selectedRequest._id, declineReason);
      setShowDeclineModal(false);
      setSelectedRequest(null);
      setDeclineReason('');
      fetchRequests();
    } catch (error) {
      console.error('Failed to decline request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-50 text-blue-700',
      reviewing: 'bg-yellow-50 text-yellow-700',
      accepted: 'bg-green-50 text-green-700',
      rejected: 'bg-red-50 text-red-700',
      withdrawn: 'bg-gray-50 text-gray-700',
      sent: 'bg-blue-50 text-blue-700',
      declined: 'bg-red-50 text-red-700',
      expired: 'bg-gray-50 text-gray-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">My Jobs</h1>
        <p className="text-gray-500">Manage your applications and job requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'applications', label: 'My Applications', count: applications.length },
          { id: 'requests', label: 'Job Requests', count: requests.length },
          { id: 'saved', label: 'Saved Jobs', count: 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-forest-900 text-forest-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
        </div>
      ) : activeTab === 'applications' ? (
        applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-4">Start applying to jobs to see them here</p>
            <NavLink
              to="/jobs"
              className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
            >
              Browse Jobs
            </NavLink>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                          <span className="text-forest-700 font-bold">
                            {application.employer.storeName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                          <p className="text-sm text-gray-500">{application.employer.storeName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {application.job.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{application.job.salary.amount}/{application.job.salary.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied {formatDate(application.createdAt)}
                      </span>
                    </div>

                    {application.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">
                        <strong>Reason:</strong> {application.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <NavLink
                      to={`/jobs/${application.job._id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Job
                    </NavLink>
                    {application.status !== 'withdrawn' && application.status !== 'rejected' && (
                      <button
                        onClick={() => handleWithdraw(application._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Withdraw
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
        )
      ) : activeTab === 'requests' ? (
        requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No job requests</h3>
            <p className="text-gray-500">Employers will send you job requests here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                      <span className="text-forest-700 font-bold">
                        {request.employer.storeName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.jobTitle}</h3>
                      <p className="text-sm text-gray-500">{request.employer.storeName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {request.employer.businessType}
                  </span>
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
                    Expires {formatDate(request.expiryDate)}
                  </span>
                </div>

                {request.message && (
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600 mb-4">
                    <strong>Message:</strong> {request.message}
                  </div>
                )}

                {request.status === 'sent' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                )}
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
        )
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs</h3>
          <p className="text-gray-500 mb-4">Save jobs you're interested in to apply later</p>
          <NavLink
            to="/jobs"
            className="inline-block px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
          >
            Browse Jobs
          </NavLink>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Job Request Details</h2>
              <button onClick={() => setSelectedRequest(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedRequest.jobTitle}</h3>
                <p className="text-gray-500">{selectedRequest.employer.storeName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Shift Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedRequest.shiftType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Hourly Rate</p>
                  <p className="font-medium text-gray-900">₹{selectedRequest.offeredHourlyRate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Location</p>
                <p className="text-gray-900">{selectedRequest.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Job Description</p>
                <p className="text-gray-900">{selectedRequest.jobDescription}</p>
              </div>

              {selectedRequest.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message from Employer</p>
                  <p className="text-gray-900">{selectedRequest.message}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setShowDeclineModal(true);
                  }}
                  className="flex-1 py-3 border-2 border-red-200 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAcceptRequest(selectedRequest._id)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Accept
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Decline Job Request</h2>
            </div>

            <div className="p-6 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-orange-500" />
              <p className="text-center text-gray-600">
                Are you sure you want to decline this job request from {selectedRequest.employer.storeName}?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Tell the employer why you're declining..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason('');
                    setSelectedRequest(null);
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineRequest}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Decline Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
