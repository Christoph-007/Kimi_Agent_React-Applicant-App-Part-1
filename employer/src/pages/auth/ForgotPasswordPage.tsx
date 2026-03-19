import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserType } from '@/types';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [selectedType, setSelectedType] = useState<Exclude<UserType, 'admin'>>('applicant');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await forgotPassword(email, selectedType);
            setIsSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-md text-center">
                <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-forest-700" />
                </div>
                <h1 className="text-3xl font-bold text-forest-900 mb-4">Check Your Email</h1>
                <p className="text-gray-500 mb-8">
                    We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                    Please check your inbox (and SMS if applicable).
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full py-3 border-2 border-forest-900 text-forest-900 rounded-full font-semibold hover:bg-forest-50 transition-colors mb-4"
                >
                    Resend Link
                </button>
                <NavLink
                    to="/login"
                    className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </NavLink>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-forest-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-500">Enter your email and we'll send you a link to reset your password</p>
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
                    <span className="font-medium">Employer</span>
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent pl-12"
                            required
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending Link...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>

            <p className="mt-8 text-center">
                <NavLink
                    to="/login"
                    className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </NavLink>
            </p>
        </div>
    );
}
