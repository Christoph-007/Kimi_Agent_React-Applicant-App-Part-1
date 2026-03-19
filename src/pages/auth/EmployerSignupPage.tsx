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
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Building2 className="w-8 h-8 text-forest-900" />
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-3">Register Your Business</h1>
        <p className="text-gray-500 font-medium">
          {step === 1 ? 'Enter your business information to get started' : 'Tell us more about your business'}
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
          <span className="text-sm font-bold hidden sm:block">Business Details</span>
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
                Business/Store Name <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                placeholder="Enter your business legal name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                Owner Name <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                placeholder="Enter owner full name"
                className="input-field"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Phone Number <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
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
                  placeholder="business@example.com"
                  className="input-field"
                />
              </div>
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
              Continue to Details
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Business Type */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-forest-900 ml-1">
                Business Type <span className="text-red-500 font-normal">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('businessType', type)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${formData.businessType === type
                        ? 'bg-forest-900 text-white border-forest-900 shadow-md scale-105'
                        : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200 hover:bg-forest-50'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                About Your Business
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleChange('businessDescription', e.target.value)}
                placeholder="Tell us about your company, culture, and what you're looking for..."
                rows={4}
                className="input-field resize-none h-32 leading-relaxed"
              />
            </div>

            {/* Address */}
            <div className="bg-gray-50/50 p-7 rounded-[2rem] border border-gray-100 space-y-6">
              <h3 className="font-extrabold text-forest-900 text-sm uppercase tracking-wider ml-1">Business Location</h3>

              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Street Address <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Shop No, Building, Street Name"
                  className="input-field shadow-sm bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                    City <span className="text-red-500 font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="City"
                    className="input-field shadow-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                    State <span className="text-red-500 font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="State"
                    className="input-field shadow-sm bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
                  Pincode <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit pincode"
                  className="input-field shadow-sm bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-4">
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
                    Registering...
                  </>
                ) : (
                  <>
                    Create Business Account
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
        Already have a business account?{' '}
        <NavLink to="/login" className="font-extrabold text-forest-900 hover:text-forest-700 hover:underline transition-colors">
          Sign In
        </NavLink>
      </p>
    </div>
  );
}
