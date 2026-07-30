import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { Crown, Search, User, LogOut, LayoutDashboard, Menu, X, UserCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickTrackingId, setQuickTrackingId] = useState('');

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackingId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackingId.trim())}`);
      setQuickTrackingId('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services Catalog', path: '/services' },
    { label: 'Book Event', path: '/book' },
    { label: 'Track Booking', path: '/track' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3 pb-2 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-amber-500/25 shadow-2xl shadow-amber-500/5 transition-all duration-300 ease-out hover:border-amber-500/40">

            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.business_name} className="w-9 h-9 object-contain rounded-xl" />
              ) : (
                <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Crown className="w-5 h-5 text-slate-950" />
                </div>
              )}
              <div>
                <span className="text-base font-black tracking-wider gold-gradient-text block uppercase leading-tight">
                  {settings.business_name || 'MEET TURBAN'}
                </span>
                <span className="text-[9px] text-amber-300/70 tracking-widest block uppercase font-semibold">
                  Royal Wedding Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Apple Dynamic Capsule Pills */}
            <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 ease-out active:scale-95 ${isActive
                        ? 'gold-gradient-bg text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {(user?.role === 'manager' || user?.role === 'admin') && (
                <Link
                  to="/manager"
                  className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full hover:bg-amber-500/20 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Manager</span>
                </Link>
              )}

              {user?.role === 'staff' && (
                <Link
                  to="/staff"
                  className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full hover:bg-emerald-500/20 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </Link>
              )}
            </nav>

            {/* Header Quick Actions & Auth */}
            <div className="hidden lg:flex items-center space-x-3">

              {/* Quick Track Input */}
              <form onSubmit={handleQuickTrack} className="relative">
                <input
                  type="text"
                  placeholder="Tracking ID (SAFA-...)"
                  value={quickTrackingId}
                  onChange={(e) => setQuickTrackingId(e.target.value)}
                  className="w-40 bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 rounded-full py-1.5 pl-3 pr-7 focus:outline-none focus:border-amber-500/60 transition-all duration-300"
                />
                <button
                  type="submit"
                  aria-label="Search Tracking ID"
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <Link
                    to={user.role === 'staff' ? '/staff' : '/manager'}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-all active:scale-95"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-slate-950 gold-gradient-bg px-4 py-1.5 rounded-full shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Portal Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-amber-400 p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-amber-500/20 px-4 pt-4 pb-6 space-y-4">
            <form onSubmit={handleQuickTrack} className="relative mb-4">
              <input
                type="text"
                placeholder="Track Booking (e.g. SAFA-2026-000001)"
                value={quickTrackingId}
                onChange={(e) => setQuickTrackingId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-amber-500"
              />
              <button type="submit" aria-label="Search Tracking ID" className="absolute right-3 top-3 text-amber-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-200 hover:text-amber-400 py-1"
              >
                {link.label}
              </Link>
            ))}

            {(user?.role === 'manager' || user?.role === 'admin') && (
              <Link
                to="/manager"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-amber-400 hover:text-amber-300 py-1"
              >
                Manager Operations Dashboard
              </Link>
            )}

            {user?.role === 'staff' && (
              <Link
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-emerald-400 hover:text-emerald-300 py-1"
              >
                Staff Artist Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-slate-800">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-amber-400 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile ({user.name})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-red-400 flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center text-sm font-bold text-slate-950 gold-gradient-bg py-2.5 rounded-xl shadow-md"
                  >
                    Portal Sign In (Manager / Staff)
                  </Link>
                </div>
              )}

            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
