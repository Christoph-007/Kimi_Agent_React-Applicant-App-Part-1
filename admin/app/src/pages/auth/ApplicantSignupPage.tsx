import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  skills: string[];
  experience: number;
  preferredJobType: string;
  jobCategories: string[];
  preferredShiftType: string;
  preferredWorkLocation: string;
  expectedHourlyRate: number;
  availabilityDays: string[];
}

export function ApplicantSignupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    skills: [],
    experience: 0,
    preferredJobType: '',
    jobCategories: [],
    preferredShiftType: '',
    preferredWorkLocation: '',
    expectedHourlyRate: 0,
    availabilityDays: [],
  });

  const [newSkill, setNewSkill] = useState('');

  const jobTypes = ['full-time', 'part-time', 'shift', 'contract'];
  const shiftTypes = ['morning', 'evening', 'night', 'flexible', 'weekends-only'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categoryOptions = ['Food Service', 'Retail', 'Logistics', 'Healthcare', 'Hospitality', 'Warehouse', 'Security', 'Driver'];

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availabilityDays: prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter((d) => d !== day)
        : [...prev.availabilityDays, day],
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      jobCategories: prev.jobCategories.includes(category)
        ? prev.jobCategories.filter((c) => c !== category)
        : [...prev.jobCategories, category],
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (formData.phone.length !== 10) return 'Phone number must be 10 digits';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleNext = () => {
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const signupData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        skills: formData.skills,
        experience: formData.experience,
        preferredJobType: formData.preferredJobType,
        jobCategories: formData.jobCategories,
        preferredShiftType: formData.preferredShiftType,
        preferredWorkLocation: formData.preferredWorkLocation,
        expectedHourlyRate: formData.expectedHourlyRate,
        availabilityDays: formData.availabilityDays,
      };

      await signup(signupData, 'applicant');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Create Your Account</h1>
        <p className="text-gray-500">
          {step === 1 ? 'Enter your basic information to get started' : 'Tell us more about your preferences'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            step >= 1 ? 'bg-forest-900 text-white' : 'bg-gray-200'
          }`}>
            1
          </div>
          <span className="text-sm font-medium hidden sm:block">Basic Info</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-200">
          <div className={`h-full bg-forest-900 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            step >= 2 ? 'bg-forest-900 text-white' : 'bg-gray-200'
          }`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:block">Preferences</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email (optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
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
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-forest-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={(e) => handleChange('experience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            {/* Preferred Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Job Type
              </label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('preferredJobType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.preferredJobType === type
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Categories of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.jobCategories.includes(category)
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Shift Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Shift Type
              </label>
              <div className="flex flex-wrap gap-2">
                {shiftTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('preferredShiftType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.preferredShiftType === type
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Work Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Work Location
              </label>
              <input
                type="text"
                value={formData.preferredWorkLocation}
                onChange={(e) => handleChange('preferredWorkLocation', e.target.value)}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            {/* Expected Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Hourly Rate (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.expectedHourlyRate}
                onChange={(e) => handleChange('expectedHourlyRate', parseInt(e.target.value) || 0)}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            {/* Availability Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.availabilityDays.includes(day)
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-gray-600">
        Already have an account?{' '}
        <NavLink to="/login" className="text-forest-700 hover:text-forest-900 font-medium">
          Sign in
        </NavLink>
      </p>
    </div>
  );
}
