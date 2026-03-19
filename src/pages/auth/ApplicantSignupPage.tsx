import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle, ChevronRight, ChevronLeft, User, XCircle, MapPin } from 'lucide-react';
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
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <User className="w-8 h-8 text-forest-900" />
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-3">Create Your Account</h1>
        <p className="text-gray-500 font-medium">
          {step === 1 ? 'Enter your basic information to get started' : 'Tell us more about your preferences'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? 'bg-forest-900 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
          >
            1
          </div>
          <span className="text-sm font-bold hidden sm:block">Basic Info</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-forest-900 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}
          />
        </div>
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? 'bg-forest-900 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
          >
            2
          </div>
          <span className="text-sm font-bold hidden sm:block">Preferences</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                Full Name <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                Phone Number <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email address (optional)"
                className="input-field"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Password <span className="text-red-500 font-normal">*</span>
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create password"
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-700 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Confirm Password <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="btn-primary w-full py-4 text-base shadow-btn active:scale-95 group mt-2"
            >
              Continue to Preferences
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <label className="block text-sm font-bold text-forest-900 mb-3 ml-1">
                Tell us about your Skills
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g., Driver, Cooking)"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 bg-forest-900 text-white rounded-xl hover:bg-forest-800 transition-all font-bold text-sm shadow-sm active:scale-95 flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white border border-forest-100 text-forest-900 shadow-sm animate-fade-in"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-xs text-gray-400 font-medium ml-1">No skills added yet. Adding skills helps us find better matches.</p>
                )}
              </div>
            </div>

            {/* Exp & Pay */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Experience (Years)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Expected Hourly Rate (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.expectedHourlyRate}
                    onChange={(e) => handleChange('expectedHourlyRate', parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                    placeholder="150"
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Selection Groups */}
            <div className="space-y-6">
              {/* Preferred Job Type */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-forest-900 ml-1">
                  Preferred Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('preferredJobType', type)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${formData.preferredJobType === type
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md scale-105'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200 hover:bg-forest-50'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Categories */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-forest-900 ml-1">
                  Interested Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${formData.jobCategories.includes(category)
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md scale-105'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200 hover:bg-forest-50'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shift Types */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-forest-900 ml-1">
                  Preferred Shifts
                </label>
                <div className="flex flex-wrap gap-2">
                  {shiftTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('preferredShiftType', type)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${formData.preferredShiftType === type
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md scale-105'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200 hover:bg-forest-50'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Days */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-forest-900 ml-1">
                  Weekly Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 border ${formData.availabilityDays.includes(day)
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md animate-pulse-subtle'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200'
                        }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Location */}
            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                Preferred Work Location
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-700 transition-colors w-5 h-5" />
                <input
                  type="text"
                  value={formData.preferredWorkLocation}
                  onChange={(e) => handleChange('preferredWorkLocation', e.target.value)}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-4 border-2 border-forest-900 text-forest-900 rounded-full font-bold hover:bg-forest-50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 font-inter"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary py-4 text-base shadow-btn active:scale-95 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Signup
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-sm font-medium text-gray-500">
        Already have an account?{' '}
        <NavLink to="/login" className="font-extrabold text-forest-900 hover:text-forest-700 hover:underline transition-colors">
          Sign In
        </NavLink>
      </p>
    </div>
  );
}
