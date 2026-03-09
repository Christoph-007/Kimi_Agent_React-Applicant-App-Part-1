import { useEffect, useState } from 'react';
import { 
  Mail, 
  Phone, 
  Briefcase,
  Loader2,
  Camera,
  Edit2,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import { resumeApi } from '@/api/resume';
import type { User as UserType } from '@/types';

export function ProfilePage() {
  const { refreshUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    experience: 0,
    preferredJobType: '',
    jobCategories: [] as string[],
    preferredShiftType: '',
    preferredWorkLocation: '',
    expectedHourlyRate: 0,
    availabilityDays: [] as string[],
  });

  const [newSkill, setNewSkill] = useState('');

  const jobTypes = ['full-time', 'part-time', 'shift', 'contract'];
  const shiftTypes = ['morning', 'evening', 'night', 'flexible', 'weekends-only'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categoryOptions = ['Food Service', 'Retail', 'Logistics', 'Healthcare', 'Hospitality', 'Warehouse', 'Security', 'Driver'];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getMe();
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        skills: userData.skills || [],
        experience: userData.experience || 0,
        preferredJobType: userData.preferredJobType || '',
        jobCategories: userData.jobCategories || [],
        preferredShiftType: userData.preferredShiftType || '',
        preferredWorkLocation: userData.preferredWorkLocation || '',
        expectedHourlyRate: userData.expectedHourlyRate || 0,
        availabilityDays: userData.availabilityDays || [],
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess('');
    try {
      await authApi.updateProfile(formData);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await resumeApi.upload(file, (progress) => {
        setUploadProgress(progress);
      });
      setSuccess('Resume uploaded successfully!');
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to upload resume:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;
    
    try {
      await resumeApi.delete();
      setSuccess('Resume deleted successfully!');
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">My Profile</h1>
          <p className="text-gray-500">Manage your personal information and preferences</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-forest-900 text-white rounded-lg font-medium hover:bg-forest-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-forest-700">
                  {user?.name?.[0] || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-forest-900 text-white rounded-full flex items-center justify-center hover:bg-forest-800 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.type === 'applicant' ? 'Job Seeker' : 'Employer'}</p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user?.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Resume Card */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-4">Resume</h3>
            
            {user?.resume ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-700">Resume Uploaded</p>
                    <p className="text-sm text-green-600">Your resume is ready</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={user.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium text-center hover:bg-forest-800 transition-colors"
                  >
                    View Resume
                  </a>
                  <button
                    onClick={handleDeleteResume}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">Upload your resume to apply for jobs</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-forest-900 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-forest-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Upload Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest-900 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-6">Basic Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-medium text-gray-900">{user?.experience || 0} years</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <button
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
                      <button onClick={() => removeSkill(skill)} className="hover:text-forest-900">×</button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h3 className="font-semibold text-gray-900 mb-4">Job Preferences</h3>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, preferredJobType: type }))}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Categories</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Shift Type</label>
                  <div className="flex flex-wrap gap-2">
                    {shiftTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, preferredShiftType: type }))}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Work Location</label>
                  <input
                    type="text"
                    value={formData.preferredWorkLocation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferredWorkLocation: e.target.value }))}
                    placeholder="e.g., Mumbai, Delhi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.expectedHourlyRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, expectedHourlyRate: parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 150"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
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
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Preferred Job Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {user?.preferredJobType?.replace('-', ' ') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Preferred Shift</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {user?.preferredShiftType?.replace('-', ' ') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Preferred Location</p>
                  <p className="font-medium text-gray-900">
                    {user?.preferredWorkLocation || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Hourly Rate</p>
                  <p className="font-medium text-gray-900">
                    {user?.expectedHourlyRate ? `₹${user.expectedHourlyRate}` : 'Not specified'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Job Categories</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.jobCategories && user.jobCategories.length > 0 ? (
                      user.jobCategories.map((cat) => (
                        <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Available Days</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.availabilityDays && user.availabilityDays.length > 0 ? (
                      user.availabilityDays.map((day) => (
                        <span key={day} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {day}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchUserProfile();
                }}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
