import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Mail, Lock, LogIn, AlertCircle, Shield, UserCheck, User } from 'lucide-react';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRoleParam = searchParams.get('role');
  const [activeTab, setActiveTab] = useState(
    initialRoleParam === 'manager' ? 'manager' : initialRoleParam === 'staff' ? 'staff' : 'customer'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'manager') setActiveTab('manager');
    else if (roleParam === 'staff') setActiveTab('staff');
    else if (roleParam === 'customer') setActiveTab('customer');
  }, [searchParams]);

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await loginUser({ email, password });
    setLoading(false);

    if (res.success && res.user) {
      const userRole = res.user.role;
      if (userRole === 'manager' || userRole === 'admin') {
        navigate('/manager');
      } else if (userRole === 'staff') {
        navigate('/staff');
      } else {
        navigate('/profile');
      }
    } else {
      setError(res.error || 'Login failed. Invalid credentials.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 w-full max-w-md space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            {activeTab === 'manager' ? (
              <Shield className="w-6 h-6 text-slate-950" />
            ) : activeTab === 'staff' ? (
              <UserCheck className="w-6 h-6 text-slate-950" />
            ) : (
              <Crown className="w-6 h-6 text-slate-950" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-100">
            {activeTab === 'manager'
              ? 'Manager Portal Sign In'
              : activeTab === 'staff'
              ? 'Staff Artist Portal Sign In'
              : 'Customer Account Login'}
          </h1>
          <p className="text-xs text-slate-400">
            {activeTab === 'manager'
              ? 'Secure authentication required for administrative access.'
              : activeTab === 'staff'
              ? 'Authenticate to view assigned wedding schedules & workflow.'
              : 'Sign in to access your bookings and personal profile.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('staff')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'staff'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('manager')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'manager'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="email"
                placeholder={
                  activeTab === 'manager'
                    ? 'manager@meetturban.com'
                    : activeTab === 'staff'
                    ? 'staff@meetturban.com'
                    : 'customer@example.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              {activeTab === 'customer' && (
                <Link to="/forgot-password" className="text-[11px] text-amber-400 hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'staff'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'gold-gradient-bg text-slate-950 shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : `Sign In as ${activeTab.toUpperCase()}`}</span>
          </button>
        </form>

        {activeTab === 'customer' && (
          <div className="text-center pt-2 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-amber-400 hover:underline">
              Register Here
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
