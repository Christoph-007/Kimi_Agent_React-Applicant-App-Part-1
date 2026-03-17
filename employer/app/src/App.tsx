import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MainLayout, AuthLayout, EmployerLayout } from '@/layouts';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ApplicantSignupPage } from '@/pages/auth/ApplicantSignupPage';
import { EmployerSignupPage } from '@/pages/auth/EmployerSignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// Applicant Pages
import { HomePage } from '@/pages/applicant/HomePage';
import { JobsPage as ApplicantJobsPage } from '@/pages/applicant/JobsPage';
import { JobDetailPage as ApplicantJobDetailPage } from '@/pages/applicant/JobDetailPage';
import { MyJobsPage as ApplicantMyJobsPage } from '@/pages/applicant/MyJobsPage';
import { ShiftsPage as ApplicantShiftsPage } from '@/pages/applicant/ShiftsPage';
import { AttendancePage as ApplicantAttendancePage } from '@/pages/applicant/AttendancePage';
import { ProfilePage } from '@/pages/applicant/ProfilePage';
import { NotificationsPage, ShiftDetailPage } from '@/pages';

// Employer Pages
import { DashboardPage } from '@/pages/employer/DashboardPage';
import { JobsPage as EmployerJobsPage } from '@/pages/employer/JobsPage';
import { JobFormPage } from '@/pages/employer/JobFormPage';
import { JobApplicationsPage } from '@/pages/employer/JobApplicationsPage';
import { BrowseApplicantsPage } from '@/pages/employer/BrowseApplicantsPage';
import { ApplicantProfilePage } from '@/pages/employer/ApplicantProfilePage';
import { SendJobRequestPage } from '@/pages/employer/SendJobRequestPage';
import { ShortlistPage } from '@/pages/employer/ShortlistPage';
import { ShiftsPage as EmployerShiftsPage } from '@/pages/employer/ShiftsPage';
import { CreateShiftPage } from '@/pages/employer/CreateShiftPage';
import { AttendancePage as EmployerAttendancePage } from '@/pages/employer/AttendancePage';
import { JobRequestsPage } from '@/pages/employer/JobRequestsPage';
import { SettingsPage } from '@/pages/employer/SettingsPage';

// Create Query Client
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
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup/applicant" element={<ApplicantSignupPage />} />
              <Route path="/signup/employer" element={<EmployerSignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* Applicant Routes */}
            <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/jobs" element={<ApplicantJobsPage />} />
                <Route path="/jobs/:id" element={<ApplicantJobDetailPage />} />
                <Route path="/my-jobs" element={<ApplicantMyJobsPage />} />
                <Route path="/shifts" element={<ApplicantShiftsPage />} />
                <Route path="/shifts/:id" element={<ShiftDetailPage />} />
                <Route path="/attendance" element={<ApplicantAttendancePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>

            {/* Employer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route element={<EmployerLayout />}>
                <Route path="/employer/dashboard" element={<DashboardPage />} />
                <Route path="/employer/jobs" element={<EmployerJobsPage />} />
                <Route path="/employer/jobs/new" element={<JobFormPage />} />
                <Route path="/employer/jobs/:id/edit" element={<JobFormPage />} />
                <Route path="/employer/jobs/:id/applications" element={<JobApplicationsPage />} />
                <Route path="/employer/applicants" element={<BrowseApplicantsPage />} />
                <Route path="/employer/applicants/:id" element={<ApplicantProfilePage />} />
                <Route path="/employer/applicants/:id/request" element={<SendJobRequestPage />} />
                <Route path="/employer/shortlist" element={<ShortlistPage />} />
                <Route path="/employer/shifts" element={<EmployerShiftsPage />} />
                <Route path="/employer/shifts/new" element={<CreateShiftPage />} />
                <Route path="/employer/shifts/:id/edit" element={<CreateShiftPage />} />
                <Route path="/employer/attendance" element={<EmployerAttendancePage />} />
                <Route path="/employer/requests" element={<JobRequestsPage />} />
                <Route path="/employer/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Admin Routes - Placeholder for Part 3 */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/*" element={<Navigate to="/login" />} />
            </Route>

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized</h1>
                  <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
                  <a href="/" className="text-forest-700 hover:text-forest-900 font-medium">
                    Go back home
                  </a>
                </div>
              </div>
            } />

            {/* 404 Page */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-500 mb-6">Page not found.</p>
                  <a href="/" className="text-forest-700 hover:text-forest-900 font-medium">
                    Go back home
                  </a>
                </div>
              </div>
            } />
          </Routes>
          <Toaster position="top-right" expand={true} richColors />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
