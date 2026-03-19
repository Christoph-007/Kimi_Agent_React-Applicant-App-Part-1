import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function MainLayout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Public Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-forest-900 z-50 shadow-md">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#C8F435' }}>
              <span className="font-extrabold text-sm" style={{ color: '#0D2B1A' }}>S</span>
            </div>
            <span className="font-extrabold text-lg text-white hidden sm:block tracking-tight">ShiftMatch</span>
          </NavLink>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Home
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Browse Jobs
            </NavLink>
            <NavLink to="/candidates" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Candidates
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
              Contact
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <NavLink
                to={user?.type === 'employer' ? '/employer/dashboard' : user?.type === 'admin' ? '/admin/dashboard' : '/applicant/home'}
                className="px-5 py-2 rounded-full font-bold transition-all duration-200 text-sm shadow-sm active:scale-95 hover:brightness-105"
                style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}
              >
                Dashboard
              </NavLink>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <NavLink
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm px-2"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-5 py-2 rounded-full font-bold transition-all duration-200 text-sm shadow-sm active:scale-95 hover:brightness-105"
                  style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - no sidebar for public pages */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
