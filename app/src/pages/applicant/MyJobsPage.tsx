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
  User,
  Bookmark
} from 'lucide-react';
import { applicationsApi } from '@/api/applications';
import { jobRequestsApi } from '@/api/jobRequests';
import { jobsApi } from '@/api/jobs';
import type { Application, JobRequest, Job } from '@/types';
import { toast } from 'sonner';

export function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'applications' | 'requests' | 'saved'>('active');
  const [activeJobs, setActiveJobs] = useState<(Application | JobRequest)[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
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
    if (activeTab === 'active') {
      fetchActiveJobs();
    } else if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'requests') {
      fetchRequests();
    } else if (activeTab === 'saved') {
      fetchSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.currentPage]);

  const fetchActiveJobs = async () => {
    try {
      setIsLoading(true);
      const [appRes, reqRes] = await Promise.all([
        applicationsApi.getMyApplications({ status: 'accepted', limit: 50 }),
        jobRequestsApi.getReceivedRequests({ status: 'accepted', limit: 50 })
      ]);

      const apps = appRes.data || [];
      const reqs = reqRes.data || [];

      // Deduplicate if a job request created an application
      const uniqueReqs = reqs.filter(req => {
        if (!req.job) return true;
        const jobId = typeof req.job === 'string' ? req.job : req.job._id;
        return !apps.some(app => app.job._id === jobId);
      });

      const combined = [...apps, ...uniqueReqs].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setActiveJobs(combined);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: combined.length,
      });
    } catch (error) {
      console.error('Failed to fetch active jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const fetchSavedJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobsApi.getSaved();
      setSavedJobs(response.data || []);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: response.data?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      toast.error('Failed to fetch saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await applicationsApi.withdraw(applicationId);
      toast.success('Application withdrawn successfully');
      fetchApplications();
    } catch (error) {
      console.error('Failed to withdraw application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      await jobsApi.toggleSave(jobId);
      toast.success('Job removed from saved');
      fetchSavedJobs();
    } catch (error) {
      console.error('Failed to unsave job:', error);
      toast.error('Failed to remove job');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setIsProcessing(true);
    try {
      await jobRequestsApi.accept(requestId);
      toast.success('Job request accepted successfully');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error('Failed to accept request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      await jobRequestsApi.decline(selectedRequest._id, declineReason);
      toast.success('Job request declined');
      setShowDeclineModal(false);
      setSelectedRequest(null);
      setDeclineReason('');
      fetchRequests();
    } catch (error) {
      console.error('Failed to decline request:', error);
      toast.error('Failed to decline request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-50 text-blue-700',
      reviewing: 'bg-yellow-50 text-yellow-700',
      accepted: 'bg-forest-50 text-forest-800',
      rejected: 'bg-red-50 text-red-700',
      withdrawn: 'bg-[#F5F5ED] text-gray-700',
      sent: 'bg-blue-50 text-blue-700',
      declined: 'bg-red-50 text-red-700',
      expired: 'bg-[#F5F5ED] text-gray-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
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
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'active', label: 'Active Jobs', count: activeJobs.length },
          { id: 'applications', label: 'My Applications', count: applications.length },
          { id: 'requests', label: 'Job Requests', count: requests.length },
          { id: 'saved', label: 'Saved Jobs', count: savedJobs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
            }}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-forest-900 text-forest-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
            {tab.count > 0 && (activeTab === tab.id) && (
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
      ) : activeTab === 'active' ? (
        activeJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-forest-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active jobs yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Once your applications are accepted or you accept job requests, they will appear here as your active working jobs.
            </p>
            <NavLink
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest-900 text-white rounded-full font-bold hover:bg-forest-800 transition-all shadow-lg hover:shadow-forest-900/20 active:scale-95"
            >
              <Briefcase className="w-5 h-5" />
              Find Your Next Job
            </NavLink>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 mb-2">
              <div className="flex items-center gap-3 text-forest-800">
                <div className="p-2 bg-forest-900 text-white rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider">Currently Employed</h4>
                  <p className="text-sm opacity-80">You have {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''} currently.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeJobs.map((item) => {
                const isJobRequest = 'jobTitle' in item;
                const employer = item.employer;
                const title = !isJobRequest ? (item as Application).job.title : (item as JobRequest).jobTitle;
                const location = !isJobRequest ? (item as Application).job.location.city : (item as JobRequest).location;
                const salary = !isJobRequest 
                  ? `₹${(item as Application).job.salary.amount}/${(item as Application).job.salary.period}`
                  : `₹${(item as JobRequest).offeredHourlyRate}/hour`;

                return (
                  <div key={item._id} className="bg-white rounded-2xl p-6 shadow-card border-l-4 border-forest-600 hover:shadow-card-hover transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-black text-forest-700 shadow-inner">
                          {employer.storeName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <span className="px-2.5 py-0.5 bg-forest-100 text-forest-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                              Active
                            </span>
                          </div>
                          <p className="text-forest-700 font-medium mb-3">{employer.storeName}</p>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-forest-600" />
                              {location}
                            </span>
                            <span className="flex items-center gap-1.5 font-semibold text-forest-900">
                              <DollarSign className="w-4 h-4" />
                              {salary}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-forest-600" />
                              Joined {formatDate(item.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <NavLink
                          to={!isJobRequest ? `/jobs/${(item as Application).job._id}` : '#'}
                          className="px-6 py-2.5 bg-[#F5F5ED] text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          Details
                        </NavLink>
                        <NavLink
                          to="/attendance"
                          className="px-6 py-2.5 bg-forest-900 text-white rounded-xl text-sm font-bold hover:bg-forest-800 transition-all shadow-md active:scale-95 flex items-center gap-2"
                        >
                          <span>⏰</span>
                          Clock In / Out
                        </NavLink>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
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
                    Expires {formatDate(request.expiresAt)}
                  </span>
                </div>

                {request.message && (
                  <div className="p-3 bg-[#F5F5ED] rounded-xl text-sm text-gray-600 mb-4">
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
        )
      ) : ( // This is for activeTab === 'saved'
        savedJobs.length === 0 ? (
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
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow relative">
                <button
                  onClick={() => handleUnsave(job._id)}
                  className="absolute top-4 right-4 p-2 bg-[#F5F5ED] hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove from saved"
                >
                  <Bookmark className="w-5 h-5 fill-current text-forest-700" />
                </button>

                <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-forest-700 font-bold text-lg">
                    {job.employer.storeName[0]}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{job.employer.storeName}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{job.location.city}, {job.location.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    <span>₹{job.salary.amount}/{job.salary.period}</span>
                  </div>
                </div>

                <NavLink
                  to={`/jobs/${job._id}`}
                  className="block w-full text-center py-2.5 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
                >
                  View Details
                </NavLink>
              </div>
            ))}
          </div>
        )
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
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Shift Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedRequest.shiftType}</p>
                </div>
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
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
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
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
