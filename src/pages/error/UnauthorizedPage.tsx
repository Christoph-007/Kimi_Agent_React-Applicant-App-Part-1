import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Home, LogOut } from 'lucide-react';

export function UnauthorizedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const message = location.state?.message || "Sorry, you don't have permission to access the system at this time.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5ED] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-[#F5F5ED] transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
        
        <p className="mt-8 text-sm text-gray-400">
          If you believe this is a mistake, please contact our support team at support@example.com
        </p>
      </div>
    </div>
  );
}
