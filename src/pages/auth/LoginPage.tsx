import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(identifier, password, undefined, from); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Lock className="w-8 h-8 text-forest-900" />
        </div>
        <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-3">Sign In</h1>
        <p className="text-gray-500 font-medium">Access your ShiftMatch account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-forest-900 mb-2 ml-1">
            Email or Phone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or phone number"
            className="input-field"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="block text-sm font-bold text-forest-900">
              Password
            </label>
            <NavLink
              to="/forgot-password"
              className="text-xs font-bold text-forest-700 hover:text-forest-900 hover:underline transition-colors"
            >
              Forgot Password?
            </NavLink>
          </div>
          <div className="relative group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              className="input-field pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-700 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-1 group cursor-pointer" onClick={() => {
          const cb = document.getElementById('remember') as HTMLInputElement;
          if (cb) cb.checked = !cb.checked;
        }}>
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-lg border-gray-300 text-forest-900 focus:ring-lime transition-all cursor-pointer accent-forest-900" 
              id="remember" 
            />
          </div>
          <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer group-hover:text-forest-900 transition-colors">
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-4 text-base shadow-btn active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Authenticating...
            </>
          ) : (
            'Sign In to Your Account'
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-10 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 font-medium mb-6">
          Don't have an account yet?
        </p>
        <NavLink
          to="/signup"
          className="inline-flex items-center justify-center w-full py-4 rounded-full font-bold transition-all duration-200 border-2 border-forest-900 text-forest-900 hover:bg-forest-50 active:scale-95"
        >
          Create New Account
        </NavLink>
      </div>
    </div>
  );
}
