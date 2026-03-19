import { Outlet, NavLink } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5ED' }}>
      {/* Header - Dark green like landing page */}
      <header className="h-16 sticky top-0 z-50" style={{ backgroundColor: '#0D2B1A' }}>
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#C8F435' }}>
              <span className="font-extrabold text-sm" style={{ color: '#0D2B1A' }}>S</span>
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">ShiftMatch</span>
          </NavLink>
          <NavLink
            to="/"
            className="text-sm text-gray-300 hover:text-white transition-colors duration-200 font-medium"
          >
            ← Back to Home
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} ShiftMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
