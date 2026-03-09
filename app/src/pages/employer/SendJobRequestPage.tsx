import { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  Send,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { employerApi } from '@/api/employer';
import { jobRequestsApi } from '@/api/jobRequests';
import type { Applicant } from '@/types';

export function SendJobRequestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    shiftType: 'full-time',
    location: '',
    offeredHourlyRate: '',
    message: '',
  });

  const shiftTypes = ['full-time', 'part-time', 'weekends-only', 'flexible'];

  useEffect(() => {
    if (id) {
      fetchApplicant();
    }
  }, [id]);

  const fetchApplicant = async () => {
    try {
      setIsLoading(true);
      const response = await employerApi.getApplicantById(id!);
      setApplicant(response.data);
    } catch (error) {
      console.error('Failed to fetch applicant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.jobTitle.trim()) return 'Job title is required';
    if (!formData.jobDescription.trim()) return 'Job description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.offeredHourlyRate || parseInt(formData.offeredHourlyRate) <= 0) return 'Valid hourly rate is required';
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
    setIsSending(true);

    try {
      await jobRequestsApi.create({
        applicantId: id!,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        shiftType: formData.shiftType,
        location: formData.location,
        offeredHourlyRate: parseInt(formData.offeredHourlyRate),
        message: formData.message.trim() || undefined,
      });
      
      setSuccess('Job request sent successfully!');
      setTimeout(() => {
        navigate('/employer/requests');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Applicant not found</h2>
        <NavLink to="/employer/applicants" className="text-forest-700 hover:text-forest-900">
          Back to Browse
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
          <h1 className="text-2xl font-bold text-forest-900">Send Job Request</h1>
          <p className="text-gray-500">To: {applicant.name}</p>
        </div>
      </div>

      {/* Applicant Summary */}
      <div className="bg-forest-50 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
          <span className="text-forest-700 font-bold">{applicant.name[0]}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {applicant.preferredWorkLocation || 'Location not specified'}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {applicant.experience || 0} years exp
            </span>
            {applicant.expectedHourlyRate && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Expects ₹{applicant.expectedHourlyRate}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="e.g., Weekend Chef Position"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => handleChange('jobDescription', e.target.value)}
            placeholder="Describe the job role and responsibilities..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {shiftTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('shiftType', type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.shiftType === type
                    ? 'bg-forest-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Mumbai, Bandra"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offered Hourly Rate (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.offeredHourlyRate}
            onChange={(e) => handleChange('offeredHourlyRate', e.target.value)}
            placeholder="e.g., 200"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Add a personal message to the applicant..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This job request will expire in 7 days if not responded to.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSending || !!success}
            className="flex-1 py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
