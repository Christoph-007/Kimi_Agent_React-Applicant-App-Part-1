# ShiftMaster Frontend - Complete Build Guide (Part 2)

## 📋 Continuation: Components Implementation

---

## 🔐 Authentication Components (45 minutes)

### Step 9: Create Authentication Forms

**File: `frontend/src/components/auth/LoginForm.jsx`**
```javascript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const schema = yup.object({
  identifier: yup.string().required('Email or phone is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  userType: yup.string().required('User type is required').oneOf(['employer', 'applicant', 'admin']),
});

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userType: 'applicant',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-all">
            <input
              type="radio"
              value="applicant"
              {...register('userType')}
              className="sr-only"
            />
            <span className="text-sm font-medium">Job Seeker</span>
          </label>
          <label className="relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-all">
            <input
              type="radio"
              value="employer"
              {...register('userType')}
              className="sr-only"
            />
            <span className="text-sm font-medium">Employer</span>
          </label>
          <label className="relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:border-primary-500 transition-all">
            <input
              type="radio"
              value="admin"
              {...register('userType')}
              className="sr-only"
            />
            <span className="text-sm font-medium">Admin</span>
          </label>
        </div>
        {errors.userType && (
          <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email or Phone
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            {...register('identifier')}
            className="input pl-10"
            placeholder="Enter email or phone number"
          />
        </div>
        {errors.identifier && (
          <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="input pl-10 pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-primary disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

**File: `frontend/src/components/auth/EmployerSignupForm.jsx`**
```javascript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiMail, FiPhone, FiLock, FiBriefcase, FiMapPin } from 'react-icons/fi';

const schema = yup.object({
  storeName: yup.string().required('Store name is required'),
  ownerName: yup.string().required('Owner name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  businessType: yup.string().required('Business type is required'),
  street: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  businessDescription: yup.string(),
});

const EmployerSignupForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data) => {
    const formattedData = {
      storeName: data.storeName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      businessType: data.businessType,
      businessDescription: data.businessDescription,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store/Business Name *
          </label>
          <div className="relative">
            <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register('storeName')}
              className="input pl-10"
              placeholder="ABC Store"
            />
          </div>
          {errors.storeName && (
            <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Name *
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register('ownerName')}
              className="input pl-10"
              placeholder="John Doe"
            />
          </div>
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              className="input pl-10"
              placeholder="employer@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              {...register('phone')}
              className="input pl-10"
              placeholder="9876543210"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select {...register('businessType')} className="input">
            <option value="">Select business type</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail</option>
            <option value="logistics">Logistics</option>
            <option value="healthcare">Healthcare</option>
            <option value="hospitality">Hospitality</option>
            <option value="other">Other</option>
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('password')}
              className="input pl-10"
              placeholder="Min 6 characters"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('confirmPassword')}
              className="input pl-10"
              placeholder="Re-enter password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Business Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              {...register('street')}
              className="input"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city')}
              className="input"
              placeholder="Mumbai"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state')}
              className="input"
              placeholder="Maharashtra"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode *
            </label>
            <input
              type="text"
              {...register('pincode')}
              className="input"
              placeholder="400001"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Description
        </label>
        <textarea
          {...register('businessDescription')}
          rows={3}
          className="input"
          placeholder="Tell us about your business..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn btn-primary disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Employer Account'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Note: Your account will be reviewed by our admin team before you can post jobs.
      </p>
    </form>
  );
};

export default EmployerSignupForm;
```

**File: `frontend/src/components/auth/ApplicantSignupForm.jsx`**
```javascript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiUser, FiMail, FiPhone, FiLock, FiUpload } from 'react-icons/fi';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  email: yup.string().email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  skills: yup.string(),
  experience: yup.number().min(0, 'Experience cannot be negative'),
  preferredJobType: yup.string(),
});

