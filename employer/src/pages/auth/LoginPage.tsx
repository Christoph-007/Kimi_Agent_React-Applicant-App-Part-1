import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
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
      // Automatic detection: the backend handles the role search
      await (login as any)(identifier, password, ''); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#C8F435' }}>
              <Lock className="w-7 h-7" style={{ color: '#0D2B1A' }} />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: '#0D2B1A' }}>
            ShiftMatch Login
          </h1>
          <p className="text-gray-500 font-medium">Automatic role detection enabled</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#1A1A1A' }}>
              Email or Phone
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              className="w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150"
              style={{ borderColor: '#E0E0D8', backgroundColor: '#FAFAF8' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#C8F435'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(200,244,53,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E0E0D8'; e.currentTarget.style.boxShadow = ''; }}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold" style={{ color: '#1A1A1A' }}>
                Password
              </label>
              <NavLink
                to="/forgot-password"
                className="text-xs font-bold transition-colors duration-200 hover:underline"
                style={{ color: '#0D2B1A' }}
              >
                Forgot?
              </NavLink>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 pr-12"
                style={{ borderColor: '#E0E0D8', backgroundColor: '#FAFAF8' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#C8F435'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(200,244,53,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E0E0D8'; e.currentTarget.style.boxShadow = ''; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-white rounded-full font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:brightness-90 active:scale-95 shadow-lg"
            style={{ backgroundColor: '#0D2B1A' }}
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
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Don't have an account yet?
          </p>
          <NavLink
            to="/signup"
            className="inline-flex items-center justify-center w-full py-3 rounded-full font-bold transition-all duration-200 border-2 hover:bg-forest-50"
            style={{ borderColor: '#0D2B1A', color: '#0D2B1A' }}
          >
            Create New Account
          </NavLink>
        </div>
      </div>
    </div>
  );
}
