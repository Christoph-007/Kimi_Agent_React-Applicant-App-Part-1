import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';
import { applicationsApi } from '@/api/applications';
import { shiftsApi } from '@/api/shifts';
import type { Job, Application } from '@/types';
import { toast } from 'sonner';

export function CreateShiftPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [acceptedApplicants, setAcceptedApplicants] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    jobId: '',
    applicantId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    instructions: '',
    paymentAmount: '',
  });

  useEffect(() => {
    fetchJobsAndApplicants();
  }, []);

  const fetchJobsAndApplicants = async () => {
    try {
      setIsLoading(true);

      // Fetch jobs - removed status filter to ensure employer can see their jobs
      // We will filter for jobs with accepted applicants in the render logic or here
      const jobsResponse = await jobsApi.getEmployerJobs();
      const allJobs = jobsResponse.data || [];
      setJobs(allJobs);

      if (allJobs.length === 0) {
        toast.info('No jobs found. Please post a job first.');
      }

      // If editing, fetch shift details
      if (isEditMode) {
        const shiftResponse = await shiftsApi.getById(id!);
        const shift = shiftResponse.data;
        setFormData({
          jobId: shift.job._id,
          applicantId: shift.applicant._id,
          date: shift.date.split('T')[0],
          startTime: shift.startTime,
          endTime: shift.endTime,
          location: shift.location,
          instructions: shift.instructions || '',
          paymentAmount: shift.paymentAmount?.toString() || '',
        });
        // Fetch applicants for this job
        fetchApplicantsForJob(shift.job._id);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load jobs. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicantsForJob = async (jobId: string) => {
    try {
      const response = await applicationsApi.getJobApplications(jobId, { status: 'accepted' });
      const applicants = response.data || [];
      setAcceptedApplicants(applicants);

      if (applicants.length === 0) {
        toast.info('No accepted applicants for this job yet.');
      }
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
      toast.error('Failed to load accepted applicants.');
    }
  };

  const handleJobChange = (jobId: string) => {
    const selectedJob = jobs.find(j => j._id === jobId);
    
    // Construct location string from job location
    let locationStr = '';
    if (selectedJob) {
      const { address, city, state, pincode } = selectedJob.location;
      const parts = [address, city, state, pincode].filter(Boolean);
      locationStr = parts.join(', ');
    }

    setFormData((prev) => ({ 
      ...prev, 
      jobId, 
      applicantId: '', 
      location: locationStr || prev.location 
    }));

    if (jobId) {
      fetchApplicantsForJob(jobId);
    } else {
      setAcceptedApplicants([]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.jobId) return 'Please select a job';
    if (!formData.applicantId) return 'Please select an applicant';
    if (!formData.date) return 'Please select a date';
    if (!formData.startTime) return 'Please select a start time';
    if (!formData.endTime) return 'Please select an end time';
    if (!formData.location.trim()) return 'Please enter a location';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      const submitData = {
        jobId: formData.jobId,
        applicantId: formData.applicantId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        instructions: formData.instructions.trim() || undefined,
        paymentAmount: formData.paymentAmount ? parseInt(formData.paymentAmount) : undefined,
      };

      if (isEditMode) {
        await shiftsApi.update(id!, submitData);
        toast.success('Shift updated successfully');
      } else {
        await shiftsApi.create(submitData);
        toast.success('Shift created successfully');
      }
      navigate('/employer/shifts');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save shift. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
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
          <h1 className="text-2xl font-bold text-forest-900">
            {isEditMode ? 'Edit Shift' : 'Create New Shift'}
          </h1>
          <p className="text-gray-500">
            {isEditMode ? 'Update shift details' : 'Schedule a shift with an accepted applicant'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-6">
        {/* Select Job */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Job <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.jobId}
            onChange={(e) => handleJobChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent appearance-none bg-white"
            required
            disabled={isEditMode}
          >
            <option value="">{jobs.length === 0 ? 'No jobs available' : 'Select a job...'}</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} ({job.acceptedApplicants || 0} accepted)
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {jobs.length === 0
              ? 'You have not posted any jobs yet.'
              : 'Jobs with accepted applicants will show candidates below.'}
          </p>
        </div>

        {/* Select Applicant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Applicant <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.applicantId}
            onChange={(e) => handleChange('applicantId', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent appearance-none bg-white"
            required
            disabled={isEditMode || !formData.jobId}
          >
            <option value="">
              {!formData.jobId ? 'Select a job first' : 'Select an applicant...'}
            </option>
            {acceptedApplicants.map((app) => (
              <option key={app.applicant._id} value={app.applicant._id}>
                {app.applicant.name}
              </option>
            ))}
          </select>
          {formData.jobId && acceptedApplicants.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No accepted applicants for this job. Accept an application first.
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        {/* Time */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., 123 Main St, Mumbai"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions (Optional)
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder="Any special instructions for the worker..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount (₹) (Optional)
          </label>
          <input
            type="number"
            value={formData.paymentAmount}
            onChange={(e) => handleChange('paymentAmount', e.target.value)}
            placeholder="Total payment for this shift"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || acceptedApplicants.length === 0}
            className="flex-1 py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {isEditMode ? 'Save Changes' : 'Create Shift'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
