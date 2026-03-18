import { Outlet, NavLink } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0D2B1A' }}>
      {/* Header — dark forest green */}
      <header className="h-16 border-b" style={{ backgroundColor: '#0D2B1A', borderColor: '#1a3d28' }}>
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#C8F435' }}>
              <span className="font-extrabold text-sm" style={{ color: '#0D2B1A' }}>S</span>
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">ShiftMatch</span>
          </NavLink>
          <NavLink
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </NavLink>
        </div>
      </header>

      {/* Main Content — slightly lighter green bg for the form area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm" style={{ color: '#6b8f7a' }}>
        <p>© {new Date().getFullYear()} ShiftMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
