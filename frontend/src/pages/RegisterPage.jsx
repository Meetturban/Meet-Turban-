import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, User, Mail, Phone, Lock, UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const res = await registerUser(formData);
    setLoading(false);

    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 w-full max-w-md space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100">Create Account</h1>
          <p className="text-xs text-slate-400">
            Register to manage bookings and receive instant WhatsApp tracking.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="text"
                placeholder="e.g. Maharaja Vikram Singh"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Mobile Number (WhatsApp) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-400 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
