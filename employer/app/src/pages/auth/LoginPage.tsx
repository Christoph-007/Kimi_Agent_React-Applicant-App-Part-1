import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserType } from '@/types';

export function LoginPage() {
  const [selectedType, setSelectedType] = useState<Exclude<UserType, 'admin'>>('applicant');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(identifier, password, selectedType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to continue to your account</p>
      </div>

      {/* User Type Selector */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setSelectedType('applicant')}
          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedType === 'applicant'
              ? 'border-forest-900 bg-forest-50 text-forest-900'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Applicant</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('employer')}
          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedType === 'employer'
              ? 'border-forest-900 bg-forest-50 text-forest-900'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="font-medium">Employer</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email or Phone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-forest-900 focus:ring-forest-500" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <NavLink to="/forgot-password" className="text-sm text-forest-700 hover:text-forest-900 font-medium">
            Forgot password?
          </NavLink>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-8 text-center text-gray-600">
        Don't have an account?{' '}
        <NavLink
          to={`/signup/${selectedType}`}
          className="text-forest-700 hover:text-forest-900 font-medium"
        >
          Sign up
        </NavLink>
      </p>
    </div>
  );
}
