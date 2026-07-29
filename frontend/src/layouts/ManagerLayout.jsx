import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Crown, LayoutDashboard, CalendarCheck, Package, Users, DollarSign, ArrowLeft, LogOut, ShieldCheck, UserCheck, TrendingUp, FileText, Settings, User } from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

const ManagerLayout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview Dashboard', path: '/manager', icon: LayoutDashboard },
    { label: 'Booking Operations', path: '/manager/bookings', icon: CalendarCheck },
    { label: 'Services Catalog', path: '/manager/services', icon: Package },
    { label: 'Customer CRM', path: '/manager/customers', icon: Users },
    { label: 'Staff Management', path: '/manager/staff', icon: UserCheck },
    { label: 'Payment Ledger', path: '/manager/payments', icon: DollarSign },
    { label: 'Salary Management', path: '/manager/salary', icon: DollarSign },
    { label: 'Revenue Analytics', path: '/manager/analytics', icon: TrendingUp },
    { label: 'Reports & Exports', path: '/manager/reports', icon: FileText },
    { label: 'Website CMS Settings', path: '/manager/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-amber-500/20 p-6 flex flex-col justify-between shrink-0 relative z-10">
        
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center space-x-3">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.business_name} className="w-10 h-10 object-contain rounded-xl" />
            ) : (
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Crown className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-sm font-black gold-gradient-text uppercase tracking-wider block">
                {settings.business_name || 'MEET TURBAN'}
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 inline" />
                <span>Manager Operations</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/manager' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'gold-gradient-bg text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-amber-300 px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 text-xs font-bold text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Manager</span>
          </button>
        </div>

      </aside>

      {/* Main Operations Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Manager Header with High Stacking Context (z-[100]) */}
        <header className="sticky top-0 z-[100] bg-slate-950/95 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Manager Control Center
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* System Notifications with High Stacking Context */}
            <div className="relative z-[100]">
              <NotificationBell />
            </div>

            <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-amber-300 font-semibold">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{user?.name || 'Manager'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default ManagerLayout;
