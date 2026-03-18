import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  businessDescription: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export function EmployerSignupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    businessDescription: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const businessTypes = [
    'Restaurant',
    'Retail Store',
    'Warehouse',
    'Hotel',
    'Hospital',
    'Logistics',
    'Manufacturing',
    'Other',
  ];

  const handleChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof FormData['address'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const validateStep1 = () => {
    if (!formData.storeName.trim()) return 'Store/Business name is required';
    if (!formData.ownerName.trim()) return 'Owner name is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (formData.phone.length !== 10) return 'Phone number must be 10 digits';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateStep2 = () => {
    if (!formData.businessType) return 'Business type is required';
    if (!formData.address.street.trim()) return 'Street address is required';
    if (!formData.address.city.trim()) return 'City is required';
    if (!formData.address.state.trim()) return 'State is required';
    if (!formData.address.pincode.trim()) return 'Pincode is required';
    if (formData.address.pincode.length !== 6) return 'Pincode must be 6 digits';
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
    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Map display labels to backend enum values
      const businessTypeMap: Record<string, string> = {
        'Restaurant': 'restaurant',
        'Retail Store': 'retail',
        'Warehouse': 'logistics',
        'Hotel': 'hospitality',
        'Hospital': 'healthcare',
        'Logistics': 'logistics',
        'Manufacturing': 'other',
        'Other': 'other'
      };

      const signupData = {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessType: businessTypeMap[formData.businessType] || 'other',
        businessDescription: formData.businessDescription,
        address: formData.address,
      };

      await signup(signupData, 'employer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-forest-700" />
        </div>
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Register Your Business</h1>
        <p className="text-gray-500">
          {step === 1 ? 'Enter your business information to get started' : 'Tell us more about your business'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-forest-900 text-white' : 'bg-gray-200'
            }`}>
            1
          </div>
          <span className="text-sm font-medium hidden sm:block">Basic Info</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-200">
          <div className={`h-full bg-forest-900 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-forest-900' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-forest-900 text-white' : 'bg-gray-200'
            }`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:block">Business Details</span>
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
                Business/Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                placeholder="Enter your business name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                placeholder="Enter owner name"
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
            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('businessType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.businessType === type
                        ? 'bg-forest-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleChange('businessDescription', e.target.value)}
                placeholder="Tell us about your business..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Business Address</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Enter street address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
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
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit pincode"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-[#F5F5ED] transition-colors flex items-center justify-center gap-2"
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
