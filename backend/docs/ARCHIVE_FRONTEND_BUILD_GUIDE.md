# ShiftMaster Frontend - Complete Build Guide

## 📋 Table of Contents
1. [Project Setup](#project-setup)
2. [Project Structure](#project-structure)
3. [Dependencies Installation](#dependencies-installation)
4. [Environment Configuration](#environment-configuration)
5. [Core Setup Files](#core-setup-files)
6. [Authentication System](#authentication-system)
7. [API Integration Layer](#api-integration-layer)
8. [Shared Components](#shared-components)
9. [Public Pages](#public-pages)
10. [Employer Portal](#employer-portal)
11. [Applicant Portal](#applicant-portal)
12. [Admin Portal](#admin-portal)
13. [Routing & Navigation](#routing--navigation)
14. [State Management](#state-management)
15. [Styling & UI](#styling--ui)
16. [Testing & Deployment](#testing--deployment)

---

## 🚀 Project Setup

### Step 1: Create React Application (5 minutes)

```bash
# Navigate to job finder directory
cd "c:\Users\juste\OneDrive\Desktop\job finder"

# Create React app with Vite (faster than CRA)
npm create vite@latest frontend -- --template react

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

**Alternative: Using Create React App**
```bash
npx create-react-app frontend
cd frontend
```

---

## 📁 Project Structure

Create this exact folder structure:

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── EmployerSignupForm.jsx
│   │   │   ├── ApplicantSignupForm.jsx
│   │   │   └── UpdatePasswordForm.jsx
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── JobForm.jsx
│   │   │   └── JobFilters.jsx
│   │   ├── applications/
│   │   │   ├── ApplicationCard.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   ├── ApplicationDetails.jsx
│   │   │   ├── ApplicationForm.jsx
│   │   │   └── ApplicationStatusBadge.jsx
│   │   ├── shifts/
│   │   │   ├── ShiftCard.jsx
│   │   │   ├── ShiftList.jsx
│   │   │   ├── ShiftDetails.jsx
│   │   │   ├── ShiftForm.jsx
│   │   │   └── ShiftCalendar.jsx
│   │   ├── attendance/
│   │   │   ├── AttendanceCard.jsx
│   │   │   ├── AttendanceList.jsx
│   │   │   ├── AttendanceDetails.jsx
│   │   │   ├── CheckInButton.jsx
│   │   │   ├── CheckOutButton.jsx
│   │   │   └── LocationMap.jsx
│   │   └── admin/
│   │       ├── DashboardStats.jsx
│   │       ├── EmployerTable.jsx
│   │       ├── ApplicantTable.jsx
│   │       ├── JobModerationTable.jsx
│   │       └── ApprovalCard.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── JobListings.jsx
│   │   │   ├── JobDetailsPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── EmployerSignup.jsx
│   │   │   └── ApplicantSignup.jsx
│   │   ├── employer/
│   │   │   ├── EmployerDashboard.jsx
│   │   │   ├── MyJobs.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── EditJob.jsx
│   │   │   ├── JobApplications.jsx
│   │   │   ├── MyShifts.jsx
│   │   │   ├── CreateShift.jsx
│   │   │   ├── AttendanceRecords.jsx
│   │   │   └── Profile.jsx
│   │   ├── applicant/
│   │   │   ├── ApplicantDashboard.jsx
│   │   │   ├── BrowseJobs.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── MyShifts.jsx
│   │   │   ├── AttendanceHistory.jsx
│   │   │   └── Profile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageEmployers.jsx
│   │       ├── ManageApplicants.jsx
│   │       ├── ModerateJobs.jsx
│   │       └── PlatformAnalytics.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   ├── applicationService.js
│   │   ├── shiftService.js
│   │   ├── attendanceService.js
│   │   ├── adminService.js
│   │   └── uploadService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useToast.js
│   │   ├── useGeolocation.js
│   │   ├── usePagination.js
│   │   └── useDebounce.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── dateUtils.js
│   │   └── formatters.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── App.jsx
│   ├── main.jsx (or index.js)
│   └── routes.jsx
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js (or config files)
└── README.md
```

---

## 📦 Dependencies Installation (10 minutes)

### Step 2: Install All Required Dependencies

```bash
# Core routing
npm install react-router-dom

# HTTP client
npm install axios

# Form handling & validation
npm install react-hook-form yup @hookform/resolvers

# UI Components & Icons
npm install react-icons lucide-react

# Date handling
npm install date-fns

# Maps (for location tracking)
npm install leaflet react-leaflet

# File upload
npm install react-dropzone

# Charts (for admin dashboard)
npm install recharts

# Notifications
npm install react-hot-toast

# State management (optional, using Context API is fine)
npm install zustand

# Calendar
npm install react-calendar

# Utilities
npm install classnames
```

**Development Dependencies:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## ⚙️ Environment Configuration (5 minutes)

### Step 3: Create Environment Files

**File: `frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ShiftMaster
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**File: `frontend/.env.example`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ShiftMaster
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

---

## 🔧 Core Setup Files (15 minutes)

### Step 4: Configure Tailwind CSS

**File: `frontend/tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**File: `frontend/src/styles/index.css`**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 active:scale-95;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95;
  }
  
  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700 active:scale-95;
  }
  
  .btn-success {
    @apply bg-green-600 text-white hover:bg-green-700 active:scale-95;
  }
  
  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
  
  .badge {
    @apply px-3 py-1 rounded-full text-xs font-semibold;
  }
  
  .badge-success {
    @apply bg-green-100 text-green-800;
  }
  
  .badge-warning {
    @apply bg-yellow-100 text-yellow-800;
  }
  
  .badge-danger {
    @apply bg-red-100 text-red-800;
  }
  
  .badge-info {
    @apply bg-blue-100 text-blue-800;
  }
  
  .badge-gray {
    @apply bg-gray-100 text-gray-800;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 🔐 Authentication System (30 minutes)

### Step 5: Create Authentication Context

**File: `frontend/src/context/AuthContext.jsx`**
```javascript
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const employerSignup = async (data) => {
    const response = await authService.employerSignup(data);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const applicantSignup = async (data) => {
    const response = await authService.applicantSignup(data);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updatePassword = async (passwords) => {
    await authService.updatePassword(passwords);
  };

  const value = {
    user,
    token,
    loading,
    login,
    employerSignup,
    applicantSignup,
    logout,
    updatePassword,
    isAuthenticated: !!user,
    isEmployer: user?.userType === 'employer',
    isApplicant: user?.userType === 'applicant',
    isAdmin: user?.userType === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**File: `frontend/src/hooks/useAuth.js`**
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 🌐 API Integration Layer (45 minutes)

### Step 6: Create Base API Configuration

**File: `frontend/src/services/api.js`**
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
```

### Step 7: Create Service Files

**File: `frontend/src/services/authService.js`**
```javascript
import api from './api';

export const authService = {
  // Employer signup
  employerSignup: async (data) => {
    const response = await api.post('/auth/employer/signup', data);
    return response.data;
  },

  // Applicant signup
  applicantSignup: async (data) => {
    const response = await api.post('/auth/applicant/signup', data);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const response = await api.put('/auth/update-password', passwords);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
```

**File: `frontend/src/services/jobService.js`**
```javascript
import api from './api';

export const jobService = {
  // Get all jobs (public)
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (employer)
  createJob: async (data) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  // Get employer's jobs
  getMyJobs: async (params = {}) => {
    const response = await api.get('/jobs/employer/my-jobs', { params });
    return response.data;
  },

  // Update job
  updateJob: async (id, data) => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Close job
  closeJob: async (id) => {
    const response = await api.put(`/jobs/${id}/close`);
    return response.data;
  },

  // Reopen job
  reopenJob: async (id) => {
    const response = await api.put(`/jobs/${id}/reopen`);
    return response.data;
  },
};
```

**File: `frontend/src/services/applicationService.js`**
```javascript
import api from './api';

export const applicationService = {
  // Apply for job (applicant)
  applyForJob: async (jobId, data) => {
    const response = await api.post(`/applications/${jobId}`, data);
    return response.data;
  },

  // Get my applications (applicant)
  getMyApplications: async (params = {}) => {
    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },

  // Get job applications (employer)
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Get application details
  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Accept application (employer)
  acceptApplication: async (id, data = {}) => {
    const response = await api.put(`/applications/${id}/accept`, data);
    return response.data;
  },

  // Reject application (employer)
  rejectApplication: async (id, data) => {
    const response = await api.put(`/applications/${id}/reject`, data);
    return response.data;
  },

  // Withdraw application (applicant)
  withdrawApplication: async (id) => {
    const response = await api.put(`/applications/${id}/withdraw`);
    return response.data;
  },
};
```

**File: `frontend/src/services/shiftService.js`**
```javascript
import api from './api';

export const shiftService = {
  // Create shift (employer)
  createShift: async (data) => {
    const response = await api.post('/shifts', data);
    return response.data;
  },

  // Get employer shifts
  getEmployerShifts: async (params = {}) => {
    const response = await api.get('/shifts/employer/my-shifts', { params });
    return response.data;
  },

  // Get applicant shifts
  getApplicantShifts: async (params = {}) => {
    const response = await api.get('/shifts/applicant/my-shifts', { params });
    return response.data;
  },

  // Get shift details
  getShiftById: async (id) => {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  // Update shift (employer)
  updateShift: async (id, data) => {
    const response = await api.put(`/shifts/${id}`, data);
    return response.data;
  },

  // Confirm shift (applicant)
  confirmShift: async (id) => {
    const response = await api.put(`/shifts/${id}/confirm`);
    return response.data;
  },

  // Cancel shift
  cancelShift: async (id, data) => {
    const response = await api.put(`/shifts/${id}/cancel`, data);
    return response.data;
  },

  // Delete shift (employer)
  deleteShift: async (id) => {
    const response = await api.delete(`/shifts/${id}`);
    return response.data;
  },
};
```

**File: `frontend/src/services/attendanceService.js`**
```javascript
import api from './api';

export const attendanceService = {
  // Check in (applicant)
  checkIn: async (shiftId, data) => {
    const response = await api.post(`/attendance/${shiftId}/checkin`, data);
    return response.data;
  },

  // Check out (applicant)
  checkOut: async (shiftId, data) => {
    const response = await api.post(`/attendance/${shiftId}/checkout`, data);
    return response.data;
  },

  // Get shift attendance
  getShiftAttendance: async (shiftId) => {
    const response = await api.get(`/attendance/shift/${shiftId}`);
    return response.data;
  },

  // Get employer attendance records
  getEmployerRecords: async (params = {}) => {
    const response = await api.get('/attendance/employer/records', { params });
    return response.data;
  },

  // Get applicant attendance history
  getApplicantHistory: async (params = {}) => {
    const response = await api.get('/attendance/applicant/history', { params });
    return response.data;
  },

  // Approve attendance (employer)
  approveAttendance: async (id, data = {}) => {
    const response = await api.put(`/attendance/${id}/approve`, data);
    return response.data;
  },

  // Mark manual attendance (employer)
  markManualAttendance: async (data) => {
    const response = await api.post('/attendance/manual', data);
    return response.data;
  },
};
```

**File: `frontend/src/services/adminService.js`**
```javascript
import api from './api';

export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Get all employers
  getAllEmployers: async (params = {}) => {
    const response = await api.get('/admin/employers', { params });
    return response.data;
  },

  // Approve employer
  approveEmployer: async (id) => {
    const response = await api.put(`/admin/employers/${id}/approve`);
    return response.data;
  },

  // Block employer
  blockEmployer: async (id, data) => {
    const response = await api.put(`/admin/employers/${id}/block`, data);
    return response.data;
  },

  // Unblock employer
  unblockEmployer: async (id) => {
    const response = await api.put(`/admin/employers/${id}/unblock`);
    return response.data;
  },

  // Get all applicants
  getAllApplicants: async (params = {}) => {
    const response = await api.get('/admin/applicants', { params });
    return response.data;
  },

  // Deactivate applicant
  deactivateApplicant: async (id, data) => {
    const response = await api.put(`/admin/applicants/${id}/deactivate`, data);
    return response.data;
  },

  // Delete job
  deleteJob: async (id, data) => {
    const response = await api.delete(`/admin/jobs/${id}`, { data });
    return response.data;
  },
};
```

**File: `frontend/src/services/uploadService.js`**
```javascript
export const uploadService = {
  // Upload file to Cloudinary
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  },
};
```

---

## 🎨 Shared Components (60 minutes)

### Step 8: Create Common Components

**File: `frontend/src/components/common/Navbar.jsx`**
```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiUser, FiBriefcase, FiUsers, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isEmployer, isApplicant, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBriefcase className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">ShiftMaster</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/jobs" className="text-gray-700 hover:text-primary-600">
                  Browse Jobs
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/signup/employer" className="btn btn-primary">
                  Post Jobs
                </Link>
              </>
            ) : (
              <>
                {isEmployer && (
                  <>
                    <Link to="/employer/dashboard" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/employer/jobs" className="text-gray-700 hover:text-primary-600">
                      My Jobs
                    </Link>
                    <Link to="/employer/shifts" className="text-gray-700 hover:text-primary-600">
                      Shifts
                    </Link>
                  </>
                )}

                {isApplicant && (
                  <>
                    <Link to="/applicant/dashboard" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/jobs" className="text-gray-700 hover:text-primary-600">
                      Browse Jobs
                    </Link>
                    <Link to="/applicant/applications" className="text-gray-700 hover:text-primary-600">
                      My Applications
                    </Link>
                    <Link to="/applicant/shifts" className="text-gray-700 hover:text-primary-600">
                      My Shifts
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                    <Link to="/admin/employers" className="text-gray-700 hover:text-primary-600">
                      Employers
                    </Link>
                    <Link to="/admin/applicants" className="text-gray-700 hover:text-primary-600">
                      Applicants
                    </Link>
                  </>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <FiUser className="h-5 w-5" />
                    <span>{user.name || user.storeName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <Link
                      to={`/${user.userType}/profile`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FiSettings className="inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

**File: `frontend/src/components/common/Footer.jsx`**
```javascript
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShiftMaster</h3>
            <p className="text-sm">
              Connecting employers with talented job seekers for shift-based and full-time opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/signup/employer" className="hover:text-white">Post a Job</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
              <li><Link to="/signup/applicant" className="hover:text-white">Create Account</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <FiMail className="mr-2" />
                support@shiftmaster.com
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2" />
                +91 1234567890
              </li>
              <li className="flex items-center">
                <FiMapPin className="mr-2" />
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2024 ShiftMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

**File: `frontend/src/components/common/Loader.jsx`**
```javascript
const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const loader = (
    <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {loader}
      </div>
    );
  }

  return <div className="flex justify-center items-center p-4">{loader}</div>;
};

export default Loader;
```

**File: `frontend/src/components/common/ProtectedRoute.jsx`**
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

**File: `frontend/src/components/common/Pagination.jsx`**
```javascript
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronLeft />
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="btn btn-secondary">
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="btn btn-secondary">
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
```

**File: `frontend/src/components/common/Toast.jsx`**
```javascript
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toast;
```

---

**This guide continues with:**
- Step 9: Authentication Components (Login, Signup Forms)
- Step 10: Job Components (JobCard, JobList, JobForm, etc.)
- Step 11: Application Components
- Step 12: Shift Components
- Step 13: Attendance Components
- Step 14: Admin Components
- Step 15: All Page Components
- Step 16: Routing Setup
- Step 17: Utils and Helpers
- Step 18: Final Integration

**Due to length constraints, I'll create this as a multi-part guide. This is Part 1 of the complete frontend build guide.**

---

**Next Steps:**
1. Review this first part
2. I'll create Part 2 with all remaining components
3. Then Part 3 with pages and routing
4. Finally Part 4 with deployment

Would you like me to continue with Part 2 now?
