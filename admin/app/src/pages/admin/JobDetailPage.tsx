import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  FileText,
  Eye,
} from 'lucide-react';
import { adminApi } from '@/api/admin';
import type { Job } from '@/types';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchJob(id);
  }, [id]);

  const fetchJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getJobById(jobId);
      setJob(response.data);
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteJob(job._id);
      navigate('/admin/jobs');
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (j: Job) => {
    if (!j.salary?.amount) return '—';
    return `₹${j.salary.amount.toLocaleString()}/${j.salary.period}`;
  };

  const statusConfig = {
    open: { label: 'Open', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    closed: { label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-600', icon: AlertCircle },
    filled: { label: 'Filled', bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-300" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-6">{error ?? 'This job does not exist.'}</p>
        <button
          onClick={() => navigate('/admin/jobs')}
          className="px-6 py-3 bg-forest-700 text-white rounded-xl font-medium hover:bg-forest-900 transition-colors"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const status = statusConfig[job.status] ?? statusConfig.closed;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-2 text-gray-500 hover:text-forest-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete Job
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-forest-700 text-2xl font-bold">
                {job.employer?.storeName?.[0] ?? '?'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
              <p className="text-gray-500 text-lg">{job.employer?.storeName ?? 'Unknown Employer'}</p>
              <p className="text-sm text-gray-400 mt-1">{job.employer?.businessType ?? ''}</p>
            </div>
          </div>

          <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold capitalize self-start ${status.bg} ${status.text}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="font-medium text-gray-800 text-sm">
                {job.location?.city}, {job.location?.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Salary</p>
              <p className="font-medium text-gray-800 text-sm">{formatSalary(job)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Job Type</p>
              <p className="font-medium text-gray-800 text-sm capitalize">
                {job.jobType?.replace('-', ' ') ?? '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Applications</p>
              <p className="font-medium text-gray-800 text-sm">{job.totalApplications ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-700" />
              Job Description
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {job.description ?? 'No description provided.'}
            </p>
          </div>

          {/* Requirements */}
          {(job.requirements?.minimumExperience || job.requirements?.education || job.requirements?.otherRequirements) && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-forest-700" />
                Requirements
              </h2>
              <div className="space-y-3">
                {job.requirements?.minimumExperience !== undefined && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-2 shrink-0" />
                    Minimum experience: <strong className="ml-1">{job.requirements.minimumExperience} years</strong>
                  </div>
                )}
                {job.requirements?.education && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-2 shrink-0" />
                    Education: <strong className="ml-1">{job.requirements.education}</strong>
                  </div>
                )}
                {job.requirements?.otherRequirements && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-2 shrink-0" />
                    {job.requirements.otherRequirements}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {job.requirements?.skills && job.requirements.skills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.requirements.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-forest-50 text-forest-700 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-4">
              {job.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Posted On</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              )}

              {job.expiryDate && (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Expires On</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(job.expiryDate)}</p>
                  </div>
                </div>
              )}

              {job.workingHours?.shiftTiming && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Shift Timing</p>
                    <p className="text-sm font-medium text-gray-800">{job.workingHours.shiftTiming}</p>
                  </div>
                </div>
              )}

              {job.workingHours?.hoursPerDay && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Hours / Day</p>
                    <p className="text-sm font-medium text-gray-800">{job.workingHours.hoursPerDay}h</p>
                  </div>
                </div>
              )}

              {job.workingHours?.daysPerWeek && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Days / Week</p>
                    <p className="text-sm font-medium text-gray-800">{job.workingHours.daysPerWeek} days</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Total Views</p>
                  <p className="text-sm font-medium text-gray-800">{job.views ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employer Info */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-forest-700" />
              Employer Info
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Store Name</p>
                <p className="text-sm font-medium text-gray-800">{job.employer?.storeName ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Business Type</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{job.employer?.businessType ?? '—'}</p>
              </div>
              {job.location?.address && (
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-800">{job.location.address}</p>
                </div>
              )}
              {job.location?.pincode && (
                <div>
                  <p className="text-xs text-gray-400">Pincode</p>
                  <p className="text-sm font-medium text-gray-800">{job.location.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
