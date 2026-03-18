# ShiftMaster - React Implementation Guide
> **Generated:** 2026-03-04 | **Target:** React 18 + TypeScript + Vite

---

## 📚 Table of Contents

1. [Project Setup](#-1-project-setup)
2. [Architecture](#-2-architecture)
3. [Folder Structure](#-3-folder-structure)
4. [Core Implementation](#-4-core-implementation)
5. [Feature Modules](#-5-feature-modules)
6. [State Management](#-6-state-management)
7. [UI Components](#-7-ui-components)
8. [Testing](#-8-testing)
9. [Build & Deploy](#-9-build--deploy)

---

## 🚀 1. Project Setup

### 1.1 Create Project
```bash
# Create Vite + React + TypeScript project
npm create vite@latest shiftmaster-web -- --template react-ts

# Navigate to project
cd shiftmaster-web

# Install dependencies
npm install

# Install additional dependencies
npm install \
  react-router-dom \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  axios \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  lucide-react \
  clsx \
  tailwind-merge \
  date-fns \
  react-hot-toast

# Install dev dependencies
npm install -D \
  @types/node \
  @types/react-router-dom \
  tailwindcss \
  postcss \
  autoprefixer \
  eslint \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser
```

### 1.2 Vite Configuration
```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### 1.3 TypeScript Configuration
```json
// tsconfig.json

{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.4 Tailwind CSS Setup
```javascript
// tailwind.config.js

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
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1976d2',
          600: '#1565c0',
          700: '#115293',
          800: '#0d47a1',
          900: '#0a3570',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

```css
/* src/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply btn bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500;
  }
  
  .btn-danger {
    @apply btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  
  .input {
    @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200;
  }
}
```

---

## 🏗️ 2. Architecture

### Feature-Based Folder Structure

```
src/
├── api/                    # API client and service modules
│   ├── client.ts          # Axios instance
│   ├── auth.ts            # Auth API
│   ├── jobs.ts            # Jobs API
│   └── ...
│
├── components/            # Shared UI components
│   ├── ui/               # Primitive components (Button, Input, etc.)
│   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   └── common/           # Common components (Loading, Error, etc.)
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useJobs.ts
│   └── ...
│
├── contexts/             # React contexts
│   └── AuthContext.tsx
│
├── stores/               # Zustand stores
│   └── authStore.ts
│
├── pages/                # Page components
│   ├── LandingPage.tsx
│   ├── auth/
│   ├── applicant/
│   ├── employer/
│   └── admin/
│
├── layouts/              # Layout components
│   ├── MainLayout.tsx
│   ├── AdminLayout.tsx
│   └── AuthLayout.tsx
│
├── types/                # TypeScript types
│   └── index.ts
│
├── utils/                # Utility functions
│   └── helpers.ts
│
├── lib/                  # Library configurations
│   └── queryClient.ts
│
└── App.tsx
```

---

## 🔧 3. Core Implementation

### 3.1 API Client

```typescript
// src/api/client.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        const message = error.response?.data?.message || 'An error occurred';
        return Promise.reject(new Error(message));
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T, T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.post<T, T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client.put<T, T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T, T>(url, config);
  }
}

interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export const apiClient = new ApiClient();
```

### 3.2 Types

```typescript
// src/types/index.ts

// User Types
export type UserType = 'applicant' | 'employer' | 'admin';

export interface User {
  _id: string;
  email: string;
  type: UserType;
  name?: string;
  storeName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  isActive?: boolean;
}

// Job Types
export interface Job {
  _id: string;
  title: string;
  description: string;
  jobType: 'full-time' | 'part-time' | 'shift' | 'contract';
  salary: {
    amount: number;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  location: {
    address?: string;
    city: string;
    state: string;
    pincode: string;
  };
  workingHours?: {
    hoursPerDay?: number;
    daysPerWeek?: number;
    shiftTiming?: string;
  };
  requirements?: {
    minimumExperience?: number;
    skills?: string[];
    education?: string;
    otherRequirements?: string;
  };
  benefits?: string[];
  status: 'open' | 'closed' | 'filled';
  employer: {
    _id: string;
    storeName: string;
    businessType: string;
  };
  totalApplications: number;
  views: number;
  createdAt: string;
}

// Application Types
export interface Application {
  _id: string;
  job: Job;
  applicant: Applicant;
  employer: {
    _id: string;
    storeName: string;
  };
  coverLetter?: string;
  expectedSalary?: number;
  status: 'applied' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  rejectionReason?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
}

export interface Applicant {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  skills?: string[];
  experience?: number;
  resume?: {
    url: string;
    publicId: string;
  };
}

export interface StatusHistory {
  status: string;
  updatedBy: string;
  updatedByModel: string;
  note?: string;
  timestamp: string;
}

// Pagination
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}
```

### 3.3 Auth Context

```typescript
// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  unreadCount: number;
  login: (identifier: string, password: string, userType: string) => Promise<void>;
  signup: (data: unknown, userType: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

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

  const fetchUnreadCount = async () => {
    try {
      const response = await authApi.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch {
      // Ignore error
    }
  };

  const login = async (identifier: string, password: string, userType: string) => {
    const response = await authApi.login({ identifier, password, userType });
    localStorage.setItem('token', response.token);
    setUser(response.user);
    
    const routes: Record<string, string> = {
      applicant: '/home',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
    };
    navigate(routes[userType]);
  };

  const signup = async (data: unknown, userType: string) => {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 📦 4. Feature Implementation

### 4.1 Login Page

```typescript
// src/pages/auth/LoginPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['applicant', 'employer']),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [selectedType, setSelectedType] = useState<'applicant' | 'employer'>('applicant');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: 'applicant',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.identifier, data.password, data.userType);
    } catch (error) {
      // Error handled by API interceptor
    }
  };

  const handleTypeChange = (type: 'applicant' | 'employer') => {
    setSelectedType(type);
    setValue('userType', type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to continue</p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('applicant')}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              selectedType === 'applicant'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <User className="w-5 h-5" />
            Applicant
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('employer')}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              selectedType === 'employer'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <Input
              label="Email or Phone"
              {...register('identifier')}
              error={errors.identifier?.message}
              placeholder="Enter your email or phone"
            />
          </div>

          <div>
            <Input
              type="password"
              label="Password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(`/signup/${selectedType}`)}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
```

### 4.2 Jobs List Page with TanStack Query

```typescript
// src/pages/applicant/BrowseJobsPage.tsx

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Search } from 'lucide-react';

export function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const jobType = searchParams.get('jobType') || '';

  const { data, isLoading, error } = useJobs({
    page,
    limit: 10,
    search,
    jobType,
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: String(newPage) });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading jobs"
        description={error.message}
        icon="error"
      />
    );
  }

  const jobs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Browse Jobs</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
        >
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs by title, company, or skills..."
          className="input pl-10"
          value={search}
          onChange={(e) => setSearchParams({ search: e.target.value })}
        />
      </div>

      {/* Filters */}
      {showFilters && <JobFilters />}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your search or filters"
          icon="search"
        />
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
```

### 4.3 Custom Hook for Jobs

```typescript
// src/hooks/useJobs.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs';
import type { Job, ApiResponse, Pagination } from '@/types';

interface JobsFilters {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  category?: string;
  status?: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: Pagination;
}

export function useJobs(filters: JobsFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { coverLetter: string; expectedSalary: number } }) =>
      jobsApi.apply(jobId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

---

## 🧪 5. Testing

### Unit Test Example

```typescript
// src/components/jobs/__tests__/JobCard.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JobCard } from '../JobCard';
import type { Job } from '@/types';

const mockJob: Job = {
  _id: '1',
  title: 'Chef Required',
  description: 'Looking for a chef',
  jobType: 'part-time',
  salary: { amount: 200, period: 'daily' },
  location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  employer: { _id: '2', storeName: 'Tech Cafe', businessType: 'restaurant' },
  status: 'open',
  totalApplications: 5,
  views: 45,
  createdAt: '2024-01-15T10:30:00.000Z',
};

describe('JobCard', () => {
  it('renders job information correctly', () => {
    render(
      <MemoryRouter>
        <JobCard job={mockJob} />
      </MemoryRouter>
    );

    expect(screen.getByText('Chef Required')).toBeInTheDocument();
    expect(screen.getByText('Tech Cafe')).toBeInTheDocument();
    expect(screen.getByText('₹200/day')).toBeInTheDocument();
    expect(screen.getByText('Mumbai, Maharashtra')).toBeInTheDocument();
  });
});
```

---

## 🚀 6. Build & Deploy

### Build Configuration

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production
VITE_API_URL=https://api.shiftmaster.app
```

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**End of React Implementation Guide**
