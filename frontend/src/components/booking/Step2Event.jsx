import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { MapPin, Building2, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

const Step2Event = () => {
  const { eventDetails, setEventDetails, setStep } = useBooking();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!eventDetails.venue.trim()) errs.venue = 'Venue name/address is required';
    if (!eventDetails.city.trim()) errs.city = 'City is required';
    if (!eventDetails.eventDate) errs.eventDate = 'Event Date is required';
    if (!eventDetails.eventTime) errs.eventTime = 'Event Time is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep(3);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 shadow-2xl max-w-2xl mx-auto">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
          Step 2 of 4
        </span>
        <h2 className="text-2xl font-black text-slate-100 mt-1">Event & Venue Details</h2>
        <p className="text-xs text-slate-400 mt-1">
          Specify location and timing so our turban artists arrive on time.
        </p>
      </div>

      <form onSubmit={handleNext} className="space-y-6">
        {/* Venue */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Venue / Hotel Name *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="text"
              placeholder="e.g. Rambagh Palace / Grand Ballroom"
              value={eventDetails.venue}
              onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
              className={`w-full bg-slate-900 border ${
                errors.venue ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
            />
          </div>
          {errors.venue && <p className="text-xs text-red-400 mt-1.5">{errors.venue}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            City *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
            <input
              type="text"
              placeholder="e.g. Jaipur, Udaipur, Delhi, Mumbai"
              value={eventDetails.city}
              onChange={(e) => setEventDetails({ ...eventDetails, city: e.target.value })}
              className={`w-full bg-slate-900 border ${
                errors.city ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
            />
          </div>
          {errors.city && <p className="text-xs text-red-400 mt-1.5">{errors.city}</p>}
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Event Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={eventDetails.eventDate}
                onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
                className={`w-full bg-slate-900 border ${
                  errors.eventDate ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
              />
            </div>
            {errors.eventDate && <p className="text-xs text-red-400 mt-1.5">{errors.eventDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Event Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400/70" />
              <input
                type="time"
                value={eventDetails.eventTime}
                onChange={(e) => setEventDetails({ ...eventDetails, eventTime: e.target.value })}
                className={`w-full bg-slate-900 border ${
                  errors.eventTime ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-slate-100 rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all`}
              />
            </div>
            {errors.eventTime && <p className="text-xs text-red-400 mt-1.5">{errors.eventTime}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-3 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="gold-gradient-bg text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span>Select Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2Event;