const ApplicantSignupForm = ({ onSubmit, loading }) => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadService.uploadFile(file);
      setResume(result);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      password: data.password,
      skills: selectedSkills,
      experience: data.experience || 0,
      preferredJobType: data.preferredJobType || undefined,
      resume: resume || undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              {...register('name')}
              className="input pl-10"
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              {...register('phone')}
              className="input pl-10"
              placeholder="9876543210"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Optional)
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              className="input pl-10"
              placeholder="applicant@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience (Years)
          </label>
          <input
            type="number"
            {...register('experience')}
            className="input"
            placeholder="0"
            min="0"
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>

        {/* Preferred Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Job Type
          </label>
          <select {...register('preferredJobType')} className="input">
            <option value="">Select job type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="shift">Shift Based</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('password')}
              className="input pl-10"
              placeholder="Min 6 characters"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('confirmPassword')}
              className="input pl-10"
              placeholder="Re-enter password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="input flex-1"
            placeholder="e.g., Customer Service, Sales, etc."
          />
          <button
            type="button"
            onClick={addSkill}
            className="btn btn-secondary"
          >
            Add
          </button>
        </div>
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="badge badge-info flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="btn btn-secondary cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
              />
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
          </div>
          {resume && (
            <p className="mt-2 text-sm text-green-600">
              ✓ Resume uploaded successfully
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full btn btn-primary disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Applicant Account'}
      </button>
    </form>
  );
};

export default ApplicantSignupForm;
```

---

## 💼 Job Components (60 minutes)

### Step 10: Create Job Components

**File: `frontend/src/components/jobs/JobCard.jsx`**
```javascript
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiEye } from 'react-icons/fi';
import { formatDistance } from 'date-fns';

const JobCard = ({ job }) => {
  const formatSalary = () => {
    const { amount, period } = job.salary;
    return `₹${amount.toLocaleString()}/${period}`;
  };

  return (
    <Link to={`/jobs/${job._id}`} className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {job.employer?.storeName || 'Company Name'}
          </p>
        </div>
        <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-gray'}`}>
          {job.status}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="mr-2 text-gray-400" />
          {job.location.city}, {job.location.state}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiDollarSign className="mr-2 text-gray-400" />
          {formatSalary()}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiBriefcase className="mr-2 text-gray-400" />
          {job.jobType.replace('-', ' ')}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiEye className="mr-2 text-gray-400" />
          {job.views} views
        </div>
      </div>

      {job.requirements?.skills && job.requirements.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge badge-info text-xs">
              {skill}
            </span>
          ))}
          {job.requirements.skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{job.requirements.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-xs text-gray-500">
          Posted {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true })}
        </span>
        <span className="text-sm font-medium text-primary-600">
          {job.totalApplications} applications
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
```

**File: `frontend/src/components/jobs/JobList.jsx`**
```javascript
import JobCard from './JobCard';
import Loader from '../common/Loader';

const JobList = ({ jobs, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
```

**File: `frontend/src/components/jobs/JobFilters.jsx`**
```javascript
import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const JobFilters = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    jobType: '',
    city: '',
    state: '',
    minSalary: '',
    maxSalary: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            placeholder="Search jobs..."
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="shift">Shift Based</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="input"
            placeholder="e.g., Mumbai"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="input"
            placeholder="e.g., Maharashtra"
          />
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Salary
          </label>
          <input
            type="number"
            value={filters.minSalary}
            onChange={(e) => handleFilterChange('minSalary', e.target.value)}
            className="input"
            placeholder="Min"
          />
        </div>
      </div>

      <button
        onClick={() => {
          setFilters({
            jobType: '',
            city: '',
            state: '',
            minSalary: '',
            maxSalary: '',
          });
          setSearchTerm('');
          onFilterChange({});
          onSearch('');
        }}
        className="btn btn-secondary mt-4"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default JobFilters;
```

**File: `frontend/src/components/jobs/JobForm.jsx`**
```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  description: yup.string().required('Description is required'),
  jobType: yup.string().required('Job type is required'),
  salaryAmount: yup.number().required('Salary is required').min(0, 'Salary must be positive'),
  salaryPeriod: yup.string().required('Salary period is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Invalid pincode'),
});

const JobForm = ({ initialData, onSubmit, loading }) => {
  const [skills, setSkills] = useState(initialData?.requirements?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [benefits, setBenefits] = useState(initialData?.benefits || []);
  const [benefitInput, setBenefitInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      jobType: initialData.jobType,
      salaryAmount: initialData.salary.amount,
      salaryPeriod: initialData.salary.period,
      city: initialData.location.city,
      state: initialData.location.state,
      pincode: initialData.location.pincode,
      address: initialData.location.address,
      hoursPerDay: initialData.workingHours?.hoursPerDay,
      daysPerWeek: initialData.workingHours?.daysPerWeek,
      shiftTiming: initialData.workingHours?.shiftTiming,
      minimumExperience: initialData.requirements?.minimumExperience,
      education: initialData.requirements?.education,
      otherRequirements: initialData.requirements?.otherRequirements,
    } : {},
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (benefit) => {
    setBenefits(benefits.filter((b) => b !== benefit));
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      title: data.title,
      description: data.description,
      jobType: data.jobType,
      salary: {
        amount: data.salaryAmount,
        period: data.salaryPeriod,
      },
      location: {
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      workingHours: {
        hoursPerDay: data.hoursPerDay,
        daysPerWeek: data.daysPerWeek,
        shiftTiming: data.shiftTiming,
      },
      requirements: {
        minimumExperience: data.minimumExperience || 0,
        skills: skills,
        education: data.education,
        otherRequirements: data.otherRequirements,
      },
      benefits: benefits,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              {...register('title')}
              className="input"
              placeholder="e.g., Sales Associate"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={5}
              className="input"
              placeholder="Describe the job role, responsibilities, and requirements..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type *
            </label>
            <select {...register('jobType')} className="input">
              <option value="">Select job type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="shift">Shift Based</option>
              <option value="contract">Contract</option>
            </select>
            {errors.jobType && (
              <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Salary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              {...register('salaryAmount')}
              className="input"
              placeholder="25000"
            />
            {errors.salaryAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.salaryAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period *
            </label>
            <select {...register('salaryPeriod')} className="input">
              <option value="">Select period</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.salaryPeriod && (
              <p className="mt-1 text-sm text-red-600">{errors.salaryPeriod.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="input"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city')}
              className="input"
              placeholder="Mumbai"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state')}
              className="input"
              placeholder="Maharashtra"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode *
            </label>
            <input
              type="text"
              {...register('pincode')}
              className="input"
              placeholder="400001"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Per Day
            </label>
            <input
              type="number"
              {...register('hoursPerDay')}
              className="input"
              placeholder="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Per Week
            </label>
            <input
              type="number"
              {...register('daysPerWeek')}
              className="input"
              placeholder="6"
              max="7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timing
            </label>
            <input
              type="text"
              {...register('shiftTiming')}
              className="input"
              placeholder="9 AM - 6 PM"
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              {...register('minimumExperience')}
              className="input"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="input flex-1"
                placeholder="e.g., Customer Service"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-info flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            <input
              type="text"
              {...register('education')}
              className="input"
              placeholder="e.g., 12th Pass, Graduate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Requirements
            </label>
            <textarea
              {...register('otherRequirements')}
              rows={3}
              className="input"
              placeholder="Any other specific requirements..."
            />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Benefits</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
            className="input flex-1"
            placeholder="e.g., Health Insurance, PF"
          />
          <button
            type="button"
            onClick={addBenefit}
            className="btn btn-secondary"
          >
            Add
          </button>
        </div>
        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {benefits.map((benefit) => (
              <span key={benefit} className="badge badge-success flex items-center gap-1">
                {benefit}
                <button
                  type="button"
                  onClick={() => removeBenefit(benefit)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
```

---

**This is Part 2 of the guide. It covers:**
- ✅ Complete Authentication Forms (Login, Employer Signup, Applicant Signup)
- ✅ Job Components (JobCard, JobList, JobFilters, JobForm)

**Next in Part 3:**
- Application Components
- Shift Components
- Attendance Components with GPS
- Admin Components
- All Page Components

Would you like me to continue with Part 3?
