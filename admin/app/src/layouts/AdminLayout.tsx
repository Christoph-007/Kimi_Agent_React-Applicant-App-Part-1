import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employers', icon: Building2, label: 'Employers' },
  { to: '/admin/applicants', icon: Users, label: 'Applicants' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomNavItems = [
  { to: '/admin/notifications', icon: Bell, label: 'Notifications', badge: true },
  { to: '/admin/profile', icon: User, label: 'Profile' },
];

export function AdminLayout() {
  const { logout, unreadCount, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5ED' }}>
      {/* Header — dark forest green from screenshots */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 shadow-lg" style={{ backgroundColor: '#0D2B1A' }}>
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors duration-200 text-white"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a3d28')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <NavLink to="/admin/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200" style={{ backgroundColor: '#C8F435' }}>
                <span className="font-extrabold text-sm" style={{ color: '#0D2B1A' }}>S</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">ShiftMatch</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full" style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}>Admin</span>
              </div>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <NavLink 
              to="/admin/notifications" 
              className="relative p-2 rounded-xl transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a3d28')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow" style={{ backgroundColor: '#C8F435', color: '#0D2B1A' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
            <NavLink 
              to="/admin/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-200 group"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a3d28')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: '#1a3d28', borderColor: '#2a5c3a' }}>
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-300 hidden sm:block group-hover:text-white transition-colors">
                {user?.name || 'Admin'}
              </span>
            </NavLink>
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
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive(item.to)
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                style={isActive(item.to) ? { backgroundColor: '#0D2B1A' } : {}}
                onMouseEnter={e => { if (!isActive(item.to)) (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5ED'; }}
                onMouseLeave={e => { if (!isActive(item.to)) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
              >
                <item.icon 
                  className={cn("mr-3 flex-shrink-0", isActive(item.to) ? '' : 'text-gray-400')} 
                  style={{ width: '1.1rem', height: '1.1rem', color: isActive(item.to) ? '#C8F435' : undefined }} 
                />
                {item.label}
                {isActive(item.to) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8F435' }} />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Bottom Navigation */}
          <nav className="px-3 py-4 space-y-0.5">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive(item.to)
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                style={isActive(item.to) ? { backgroundColor: '#0D2B1A' } : {}}
                onMouseEnter={e => { if (!isActive(item.to)) (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F5ED'; }}
                onMouseLeave={e => { if (!isActive(item.to)) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
              >
                <item.icon 
                  className={cn("mr-3 flex-shrink-0", isActive(item.to) ? '' : 'text-gray-400')} 
                  style={{ width: '1.1rem', height: '1.1rem', color: isActive(item.to) ? '#C8F435' : undefined }} 
                />
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
