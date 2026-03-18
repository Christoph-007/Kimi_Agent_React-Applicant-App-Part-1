import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Briefcase,
  Calendar,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const applicantNavItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/jobs', icon: Search, label: 'Browse Jobs' },
  { to: '/my-jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/shifts', icon: Calendar, label: 'My Shifts' },
  { to: '/attendance', icon: ClipboardList, label: 'Attendance' },
];

const bottomNavItems = [
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function MainLayout() {
  const { logout, unreadCount, user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5ED' }}>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-forest-900 z-50 shadow-md">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-forest-800 rounded-xl text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <NavLink to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#C8F435' }}>
                <span className="font-extrabold text-sm" style={{ color: '#0D2B1A' }}>S</span>
              </div>
              <span className="font-extrabold text-lg text-white hidden sm:block tracking-tight">ShiftMatch</span>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/notifications"
                  className="relative p-2 hover:bg-forest-800 rounded-xl transition-colors duration-200"
                >
                  <Bell className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow" style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-forest-800 rounded-full transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-forest-700 rounded-full flex items-center justify-center border-2 border-forest-600 group-hover:border-lime transition-colors duration-200">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors hidden sm:block">
                    {user?.name || user?.ownerName || user?.storeName || 'User'}
                  </span>
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <NavLink
                  to="/login"
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm px-2"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup/applicant"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 flex flex-col",
            "transition-transform duration-300 lg:translate-x-0",
            isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          )}
        >
          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
            {applicantNavItems
              .filter(item => isAuthenticated || item.to === '/jobs')
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive(item.to)
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  style={isActive(item.to) ? {} : { ':hover': { backgroundColor: '#F5F5ED' } } as any}
                  onMouseEnter={(e) => {
                    if (!isActive(item.to)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5ED';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.to)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    }
                  }}
                >
                  <item.icon className={cn(
                    "mr-3 flex-shrink-0",
                    isActive(item.to) ? 'text-lime' : 'text-gray-400'
                  )} style={{ width: '1.1rem', height: '1.1rem', color: isActive(item.to) ? '#C8F435' : undefined }} />
                  {item.label}
                  {isActive(item.to) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8F435' }} />
                  )}
                </NavLink>
              ))}
          </nav>

          {/* Divider */}
          {isAuthenticated && <div className="border-t border-gray-100 mx-4" />}

          {/* Bottom Navigation */}
          {isAuthenticated && (
            <nav className="px-3 py-4 space-y-0.5">
              {bottomNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive(item.to)
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  onMouseEnter={(e) => {
                    if (!isActive(item.to)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5ED';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.to)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '';
                    }
                  }}
                >
                  <item.icon className={cn(
                    "mr-3 flex-shrink-0",
                    isActive(item.to) ? 'text-lime' : 'text-gray-400'
                  )} style={{ width: '1.1rem', height: '1.1rem', color: isActive(item.to) ? '#C8F435' : undefined }} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}

              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut style={{ width: '1.1rem', height: '1.1rem' }} className="mr-3 flex-shrink-0" />
                Logout
              </button>
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
