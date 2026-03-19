import { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';
import { applicationsApi } from '@/api/applications';
import { resumeApi } from '@/api/resume';
import type { Job, Application } from '@/types';

export function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<{ url: string; name: string } | null>(null);

  const statusOptions = ['all', 'applied', 'reviewing', 'accepted', 'rejected'];

  useEffect(() => {
    if (id) {
      fetchJobAndApplications();
    }
  }, [id, statusFilter, pagination.currentPage]);

  const fetchJobAndApplications = async () => {
    try {
      setIsLoading(true);
      
      // Fetch job details
      const jobResponse = await jobsApi.getById(id!);
      setJob(jobResponse.data);
      
      // Fetch applications
      const params: { status?: string; page: number; limit: number } = {
        page: pagination.currentPage,
        limit: 10,
      };
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const appsResponse = await applicationsApi.getJobApplications(id!, params);
      setApplications(appsResponse.data || []);
      setPagination({
        currentPage: appsResponse.pagination?.currentPage || 1,
        totalPages: appsResponse.pagination?.totalPages || 1,
        totalItems: appsResponse.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      await applicationsApi.accept(applicationId);
      fetchJobAndApplications();
    } catch (error) {
      console.error('Failed to accept application:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    try {
      await applicationsApi.reject(selectedApplication._id, rejectionReason);
      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason('');
      fetchJobAndApplications();
    } catch (error) {
      console.error('Failed to reject application:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewResume = async (applicantId: string, applicantName: string) => {
    try {
      const response = await resumeApi.getApplicantResume(applicantId);
      if (response.data?.url) {
        setPreviewData({ url: response.data.url, name: applicantName });
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      alert('Resume not available');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-50 text-blue-700',
      reviewing: 'bg-yellow-50 text-yellow-700',
      accepted: 'bg-forest-50 text-forest-800',
      rejected: 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-[#F5F5ED] text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
        <NavLink to="/employer/jobs" className="text-forest-700 hover:text-forest-900">
          Back to Jobs
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Applications</h1>
          <p className="text-gray-500">{job.title} • {pagination.totalItems} applications</p>
        </div>
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status || (status === 'all' && !statusFilter)
                  ? 'bg-forest-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500">Applications will appear here when candidates apply</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center">
                        <span className="text-forest-700 font-bold text-lg">
                          {application.applicant.name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{application.applicant.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.applicant.phone}
                          </span>
                          {application.applicant.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {application.applicant.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    {application.applicant.experience !== undefined && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {application.applicant.experience} years experience
                      </span>
                    )}
                    {application.expectedSalary && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{application.expectedSalary}/hour expected
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      Applied on {formatDate(application.createdAt)}
                    </span>
                  </div>

                  {application.applicant.skills && application.applicant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {application.applicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {application.coverLetter && (
                    <div className="p-4 bg-[#F5F5ED] rounded-xl mb-4">
                      <p className="text-sm text-gray-600 italic">"{application.coverLetter}"</p>
                    </div>
                  )}

                  {application.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                      <p className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {application.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewResume(application.applicant._id, application.applicant.name)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </button>
                  
                  {application.status === 'applied' || application.status === 'reviewing' ? (
                    <>
                      <button
                        onClick={() => handleAccept(application._id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/employer/applicants/${application.applicant._id}`)}
                      className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium hover:bg-forest-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
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
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Reject Application</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Are you sure you want to reject {selectedApplication.applicant.name}'s application?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedApplication(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Confirm Reject'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Resume Preview</h2>
                <p className="text-sm text-gray-500">{previewData.name}'s Resume</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-2 bg-forest-50 text-forest-700 rounded-lg text-sm font-bold hover:bg-forest-100 transition-colors"
                >
                  Download PDF
                </a>
                <button
                  onClick={() => setPreviewData(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-cream-50/30 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 animate-pulse-slow">
                <FileText className="w-12 h-12 text-forest-900" />
              </div>
              <h3 className="text-2xl font-extrabold text-forest-900 mb-2">Resume Preview</h3>
              <p className="text-gray-500 mb-10 max-w-sm font-medium">
                The document is ready to view. For the best experience, click below to open it in a new browser tab.
              </p>
              
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <a
                  href={previewData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-4 px-8 text-lg flex items-center justify-center gap-3 shadow-btn active:scale-95 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  Open Full Resume
                </a>
                <p className="text-xs text-gray-400 font-medium">
                  Direct Link: {previewData.name.split(' ')[0]}_resume.pdf
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
