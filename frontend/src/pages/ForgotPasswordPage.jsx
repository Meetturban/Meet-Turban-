import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 w-full max-w-md space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-100">Forgot Password</h1>
          <p className="text-xs text-slate-400">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full gold-gradient-bg text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Reset Instructions</span>
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-100">Reset Email Sent</h3>
            <p className="text-xs text-slate-400">
              We have dispatched a password recovery link to <strong className="text-amber-400">{email}</strong>.
            </p>
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-slate-200 inline-flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
