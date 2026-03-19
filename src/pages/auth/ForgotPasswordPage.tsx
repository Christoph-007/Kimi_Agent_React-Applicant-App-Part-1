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
            <div className="w-full max-w-md text-center animate-fade-up">
                <div className="w-20 h-20 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle className="w-10 h-10 text-forest-900" />
                </div>
                <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-4">Check Your Email</h1>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    We've sent a password reset link to <br />
                    <span className="font-extrabold text-forest-900">{email}</span>.
                    Please check your inbox (and SMS if applicable).
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="w-full py-4 border-2 border-forest-900 text-forest-900 rounded-full font-bold hover:bg-forest-50 transition-all active:scale-95 shadow-sm"
                    >
                        Resend Link
                    </button>
                    <NavLink
                        to="/login"
                        className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-bold transition-colors py-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Sign In
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md animate-fade-up">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Mail className="w-8 h-8 text-forest-900" />
                </div>
                <h1 className="text-3xl font-extrabold text-forest-900 tracking-tightest mb-3">Forgot Password?</h1>
                <p className="text-gray-500 font-medium leading-relaxed">Enter your email and we'll send you a link to reset your password</p>
            </div>

            {/* User Type Selector */}
            <div className="flex gap-4 mb-10">
                <button
                    type="button"
                    onClick={() => setSelectedType('applicant')}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-300 ${selectedType === 'applicant'
                        ? 'border-forest-900 bg-forest-900 text-white shadow-lg scale-105'
                        : 'border-gray-100 hover:border-forest-200 text-gray-500 hover:bg-forest-50 bg-white'
                        }`}
                >
                    <span className="font-extrabold text-sm tracking-wide">Applicant</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedType('employer')}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-300 ${selectedType === 'employer'
                        ? 'border-forest-900 bg-forest-900 text-white shadow-lg scale-105'
                        : 'border-gray-100 hover:border-forest-200 text-gray-500 hover:bg-forest-50 bg-white'
                        }`}
                >
                    <span className="font-extrabold text-sm tracking-wide">Employer</span>
                </button>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-fade-in">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-forest-900 mb-3 ml-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-700 transition-colors w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="input-field pl-12"
                            required
                        />
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
                            Sending Link...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>

            <p className="mt-10 text-center">
                <NavLink
                    to="/login"
                    className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-bold transition-all hover:translate-x-[-4px]"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sign In
                </NavLink>
            </p>
        </div>
    );
}
