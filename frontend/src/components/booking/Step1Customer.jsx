import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { User, Phone, PhoneCall, ArrowRight, Mail } from 'lucide-react';


const Step1Customer = () => {
  const { customerDetails, setCustomerDetails, setStep } = useBooking();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!customerDetails.name.trim()) errs.name = 'Full Name is required';
    if (!customerDetails.mobile.trim()) {
      errs.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(customerDetails.mobile.trim())) {
      errs.mobile = 'Valid 10-digit mobile number required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep(2);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 shadow-2xl max-w-2xl mx-auto">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
          Step 1 of 4
        </span>
        <h2 className="text-2xl font-black text-slate-100 mt-1">Customer Details</h2>
        <p className="text-xs text-slate-400 mt-1">
          Please enter your primary contact details for booking confirmation.
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="text"
              placeholder="e.g. Maharaja Vikram Singh"
              value={customerDetails.name}
              onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
              className={`w-full bg-slate-900 border ${
                errors.name ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Mobile Number (WhatsApp) *
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={customerDetails.mobile}
              onChange={(e) => setCustomerDetails({ ...customerDetails, mobile: e.target.value })}
              className={`w-full bg-slate-900 border ${
                errors.mobile ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
            />
          </div>
          {errors.mobile && <p className="text-xs text-red-400 mt-1.5">{errors.mobile}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="email"
              placeholder="e.g. customer@example.com"
              value={customerDetails.email || ''}
              onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Alternate Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Alternate Mobile (Optional)
          </label>
          <div className="relative">
            <PhoneCall className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="tel"
              placeholder="Backup contact number"
              value={customerDetails.altMobile}
              onChange={(e) => setCustomerDetails({ ...customerDetails, altMobile: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all"
            />
          </div>
        </div>


        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="gold-gradient-bg text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Proceed to Event Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Customer;
