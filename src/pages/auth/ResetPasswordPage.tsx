import { useState } from 'react';
import { NavLink, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserType } from '@/types';

export function ResetPasswordPage() {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userType = searchParams.get('type') as UserType || 'applicant';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            if (!token) throw new Error('Invalid token');
            await resetPassword(token, password, userType);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password. Link may be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md text-center animate-fade-up">
                <div className="w-20 h-20 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle className="w-10 h-10 text-forest-900" />
                </div>
                <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-4">Password Reset Successful</h1>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Your password has been successfully updated. Redirecting to sign in page...
                </p>
                <NavLink
                    to="/login"
                    className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base shadow-btn"
                >
                    Click here if you're not redirected
                </NavLink>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Lock className="w-8 h-8 text-forest-900" />
                </div>
                <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-3">Reset Password</h1>
                <p className="text-gray-500 font-medium leading-relaxed">Create a new password for your account</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-forest-900 mb-3 ml-1">
                            New Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-700 transition-colors w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                className="input-field pl-12 pr-12"
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

                    <div>
                        <label className="block text-sm font-bold text-forest-900 mb-3 ml-1">
                            Confirm New Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-700 transition-colors w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="input-field pl-12"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 text-base shadow-btn active:scale-95 group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Resetging Password...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </form>
        </div>
    );
}
