import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type SignupData } from '@/api/auth';
import { getAuthRole, getStorageKey, TOKEN_KEY, USER_KEY } from '@/lib/storage';

// User type for all three roles
export type UserType = 'applicant' | 'employer' | 'admin';

export interface AuthUser {
  _id: string;
  email: string;
  type: UserType;
  name?: string;
  storeName?: string;
  ownerName?: string;
  businessType?: string;
  businessDescription?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isApproved?: boolean;
  isBlocked?: boolean;
  isActive?: boolean;
  phone?: string;
  skills?: string[];
  experience?: number;
  preferredJobType?: string;
  jobCategories?: string[];
  preferredShiftType?: string;
  preferredWorkLocation?: string;
  expectedHourlyRate?: number;
  availabilityDays?: string[];
  resume?: {
    url: string;
    publicId: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  unreadCount: number;
  login: (identifier: string, password: string, userType?: UserType, redirectTo?: string) => Promise<void>;
  signup: (data: SignupData, userType: Exclude<UserType, 'admin'>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
  fetchUnreadCount: () => Promise<void>;
  forgotPassword: (email: string, userType: UserType) => Promise<void>;
  resetPassword: (token: string, password: string, userType: UserType) => Promise<void>;
  // Role helpers
  isApplicant: () => boolean;
  isEmployer: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Role helper functions
  const isApplicant = () => user?.type === 'applicant';
  const isEmployer = () => user?.type === 'employer';
  const isAdmin = () => user?.type === 'admin';

  const fetchUnreadCount = async () => {
    try {
      const response = await authApi.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch {
      // Ignore error - user might not be fully authenticated
    }
  };

  const checkAuth = async () => {
    const role = getAuthRole();
    const tokenKey = getStorageKey(TOKEN_KEY, role);
    const userKey = getStorageKey(USER_KEY, role);
    
    const token = localStorage.getItem(tokenKey);
    const savedUser = localStorage.getItem(userKey);
    
    if (token && savedUser) {
      try {
        // Try to parse saved user first for quick load
        setUser(JSON.parse(savedUser));
        
        // Then verify with server
        const response = await authApi.getMe();
        const userData = response.data;
        
        setUser(userData);
        localStorage.setItem(userKey, JSON.stringify(userData));
        
        // Fetch unread notifications if account is active
        if (!(userData.type === 'applicant' && userData.isActive === false) &&
            !(userData.type === 'employer' && userData.isBlocked === true)) {
          fetchUnreadCount();
        }
      } catch {
        // Clear invalid session
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [window.location.pathname]); // Re-check if path changes (helps with role isolation)

  const login = async (identifier: string, password: string, userType?: UserType, redirectTo?: string) => {
    const response = await authApi.login({ identifier, password, userType: userType || '' });
    
    // Backend detects the user's type automatically
    const actualUserType = response.user.type;

    // Check if account is deactivated or blocked
    if (actualUserType === 'applicant' && response.user.isActive === false) {
      throw new Error('This account has been deactivated. Please contact support.');
    }
    if (actualUserType === 'employer' && response.user.isBlocked === true) {
      throw new Error('This account has been blocked. Please contact support.');
    }

    // Store token and user data with role-specific keys
    const tokenKey = getStorageKey(TOKEN_KEY, actualUserType);
    const userKey = getStorageKey(USER_KEY, actualUserType);

    localStorage.setItem(tokenKey, response.token);
    localStorage.setItem(userKey, JSON.stringify(response.user));
    setUser(response.user);

    // If a redirect path is provided, use it
    if (redirectTo) {
      navigate(redirectTo);
      return;
    }

    // Otherwise navigate based on role
    switch (actualUserType) {
      case 'applicant':
        navigate('/applicant/home');
        break;
      case 'employer':
        navigate('/employer/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const signup = async (data: SignupData, userType: Exclude<UserType, 'admin'>) => {
    const response = await authApi.signup(data, userType);
    
    const tokenKey = getStorageKey(TOKEN_KEY, userType);
    const userKey = getStorageKey(USER_KEY, userType);

    localStorage.setItem(tokenKey, response.token);
    localStorage.setItem(userKey, JSON.stringify(response.user));
    setUser(response.user);

    // Navigate based on role
    if (userType === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/applicant/home');
    }
  };

  const logout = () => {
    const role = getAuthRole();
    localStorage.removeItem(getStorageKey(TOKEN_KEY, role));
    localStorage.removeItem(getStorageKey(USER_KEY, role));
    setUser(null);
    setUnreadCount(0);
    navigate('/login');
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      const userData = response.data;
      const role = userData.type;

      setUser(userData);
      localStorage.setItem(getStorageKey(USER_KEY, role), JSON.stringify(userData));
      return userData;
    } catch (error) {
      if ((error as any)?.response?.status === 401) {
        const role = getAuthRole();
        localStorage.removeItem(getStorageKey(TOKEN_KEY, role));
        localStorage.removeItem(getStorageKey(USER_KEY, role));
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
        isApplicant,
        isEmployer,
        isAdmin,
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
