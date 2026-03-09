import { Outlet, NavLink } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="h-16 bg-white border-b border-gray-200">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-forest-900">ShiftMaster</span>
          </NavLink>
          <NavLink 
            to="/" 
            className="text-sm text-gray-600 hover:text-forest-700 transition-colors"
          >
            Back to Home
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ShiftMaster. All rights reserved.</p>
      </footer>
    </div>
  );
}
