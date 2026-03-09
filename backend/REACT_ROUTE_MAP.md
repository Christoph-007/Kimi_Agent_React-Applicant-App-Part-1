# ShiftMaster - React Route Map
> **Generated:** 2026-03-04 | **Purpose:** Complete navigation and routing structure for React website

---

## 🗺️ Navigation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REACT ROUTER STRUCTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   AuthRoutes    │    │ ApplicantRoutes │    │  EmployerRoutes │         │
│  │   (Public)      │    │  (Protected)    │    │  (Protected)    │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                  │
│           ▼                      ▼                      ▼                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  LandingPage    │    │  MainLayout     │    │  MainLayout     │         │
│  │  LoginPage      │    │  (Sidebar+      │    │  (Sidebar+      │         │
│  │  SignupPages    │    │   Header)       │    │   Header)       │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                │                      │                     │
│                                ▼                      ▼                     │
│                       ┌─────────────────┐    ┌─────────────────┐            │
│                       │  Nested Routes  │    │  Nested Routes  │            │
│                       │  - JobsRoutes   │    │  - JobsRoutes   │            │
│                       │  - ShiftsRoutes │    │  - ShiftsRoutes │            │
│                       │  - ProfileRoutes│    │  - ProfileRoutes│            │
│                       └─────────────────┘    └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Route Configuration

### Main Router Setup

```typescript
// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ApplicantSignupPage from './pages/auth/ApplicantSignupPage';
import EmployerSignupPage from './pages/auth/EmployerSignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Applicant Pages
import ApplicantHome from './pages/applicant/HomePage';
import BrowseJobs from './pages/applicant/BrowseJobsPage';
import JobDetail from './pages/applicant/JobDetailPage';
import MyJobs from './pages/applicant/MyJobsPage';
import MyShifts from './pages/applicant/MyShiftsPage';
import AttendanceHistory from './pages/applicant/AttendanceHistoryPage';
import Profile from './pages/applicant/ProfilePage';
import Notifications from './pages/applicant/NotificationsPage';

// Employer Pages
import EmployerDashboard from './pages/employer/DashboardPage';
import EmployerJobs from './pages/employer/JobsPage';
import PostJob from './pages/employer/PostJobPage';
import EditJob from './pages/employer/EditJobPage';
import JobApplications from './pages/employer/JobApplicationsPage';
import BrowseApplicants from './pages/employer/BrowseApplicantsPage';
import ApplicantProfile from './pages/employer/ApplicantProfilePage';
import SendJobRequest from './pages/employer/SendJobRequestPage';
import EmployerShifts from './pages/employer/ShiftsPage';
import CreateShift from './pages/employer/CreateShiftPage';
import AttendanceRecords from './pages/employer/AttendanceRecordsPage';
import Shortlist from './pages/employer/ShortlistPage';
import JobRequests from './pages/employer/JobRequestsPage';
import EmployerSettings from './pages/employer/SettingsPage';

// Admin Pages
import AdminLogin from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/DashboardPage';
import ManageEmployers from './pages/admin/ManageEmployersPage';
import ManageApplicants from './pages/admin/ManageApplicantsPage';
import ModerateJobs from './pages/admin/ModerateJobsPage';
import AdminAnalytics from './pages/admin/AnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup/applicant" element={<ApplicantSignupPage />} />
              <Route path="/signup/employer" element={<EmployerSignupPage />} />
            </Route>
            
            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Applicant Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
              <Route element={<MainLayout userType="applicant" />}>
                <Route path="/home" element={<ApplicantHome />} />
                <Route path="/jobs" element={<BrowseJobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/my-jobs" element={<MyJobs />} />
                <Route path="/my-jobs/requests/:id" element={<JobRequestDetail />} />
                <Route path="/shifts" element={<MyShifts />} />
                <Route path="/shifts/:id" element={<ShiftDetail />} />
                <Route path="/attendance" element={<AttendanceHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>
            
            {/* Employer Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route element={<MainLayout userType="employer" />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/jobs" element={<EmployerJobs />} />
                <Route path="/employer/jobs/create" element={<PostJob />} />
                <Route path="/employer/jobs/:id/edit" element={<EditJob />} />
                <Route path="/employer/jobs/:id/applications" element={<JobApplications />} />
                <Route path="/employer/applicants" element={<BrowseApplicants />} />
                <Route path="/employer/applicants/:id" element={<ApplicantProfile />} />
                <Route path="/employer/requests" element={<JobRequests />} />
                <Route path="/employer/requests/create" element={<SendJobRequest />} />
                <Route path="/employer/shortlist" element={<Shortlist />} />
                <Route path="/employer/shifts" element={<EmployerShifts />} />
                <Route path="/employer/shifts/create" element={<CreateShift />} />
                <Route path="/employer/attendance" element={<AttendanceRecords />} />
                <Route path="/employer/settings" element={<EmployerSettings />} />
              </Route>
            </Route>
            
            {/* Admin Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/employers" element={<ManageEmployers />} />
                <Route path="/admin/applicants" element={<ManageApplicants />} />
                <Route path="/admin/jobs" element={<ModerateJobs />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Route>
            </Route>
            
            {/* Error Pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

---

## 🛡️ Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx

import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles: ('applicant' | 'employer' | 'admin')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, save the intended destination
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  if (!allowedRoles.includes(user?.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check employer approval status
  if (user?.type === 'employer' && !user.isApproved) {
    // Allow access only to dashboard and settings
    const allowedPaths = ['/employer/dashboard', '/employer/settings'];
    if (!allowedPaths.includes(location.pathname)) {
      return <Navigate to="/employer/dashboard" replace />;
    }
  }

  return <Outlet />;
}
```

