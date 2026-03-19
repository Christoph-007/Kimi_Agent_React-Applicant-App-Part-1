import { NavLink } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5ED] p-4">
      <div className="text-center max-w-md">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="text-9xl font-black text-forest-900/10 leading-none select-none">
            404
          </div>
          <div className="relative -mt-16">
            <div className="w-24 h-24 bg-forest-900 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
              <span className="text-4xl font-black text-[#C8F435]">?</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-forest-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-forest-900 text-forest-900 rounded-full font-semibold hover:bg-forest-900 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <NavLink
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-full font-semibold hover:bg-forest-800 transition-all duration-200 shadow-lg shadow-forest-900/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </NavLink>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          Need help?{' '}
          <NavLink to="/contact" className="text-forest-700 hover:text-forest-900 font-medium underline">
            Contact Support
          </NavLink>
        </p>
      </div>
    </div>
  );
}
