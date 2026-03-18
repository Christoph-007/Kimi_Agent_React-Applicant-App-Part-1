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
  refreshUser: () => Promise<void>;
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
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authApi.getMe();
        setUser(response.data);
        fetchUnreadCount();
      } catch {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (identifier: string, password: string, userType: UserType) => {
    const response = await authApi.login({ identifier, password, userType });
    localStorage.setItem('token', response.token);
    setUser(response.user);

    // Admin users should use the dedicated admin app
    if (userType === 'admin') {
      window.location.href = 'http://localhost:5175/login';
      return;
    }

    // Navigate based on user type
    const routes: Record<Exclude<UserType, 'admin'>, string> = {
      applicant: '/home',
      employer: '/employer/dashboard',
    };

    navigate(routes[userType as Exclude<UserType, 'admin'>]);
  };

  const signup = async (data: SignupData, userType: Exclude<UserType, 'admin'>) => {
    const response = await authApi.signup(data, userType);
    localStorage.setItem('token', response.token);
    setUser(response.user);

    const route = userType === 'employer' ? '/employer/dashboard' : '/home';
    navigate(route);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUnreadCount(0);
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch {
      // Ignore error
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
