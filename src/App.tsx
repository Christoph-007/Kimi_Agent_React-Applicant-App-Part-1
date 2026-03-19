import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { MainLayout, AuthLayout, ApplicantLayout, EmployerLayout, AdminLayout } from '@/layouts';

// ============ PUBLIC PAGES ============
import { LandingPage } from '@/pages/public/LandingPage';
import { BlogPage } from '@/pages/public/BlogPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { CandidatesPage } from '@/pages/public/CandidatesPage';
import { BrowseJobsPage } from '@/pages/public/BrowseJobsPage';
import { JobDetailPage as PublicJobDetailPage } from '@/pages/public/JobDetailPage';

// ============ AUTH PAGES ============
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ApplicantSignupPage } from '@/pages/auth/ApplicantSignupPage';
import { EmployerSignupPage } from '@/pages/auth/EmployerSignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// ============ APPLICANT PAGES ============
import { HomePage as ApplicantHomePage } from '@/pages/applicant/HomePage';
import { JobsPage as ApplicantJobsPage } from '@/pages/applicant/JobsPage';
import { JobDetailPage as ApplicantJobDetailPage } from '@/pages/applicant/JobDetailPage';
import { MyJobsPage } from '@/pages/applicant/MyJobsPage';
import { ShiftsPage as ApplicantShiftsPage } from '@/pages/applicant/ShiftsPage';
import { ShiftDetailPage } from '@/pages/applicant/ShiftDetailPage';
import { AttendancePage as ApplicantAttendancePage } from '@/pages/applicant/AttendancePage';
import { NotificationsPage as ApplicantNotificationsPage } from '@/pages/applicant/NotificationsPage';
import { ProfilePage as ApplicantProfilePage } from '@/pages/applicant/ProfilePage';

// ============ EMPLOYER PAGES ============
import { DashboardPage as EmployerDashboardPage } from '@/pages/employer/DashboardPage';
import { JobsPage as EmployerJobsPage } from '@/pages/employer/JobsPage';
import { JobFormPage } from '@/pages/employer/JobFormPage';
import { JobApplicationsPage } from '@/pages/employer/JobApplicationsPage';
import { BrowseApplicantsPage } from '@/pages/employer/BrowseApplicantsPage';
import { ApplicantProfilePage as EmployerApplicantProfilePage } from '@/pages/employer/ApplicantProfilePage';
import { SendJobRequestPage } from '@/pages/employer/SendJobRequestPage';
import { ShortlistPage } from '@/pages/employer/ShortlistPage';
import { ShiftsPage as EmployerShiftsPage } from '@/pages/employer/ShiftsPage';
import { CreateShiftPage } from '@/pages/employer/CreateShiftPage';
import { AttendancePage as EmployerAttendancePage } from '@/pages/employer/AttendancePage';
import { JobRequestsPage } from '@/pages/employer/JobRequestsPage';
import { SettingsPage as EmployerSettingsPage } from '@/pages/employer/SettingsPage';
import { EmployeesPage } from '@/pages/employer/EmployeesPage';
import { AllApplicationsPage } from '@/pages/employer/AllApplicationsPage';

// ============ ADMIN PAGES ============
import { DashboardPage as AdminDashboardPage } from '@/pages/admin/DashboardPage';
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage';
import { EmployersPage } from '@/pages/admin/EmployersPage';
import { ApplicantsPage } from '@/pages/admin/ApplicantsPage';
import { JobsPage as AdminJobsPage } from '@/pages/admin/JobsPage';
import { JobDetailPage as AdminJobDetailPage } from '@/pages/admin/JobDetailPage';
import { NotificationsPage as AdminNotificationsPage } from '@/pages/admin/NotificationsPage';
import { ProfilePage as AdminProfilePage } from '@/pages/admin/ProfilePage';

// ============ ERROR PAGES ============
import { UnauthorizedPage } from '@/pages/error/UnauthorizedPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
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
            {/* =========================================
                PUBLIC ROUTES (No authentication required)
                ========================================= */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<BrowseJobsPage />} />
              <Route path="/jobs/:id" element={<PublicJobDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
            </Route>

            {/* =========================================
                AUTH ROUTES (Login/Signup pages)
                ========================================= */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/register/applicant" element={<ApplicantSignupPage />} />
              <Route path="/register/employer" element={<EmployerSignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* =========================================
                APPLICANT ROUTES (Role: applicant only)
                ========================================= */}
            <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
              <Route element={<ApplicantLayout />}>
                <Route path="/applicant/home" element={<ApplicantHomePage />} />
                <Route path="/applicant/jobs" element={<ApplicantJobsPage />} />
                <Route path="/applicant/jobs/:id" element={<ApplicantJobDetailPage />} />
                <Route path="/applicant/my-jobs" element={<MyJobsPage />} />
                <Route path="/applicant/shifts" element={<ApplicantShiftsPage />} />
                <Route path="/applicant/shifts/:id" element={<ShiftDetailPage />} />
                <Route path="/applicant/attendance" element={<ApplicantAttendancePage />} />
                <Route path="/applicant/notifications" element={<ApplicantNotificationsPage />} />
                <Route path="/applicant/profile" element={<ApplicantProfilePage />} />
              </Route>
            </Route>

            {/* =========================================
                EMPLOYER ROUTES (Role: employer only)
                ========================================= */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route element={<EmployerLayout />}>
                <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
                <Route path="/employer/jobs" element={<EmployerJobsPage />} />
                <Route path="/employer/jobs/create" element={<JobFormPage />} />
                <Route path="/employer/jobs/:id/edit" element={<JobFormPage />} />
                <Route path="/employer/jobs/:id/applications" element={<JobApplicationsPage />} />
                <Route path="/employer/applicants" element={<BrowseApplicantsPage />} />
                <Route path="/employer/applicants/:id" element={<EmployerApplicantProfilePage />} />
                <Route path="/employer/shortlist" element={<ShortlistPage />} />
                <Route path="/employer/shifts" element={<EmployerShiftsPage />} />
                <Route path="/employer/shifts/create" element={<CreateShiftPage />} />
                <Route path="/employer/attendance" element={<EmployerAttendancePage />} />
                <Route path="/employer/job-requests" element={<JobRequestsPage />} />
                <Route path="/employer/job-requests/send" element={<SendJobRequestPage />} />
                <Route path="/employer/employees" element={<EmployeesPage />} />
                <Route path="/employer/applications" element={<AllApplicationsPage />} />
                <Route path="/employer/settings" element={<EmployerSettingsPage />} />
              </Route>
            </Route>

            {/* =========================================
                ADMIN ROUTES (Role: admin only)
                ========================================= */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/applicants" element={<ApplicantsPage />} />
                <Route path="/admin/employers" element={<EmployersPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/jobs/:id" element={<AdminJobDetailPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
              </Route>
            </Route>

            {/* =========================================
                ERROR ROUTES
                ========================================= */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
          <Toaster position="top-right" expand={true} richColors />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
