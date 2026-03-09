import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import type { UserType } from '@/types';

interface ProtectedRouteProps {
  allowedRoles: UserType[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
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

  if (!allowedRoles.includes(user?.type as UserType)) {
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