---

## 🏗️ Layout Components

### Main Layout (Applicant & Employer)

```typescript
// src/layouts/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface MainLayoutProps {
  userType: 'applicant' | 'employer';
}

export function MainLayout({ userType }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userType={userType} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar userType={userType} />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 mt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Sidebar Component

```typescript
// src/components/Sidebar.tsx

import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Briefcase, 
  Calendar, 
  ClipboardList,
  Bell,
  User,
  Settings,
  LogOut,
  Dashboard,
  Users,
  Star,
  Mail
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  userType: 'applicant' | 'employer';
}

const applicantNavItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/jobs', icon: Search, label: 'Browse Jobs' },
  { to: '/my-jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/shifts', icon: Calendar, label: 'My Shifts' },
  { to: '/attendance', icon: ClipboardList, label: 'Attendance' },
];

const employerNavItems = [
  { to: '/employer/dashboard', icon: Dashboard, label: 'Dashboard' },
  { to: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/employer/applicants', icon: Users, label: 'Browse Applicants' },
  { to: '/employer/shifts', icon: Calendar, label: 'Shifts' },
  { to: '/employer/attendance', icon: ClipboardList, label: 'Attendance' },
];

const bottomNavItems = [
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ userType }: SidebarProps) {
  const { logout, unreadCount } = useAuth();
  const location = useLocation();
  const navItems = userType === 'applicant' ? applicantNavItems : employerNavItems;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Bottom Navigation */}
      <nav className="px-4 py-4 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
            {item.badge && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
```

### Admin Layout

```typescript
// src/layouts/AdminLayout.tsx

import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  BarChart3,
  Bell,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const adminNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employers', icon: Building2, label: 'Manage Employers' },
  { to: '/admin/applicants', icon: Users, label: 'Manage Applicants' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Moderate Jobs' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-blue-900 text-white z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-lg">ShiftMaster Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-blue-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={logout}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Admin Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## 🔗 Navigation Hooks & Utils

### useAuth Hook

```typescript
// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Auth Context

```typescript
// src/contexts/AuthContext.tsx

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

interface User {
  _id: string;
  name?: string;
  storeName?: string;
  email: string;
  type: 'applicant' | 'employer' | 'admin';
  isApproved?: boolean;
  isBlocked?: boolean;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  unreadCount: number;
  login: (identifier: string, password: string, userType: string) => Promise<void>;
  signup: (data: any, userType: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authApi.getMe();
        setUser(userData);
        fetchUnreadCount();
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await authApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const login = async (identifier: string, password: string, userType: string) => {
    const response = await authApi.login({ identifier, password, userType });
    localStorage.setItem('token', response.token);
    setUser(response.user);
    
    // Navigate based on user type
    const route = {
      applicant: '/home',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
    }[userType];
    
    navigate(route);
  };

  const signup = async (data: any, userType: string) => {
    const response = await authApi.signup(data, userType);
    localStorage.setItem('token', response.token);
    setUser(response.user);
    
    const route = userType === 'employer' ? '/employer/dashboard' : '/home';
    navigate(route);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const refreshUser = async () => {
    const userData = await authApi.getMe();
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        unreadCount,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 📍 Navigation Examples

### Programmatic Navigation

```typescript
// Using useNavigate hook
import { useNavigate } from 'react-router-dom';

function JobCard({ job }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`);
  };

  const handleApply = () => {
    // Navigate with state
    navigate(`/jobs/${job._id}/apply`, {
      state: { from: 'browse', jobTitle: job.title }
    });
  };

  return (
    <div>
      <h3>{job.title}</h3>
      <button onClick={handleViewDetails}>View Details</button>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
```

### Link with Active State

```typescript
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          isActive ? 'text-blue-600 font-bold' : 'text-gray-600'
        }
      >
        Browse Jobs
      </NavLink>
    </nav>
  );
}
```

### Accessing Route Parameters

```typescript
import { useParams, useSearchParams } from 'react-router-dom';

function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query param
  const referrer = searchParams.get('ref');

  // Update query param
  const handleFilterChange = (filter: string) => {
    setSearchParams({ filter });
  };

  return (
    <div>
      <h1>Job ID: {id}</h1>
      <p>Referred from: {referrer}</p>
    </div>
  );
}
```

---

## 🧪 Route Testing

```typescript
// src/tests/routes.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('Routing', () => {
  it('renders landing page on /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/ShiftMaster/i)).toBeInTheDocument();
  });

  it('redirects to login for protected routes', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });
});
```

---

## 📝 URL Strategy

### Route Naming Convention

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | Login page |
| `/signup/:type` | Signup pages |
| `/home` | Applicant dashboard |
| `/jobs` | Browse jobs |
| `/jobs/:id` | Job detail |
| `/my-jobs` | Applicant's jobs |
| `/shifts` | Shifts list |
| `/shifts/:id` | Shift detail |
| `/profile` | User profile |
| `/employer/dashboard` | Employer dashboard |
| `/employer/jobs` | Employer's jobs |
| `/employer/jobs/create` | Post new job |
| `/employer/jobs/:id/edit` | Edit job |
| `/employer/applicants` | Browse applicants |
| `/admin/dashboard` | Admin dashboard |
| `/admin/employers` | Manage employers |

---

**End of React Route Map Documentation**
