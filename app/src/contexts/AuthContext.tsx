import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type SignupData } from '@/api/auth';
import type { User, UserType } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  unreadCount: number;
  login: (identifier: string, password: string, userType: UserType) => Promise<void>;
  signup: (data: SignupData, userType: Exclude<UserType, 'admin'>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  fetchUnreadCount: () => Promise<void>;
  forgotPassword: (email: string, userType: UserType) => Promise<void>;
  resetPassword: (token: string, password: string, userType: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const response = await authApi.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch {
      // Ignore error
    }
  };

  const checkAuth = async () => {
    // Cross-port session transfer support
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      localStorage.setItem('token_applicant', urlToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token_applicant');
    if (token) {
      try {
        const response = await authApi.getMe();
        const userData = response.data;

        setUser(userData);
        if (!(userData.type === 'applicant' && userData.isActive === false) &&
            !(userData.type === 'employer' && userData.isBlocked === true)) {
          fetchUnreadCount();
        }
      } catch {
        localStorage.removeItem('token_applicant');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (identifier: string, password: string, userType?: UserType | string) => {
    const response = await authApi.login({ identifier, password, userType: userType || '' });
    
    // The backend now detects the user's type automatically
    const actualUserType = response.user.type;

    // Check if account is deactivated or blocked
    if (actualUserType === 'applicant' && response.user.isActive === false) {
      throw new Error('This account has been deactivated. Please contact support.');
    }
    if (actualUserType === 'employer' && response.user.isBlocked === true) {
      throw new Error('This account has been blocked. Please contact support.');
    }

    localStorage.setItem('token_applicant', response.token);
    setUser(response.user);

    // If employer or admin, redirect to their dedicated apps with token transfer
    if (actualUserType === 'admin') {
      window.location.href = `http://localhost:5175/admin/dashboard?token=${response.token}`;
      return;
    }
    
    if (actualUserType === 'employer') {
      window.location.href = `http://localhost:5174/employer/dashboard?token=${response.token}`;
      return;
    }

    navigate('/home');
  };

  const signup = async (data: SignupData, userType: Exclude<UserType, 'admin'>) => {
    const response = await authApi.signup(data, userType);
    localStorage.setItem('token_applicant', response.token);
    setUser(response.user);

    if (userType === 'employer') {
      window.location.href = `http://localhost:5174/employer/dashboard?token=${response.token}`;
      return;
    }
    
    navigate('/home');
  };

  const logout = () => {
    localStorage.removeItem('token_applicant');
    setUser(null);
    setUnreadCount(0);
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      const userData = response.data;

      setUser(userData);
      return userData;
    } catch (error) {
      if ((error as any)?.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
      throw error;
    }
  };

  const forgotPassword = async (email: string, userType: UserType) => {
    await authApi.forgotPassword({ email, userType });
  };

  const resetPassword = async (token: string, password: string, userType: UserType) => {
    await authApi.resetPassword(token, { password, userType });
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
        fetchUnreadCount,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
