import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Plus,
  Briefcase
} from 'lucide-react';
import { jobsApi } from '@/api/jobs';

interface FormData {
  title: string;
  description: string;
  jobType: 'full-time' | 'part-time' | 'shift' | 'contract';
  salary: {
    amount: number;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  location: {
    address?: string;
    city: string;
    state: string;
    pincode: string;
  };
  workingHours: {
    hoursPerDay?: number;
    daysPerWeek?: number;
    shiftTiming?: string;
  };
  requirements: {
    minimumExperience?: number;
    skills: string[];
    education?: string;
    otherRequirements?: string;
  };
  benefits: string[];
  expiryDate: string;
}

export function JobFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    jobType: 'full-time',
    salary: {
      amount: 0,
      period: 'hourly',
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    workingHours: {
      hoursPerDay: 8,
      daysPerWeek: 5,
      shiftTiming: '',
    },
    requirements: {
      minimumExperience: 0,
      skills: [],
      education: '',
      otherRequirements: '',
    },
    benefits: [],
    expiryDate: '',
  });

  const jobTypes = ['full-time', 'part-time', 'shift', 'contract'];
  const salaryPeriods = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'];
  const educationOptions = ['None', 'High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree'];

  useEffect(() => {
    if (isEditMode) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await jobsApi.getById(id!);
      const job = response.data;

      setFormData({
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        salary: job.salary,
        location: job.location,
        workingHours: job.workingHours || { hoursPerDay: 8, daysPerWeek: 5, shiftTiming: '' },
        requirements: {
          minimumExperience: job.requirements?.minimumExperience || 0,
          skills: job.requirements?.skills || [],
          education: job.requirements?.education || '',
          otherRequirements: job.requirements?.otherRequirements || '',
        },
        benefits: job.benefits || [],
        expiryDate: job.expiryDate ? job.expiryDate.split('T')[0] : '',
      });
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof FormData, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent] as Record<string, unknown>, [field]: value },
    }));
  };

  const handleRequirementsChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requirements.skills.includes(newSkill.trim())) {
      handleRequirementsChange('skills', [...formData.requirements.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    handleRequirementsChange('skills', formData.requirements.skills.filter((s) => s !== skill));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      handleChange('benefits', [...formData.benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    handleChange('benefits', formData.benefits.filter((b) => b !== benefit));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Job title is required';
    if (!formData.description.trim()) return 'Job description is required';
    if (!formData.salary.amount || formData.salary.amount <= 0) return 'Valid salary amount is required';
    if (!formData.location.city.trim()) return 'City is required';
    if (!formData.location.state.trim()) return 'State is required';
    if (!formData.location.pincode.trim() || formData.location.pincode.length !== 6) return 'Valid 6-digit pincode is required';
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
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      };

      if (isEditMode) {
        await jobsApi.update(id!, submitData);
      } else {
        await jobsApi.create(submitData);
      }
      navigate('/employer/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job. Please try again.');
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
            {isEditMode ? 'Edit Job' : 'Post New Job'}
          </h1>
          <p className="text-gray-500">
            {isEditMode ? 'Update your job posting details' : 'Create a new job posting to find candidates'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Experienced Chef Required"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('jobType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.jobType === type
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Salary</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.salary.amount || ''}
                onChange={(e) => handleNestedChange('salary', 'amount', parseInt(e.target.value) || 0)}
                placeholder="e.g., 200"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.salary.period}
                onChange={(e) => handleNestedChange('salary', 'period', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent appearance-none bg-white"
              >
                {salaryPeriods.map((period) => (
                  <option key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                placeholder="Enter street address"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.pincode}
                  onChange={(e) => handleNestedChange('location', 'pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit pincode"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Working Hours</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per Day
              </label>
              <input
                type="number"
                value={formData.workingHours.hoursPerDay}
                onChange={(e) => handleNestedChange('workingHours', 'hoursPerDay', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days per Week
              </label>
              <input
                type="number"
                value={formData.workingHours.daysPerWeek}
                onChange={(e) => handleNestedChange('workingHours', 'daysPerWeek', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift Timing
              </label>
              <input
                type="text"
                value={formData.workingHours.shiftTiming}
                onChange={(e) => handleNestedChange('workingHours', 'shiftTiming', e.target.value)}
                placeholder="e.g., 9:00 AM - 5:00 PM"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Requirements</h2>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.requirements.minimumExperience}
                  onChange={(e) => handleRequirementsChange('minimumExperience', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <select
                  value={formData.requirements.education}
                  onChange={(e) => handleRequirementsChange('education', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select education</option>
                  {educationOptions.map((edu) => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g., Cooking)"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-forest-900">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Requirements
              </label>
              <textarea
                value={formData.requirements.otherRequirements}
                onChange={(e) => handleRequirementsChange('otherRequirements', e.target.value)}
                placeholder="Any other specific requirements..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Benefits</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              placeholder="Add a benefit (e.g., Free Meals)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-1 px-3 py-1 bg-lime-50 text-forest-700 rounded-full text-sm"
              >
                {benefit}
                <button type="button" onClick={() => removeBenefit(benefit)} className="hover:text-forest-900">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Expiry</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Job will automatically close after this date. Leave empty for no expiry.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
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
            disabled={isSaving}
            className="flex-1 py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? 'Saving...' : 'Posting...'}
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                {isEditMode ? 'Save Changes' : 'Post Job'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
