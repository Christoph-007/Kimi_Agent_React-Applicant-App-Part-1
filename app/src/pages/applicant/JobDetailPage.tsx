import { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Calendar,
  Building2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/api/jobs';
import type { Job } from '@/types';
import { toast } from 'sonner';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await jobsApi.getById(id!);
      setJob(response.data);
      if (searchParams.get('apply') === 'true' && !response.data.hasApplied && isAuthenticated) {
        setShowApplyModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsApplying(true);

    try {
      await jobsApi.apply(id!, {
        coverLetter: coverLetter.trim() || undefined,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
      });
      setSuccess('Application submitted successfully!');
      setShowApplyModal(false);
      // Refresh job details to update hasApplied status
      await fetchJobDetails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    if (!job) return;
    setIsSaving(true);
    try {
      const response: any = await jobsApi.toggleSave(job._id);
      const isSaved = response.data?.isSaved;
      setJob({ ...job, isSaved: isSaved });
      toast.success(isSaved ? 'Job saved' : 'Job removed from saved');
    } catch (err: any) {
      console.error('Failed to save job:', err);
      toast.error(err.message || 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!job) return;

    const shareData = {
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.employer.storeName}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  const formatSalary = (job: Job) => {
    return `₹${job.salary.amount.toLocaleString()}/${job.salary.period}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
        <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <NavLink
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </NavLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </button>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-forest-50 border border-forest-200 rounded-xl text-forest-800 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center">
                  <span className="text-forest-700 font-bold text-2xl">
                    {job.employer.storeName[0]}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-gray-500">{job.employer.storeName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  title={job.isSaved ? "Unsave Job" : "Save Job"}
                >
                  <Bookmark className={`w-5 h-5 transition-colors ${job.isSaved ? 'text-forest-700 fill-forest-700' : 'text-gray-400 group-hover:text-forest-600'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  title="Share Job"
                >
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-forest-600 transition-colors" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-4 py-2 bg-forest-50 text-forest-800 text-sm font-medium rounded-full capitalize">
                {job.status}
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full capitalize">
                {job.jobType.replace('-', ' ')}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#F5F5ED] rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">
                    {job.location.city}, {job.location.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F5ED] rounded-xl">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900">{formatSalary(job)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F5ED] rounded-xl">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="font-medium text-gray-900">{job.employer.businessType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F5ED] rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-4">
                {job.requirements.minimumExperience !== undefined && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Experience</p>
                      <p className="text-gray-600">
                        Minimum {job.requirements.minimumExperience} years of relevant experience
                      </p>
                    </div>
                  </div>
                )}
                {job.requirements.skills && job.requirements.skills.length > 0 && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Skills Required</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.requirements.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {job.requirements.education && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Education</p>
                      <p className="text-gray-600">{job.requirements.education}</p>
                    </div>
                  </div>
                )}
                {job.requirements.otherRequirements && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Other Requirements</p>
                      <p className="text-gray-600">{job.requirements.otherRequirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Working Hours */}
          {job.workingHours && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {job.workingHours.hoursPerDay && (
                  <div className="p-4 bg-[#F5F5ED] rounded-xl">
                    <Clock className="w-5 h-5 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Hours per Day</p>
                    <p className="font-medium text-gray-900">{job.workingHours.hoursPerDay} hours</p>
                  </div>
                )}
                {job.workingHours.daysPerWeek && (
                  <div className="p-4 bg-[#F5F5ED] rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Days per Week</p>
                    <p className="font-medium text-gray-900">{job.workingHours.daysPerWeek} days</p>
                  </div>
                )}
                {job.workingHours.shiftTiming && (
                  <div className="p-4 bg-[#F5F5ED] rounded-xl">
                    <Clock className="w-5 h-5 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Shift Timing</p>
                    <p className="font-medium text-gray-900">{job.workingHours.shiftTiming}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-lime-50 text-forest-700 text-sm font-medium rounded-full"
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
          {/* Apply Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">{job.totalApplications} people have applied</p>
              <p className="text-3xl font-bold text-forest-900">{formatSalary(job)}</p>
              <p className="text-sm text-gray-500">per {job.salary.period}</p>
            </div>

            {job.hasApplied ? (
              <div className="p-4 bg-forest-50 border border-forest-200 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-forest-700" />
                <p className="font-medium text-forest-800">Already Applied</p>
                <p className="text-sm text-forest-700 mt-1">
                  Check your applications for status updates
                </p>
                <NavLink
                  to="/my-jobs"
                  className="inline-block mt-4 px-6 py-2 bg-forest-900 text-white rounded-full text-sm font-medium hover:bg-forest-800 transition-colors"
                >
                  View Application
                </NavLink>
              </div>
            ) : user?.type === 'employer' || user?.type === 'admin' ? (
              <button
                disabled
                className="w-full py-3.5 bg-gray-200 text-gray-500 rounded-full font-semibold cursor-not-allowed cursor-help"
                title="Only applicants can apply for jobs"
              >
                Employers cannot apply
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setShowApplyModal(true);
                  } else {
                    navigate('/login', { state: { from: window.location.pathname } });
                    toast.info('Please sign in to apply for this job');
                  }
                }}
                className="w-full py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors"
              >
                Apply Now
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium text-gray-900">{job.employer.storeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{job.location.address || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a good fit for this position..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Salary (₹ per hour)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your expected hourly rate"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="flex-1 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
