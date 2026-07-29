import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useSettings } from '../../context/SettingsContext';
import { Crown, Search, User, LogOut, ShoppingBag, LayoutDashboard, Menu, X, UserCheck } from 'lucide-react';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { selectedServices } = useBooking();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickTrackingId, setQuickTrackingId] = useState('');

  const cartItemCount = selectedServices.reduce((sum, item) => sum + item.quantity, 0);

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
      <header className="sticky top-0 z-40 glass-panel border-b border-amber-500/20 shadow-2xl bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.business_name} className="w-11 h-11 object-contain rounded-xl" />
              ) : (
                <div className="w-11 h-11 rounded-xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Crown className="w-6 h-6 text-slate-950" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold tracking-wider gold-gradient-text block uppercase">
                  {settings.business_name || 'MEET TURBAN'}
                </span>
                <span className="text-[10px] text-amber-300/70 tracking-widest block uppercase font-medium">
                  Royal Wedding Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                        : 'text-slate-300 hover:text-amber-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {(user?.role === 'manager' || user?.role === 'admin') && (
                <Link
                  to="/manager"
                  className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-all flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Manager Portal</span>
                </Link>
              )}

              {user?.role === 'staff' && (
                <Link
                  to="/staff"
                  className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center space-x-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Staff Portal</span>
                </Link>
              )}
            </nav>

            {/* Header Quick Actions, Notifications, Cart & Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* Quick Track Input */}
              <form onSubmit={handleQuickTrack} className="relative">
                <input
                  type="text"
                  placeholder="Tracking ID (SAFA-...)"
                  value={quickTrackingId}
                  onChange={(e) => setQuickTrackingId(e.target.value)}
                  className="w-44 bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-full py-2 pl-3 pr-8 focus:outline-none focus:border-amber-500/50 transition-all"
                />
                <button
                  type="submit"
                  aria-label="Search Tracking ID"
                  className="absolute right-2 top-2 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* CART FLOATING ICON */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative bg-slate-900/90 border border-amber-500/30 text-amber-400 p-2.5 rounded-full hover:bg-amber-500/20 transition-all hover:scale-105 shadow-lg shadow-amber-500/10"
                title="View Booking Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 gold-gradient-bg text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-full hover:bg-amber-500/20 transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-300 hover:text-amber-300 px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold text-slate-950 gold-gradient-bg px-4 py-2 rounded-full shadow-md shadow-amber-500/20 hover:scale-105 transition-transform"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu & Cart Buttons */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative bg-slate-900 text-amber-400 p-2 rounded-xl border border-slate-800"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 gold-gradient-bg text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

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
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-slate-200 border border-slate-800 py-2 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-bold text-slate-950 gold-gradient-bg py-2 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Popup */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
