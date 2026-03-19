import { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Loader2,
  FileText,
  Send,
  CheckCircle
} from 'lucide-react';
import { employerApi } from '@/api/employer';
import { resumeApi } from '@/api/resume';
import type { Applicant } from '@/types';
import { toast } from 'sonner';

export function ApplicantProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplicantProfile();
    }
  }, [id]);

  const fetchApplicantProfile = async () => {
    try {
      setIsLoading(true);
      const response = await employerApi.getApplicantById(id!);
      setApplicant(response.data);

      // Check if shortlisted
      try {
        const checkResponse = await employerApi.checkShortlist(id!);
        setIsShortlisted(checkResponse.data?.isShortlisted || false);
      } catch {
        setIsShortlisted(false);
      }
    } catch (error) {
      console.error('Failed to fetch applicant profile:', error);
      toast.error('Failed to fetch applicant profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlist = async () => {
    try {
      await employerApi.addToShortlist(id!);
      setIsShortlisted(true);
      toast.success('Added to shortlist');
    } catch (error) {
      console.error('Failed to add to shortlist:', error);
      toast.error('Failed to add to shortlist');
    }
  };

  const handleViewResume = async () => {
    try {
      const response = await resumeApi.getApplicantResume(id!);
      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      } else {
        toast.error('Resume URL not found');
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      toast.error('Resume not available');
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
          <h1 className="text-2xl font-bold text-forest-900">Applicant Profile</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-card text-center">
            <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-forest-700">{applicant.name[0]}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{applicant.name}</h2>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{applicant.phone}</span>
              </div>
              {applicant.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{applicant.email}</span>
                </div>
              )}
              {applicant.preferredWorkLocation && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{applicant.preferredWorkLocation}</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate(`/employer/applicants/${applicant._id}/request`)}
                className="w-full py-3 bg-forest-900 text-white rounded-full font-medium hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Job Request
              </button>
              <button
                onClick={handleShortlist}
                disabled={isShortlisted}
                className={`w-full py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 ${isShortlisted
                    ? 'bg-yellow-50 text-yellow-700 cursor-default'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Star className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
                {isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
              </button>
              <button
                onClick={handleViewResume}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-full font-medium hover:bg-[#F5F5ED] transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Resume
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-6">Overview</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {applicant.experience !== undefined && (
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <Briefcase className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-900">{applicant.experience} years</p>
                </div>
              )}
              {applicant.expectedHourlyRate && (
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <DollarSign className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Expected Rate</p>
                  <p className="font-medium text-gray-900">₹{applicant.expectedHourlyRate}/hr</p>
                </div>
              )}
              {applicant.preferredShiftType && (
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <Clock className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Preferred Shift</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {applicant.preferredShiftType.replace('-', ' ')}
                  </p>
                </div>
              )}
              {applicant.preferredJobType && (
                <div className="p-4 bg-[#F5F5ED] rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {applicant.preferredJobType.replace('-', ' ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {applicant.skills && applicant.skills.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-forest-100 text-forest-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Categories */}
          {applicant.jobCategories && applicant.jobCategories.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-gray-900 mb-4">Job Categories of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.jobCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {applicant.availabilityDays && applicant.availabilityDays.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold text-gray-900 mb-4">Available Days</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.availabilityDays.map((day) => (
                  <span
                    key={day}
                    className="px-4 py-2 bg-lime-50 text-forest-700 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
