import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  ClipboardList,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const employerNavItems = [
  { to: '/employer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employer/jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/employer/applicants', icon: Users, label: 'Browse Applicants' },
  { to: '/employer/shifts', icon: Calendar, label: 'Shifts' },
  { to: '/employer/attendance', icon: ClipboardList, label: 'Attendance' },
];

const bottomNavItems = [
  { to: '/employer/requests', icon: Mail, label: 'Job Requests' },
  { to: '/employer/shortlist', icon: Star, label: 'Shortlist' },
  { to: '/employer/settings', icon: Settings, label: 'Settings' },
];

export function EmployerLayout() {
  const { logout, unreadCount, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <NavLink to="/employer/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-forest-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg text-forest-900 hidden sm:block">
                {user?.storeName || 'ShiftMaster'}
              </span>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <NavLink 
              to="/notifications" 
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/employer/settings" 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-forest-700" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.ownerName || 'User'}
              </span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 flex flex-col",
            "transition-transform duration-300 lg:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {employerNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  isActive(item.to)
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3",
                  isActive(item.to) ? 'text-forest-600' : 'text-gray-400'
                )} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200 mx-4" />

          {/* Bottom Navigation */}
          <nav className="px-4 py-4 space-y-1">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  isActive(item.to)
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3",
                  isActive(item.to) ? 'text-forest-600' : 'text-gray-400'
                )} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
            
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
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
