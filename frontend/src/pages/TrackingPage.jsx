import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooking } from '@backend/services/bookingService';
import { Search, Calendar, Phone, MapPin, Clock, CreditCard, MessageCircle, AlertCircle, CheckCircle2, ShieldCheck, Sparkles, UserCheck, PhoneCall, Check } from 'lucide-react';

const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialMobile = searchParams.get('mobile') || '';
  const initialDate = searchParams.get('date') || '';

  const [searchMode, setSearchMode] = useState(initialMobile ? 'mobile' : 'id');
  const [trackingIdInput, setTrackingIdInput] = useState(initialId);
  const [mobileInput, setMobileInput] = useState(initialMobile);
  const [eventDateInput, setEventDateInput] = useState(initialDate);

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const managerPhone = import.meta.env.VITE_MANAGER_WHATSAPP || '919876543210';

  const executeSearch = async (id, mob, dt) => {
    setLoading(true);
    setSearched(true);
    const data = await searchBooking({
      trackingId: id,
      mobile: mob,
      eventDate: dt
    });
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (initialId || (initialMobile && initialDate)) {
      executeSearch(initialId, initialMobile, initialDate);
    }
  }, [initialId, initialMobile, initialDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchMode === 'id' && trackingIdInput.trim()) {
      setSearchParams({ id: trackingIdInput.trim() });
      executeSearch(trackingIdInput, '', '');
    } else if (searchMode === 'mobile' && mobileInput.trim() && eventDateInput) {
      setSearchParams({ mobile: mobileInput.trim(), date: eventDateInput });
      executeSearch('', mobileInput, eventDateInput);
    }
  };

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'advance received':
      case 'staff assigned': return 2;
      case 'in_progress':
      case 'in progress': return 3;
      case 'completed': return 4;
      case 'cancelled': return 0;
      case 'pending':
      case 'awaiting advance':
      default: return 1;
    }
  };

  const buildWhatsAppPaymentUrl = (bkg, paymentMode = 'advance') => {
    let payAmount = bkg.advance_amount;
    let paymentLabel = 'ADVANCE DEPOSIT (20%)';
    let remaining = bkg.outstanding_amount;

    if (paymentMode === 'outstanding') {
      payAmount = bkg.outstanding_amount;
      paymentLabel = 'REMAINING OUTSTANDING BALANCE (80%)';
      remaining = 0;
    } else if (paymentMode === 'full') {
      payAmount = bkg.total_amount;
      paymentLabel = 'FULL PAYMENT (100%)';
      remaining = 0;
    }

    const text = `👑 *PAYMENT INITIATION - ${bkg.tracking_id}* 👑
----------------------------------------
• *Customer:* ${bkg.customer_name} (${bkg.customer_mobile})
• *Venue:* ${bkg.venue}, ${bkg.city}
• *Event Date:* ${bkg.event_date}

*PAYMENT OPTION:* ${paymentLabel}
• *Amount Due Now:* ₹${Number(payAmount).toLocaleString('en-IN')}
• *Remaining Balance:* ₹${Number(remaining).toLocaleString('en-IN')}

Hello Manager, I want to pay ₹${Number(payAmount).toLocaleString('en-IN')} for my booking ${bkg.tracking_id}. Please share payment details (UPI/Bank).`;

    return `https://wa.me/${managerPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Search Header */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 text-center max-w-3xl mx-auto space-y-6">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-2">
            Real-time Status Portal
          </span>
          <h1 className="text-3xl font-black text-slate-100">Track Your Royal Booking</h1>
          <p className="text-xs text-slate-400 mt-1">
            Lookup your booking progress using your Tracking ID or registered Mobile & Event Date.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex justify-center space-x-3 text-xs uppercase font-extrabold">
          <button
            onClick={() => setSearchMode('id')}
            className={`px-5 py-2.5 rounded-full transition-all ${
              searchMode === 'id'
                ? 'gold-gradient-bg text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Option A: Tracking ID
          </button>
          <button
            onClick={() => setSearchMode('mobile')}
            className={`px-5 py-2.5 rounded-full transition-all ${
              searchMode === 'mobile'
                ? 'gold-gradient-bg text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Option B: Mobile + Event Date
          </button>
        </div>

        {/* Search Forms */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
          {searchMode === 'id' ? (
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-amber-400" />
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. SAFA-2026-000001)"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-slate-100 rounded-2xl py-3.5 pl-11 pr-28 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 gold-gradient-bg text-slate-950 text-xs font-bold px-4 py-2 rounded-xl hover:scale-105 transition-transform"
              >
                Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-400" />
                <input
                  type="tel"
                  placeholder="Registered Mobile"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={eventDateInput}
                  onChange={(e) => setEventDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-3 px-3 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="gold-gradient-bg text-slate-950 font-bold px-4 rounded-xl hover:scale-105 transition-transform text-xs shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 mx-auto"></div>
          <p className="text-xs text-amber-400 mt-3">Searching bookings...</p>
        </div>
      ) : searched && results.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl border border-red-500/30 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">No Booking Found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find any booking matching your input. Please verify your Tracking ID or Mobile & Event Date.
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-8">
          {results.map((bkg) => {
            const stepNum = getStatusStep(bkg.status);
            const statuses = ['Pending', 'Confirmed', 'In Progress', 'Completed'];
            
            const stLower = (bkg.status || '').toLowerCase();
            const isPendingAdvance = stLower === 'pending' || stLower === 'awaiting advance' || stLower === 'awaiting_advance';
            const isCompleted = stLower === 'completed';
            const isAdvanceConfirmed = !isPendingAdvance && !isCompleted && stLower !== 'cancelled';

            const assignedStaff = bkg.assignedStaffInfo;

            return (
              <div key={bkg.id || bkg.tracking_id} className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-8">
                
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Tracking Reference
                    </span>
                    <h2 className="text-2xl font-black text-amber-400 tracking-wider mt-0.5">
                      {bkg.tracking_id}
                    </h2>
                  </div>

                  <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs flex items-center space-x-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                      <span className="font-extrabold text-amber-300 uppercase tracking-wider">
                        {bkg.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Progress Stepper */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {statuses.map((stName, idx) => {
                      const isDone = stepNum >= idx + 1;
                      const isCurrent = stepNum === idx + 1;

                      return (
                        <div key={stName} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${
                              isCurrent ? 'text-amber-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {stName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ASSIGNED ARTIST CARD */}
                {assignedStaff && (
                  <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-slate-950/90 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center space-x-2">
                        <UserCheck className="w-4 h-4" />
                        <span>Assigned Master Safa Artist</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {assignedStaff.experience || '8+ Years Exp'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={assignedStaff.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                          alt={assignedStaff.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                        />
                        <div>
                          <h4 className="text-base font-black text-slate-100">{assignedStaff.name}</h4>
                          <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-amber-400 inline" />
                            <span>{assignedStaff.mobile}</span>
                          </p>
                        </div>
                      </div>

                      {/* Direct Call & WhatsApp Buttons */}
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <a
                          href={`tel:${assignedStaff.mobile}`}
                          className="flex-1 sm:flex-initial bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-200 hover:text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all"
                        >
                          <PhoneCall className="w-4 h-4 text-amber-400" />
                          <span>Call Artist</span>
                        </a>

                        <a
                          href={`https://wa.me/${assignedStaff.mobile}?text=${encodeURIComponent(`Hello ${assignedStaff.name}, I am contacting you regarding my Safa Elegance booking ${bkg.tracking_id}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>WhatsApp Artist</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Customer & Venue Card */}
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <h3 className="font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                      Event Schedule & Venue
                    </h3>
                    <div className="space-y-1.5 text-slate-300">
                      <p><strong className="text-slate-100">Customer:</strong> {bkg.customer_name}</p>
                      <p><strong className="text-slate-100">Mobile:</strong> {bkg.customer_mobile}</p>
                      <p><strong className="text-slate-100">Venue:</strong> {bkg.venue}, {bkg.city}</p>
                      <p><strong className="text-slate-100">Event Date:</strong> {bkg.event_date}</p>
                      <p><strong className="text-slate-100">Time:</strong> {bkg.event_time}</p>
                    </div>
                  </div>

                  {/* Payment Breakdown Card */}
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
                        <span>Financial Summary</span>
                        {isAdvanceConfirmed && (
                          <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>20% Advance Received</span>
                          </span>
                        )}
                      </h3>
                      <div className="space-y-2 mt-3">
                        <div className="flex justify-between text-slate-300">
                          <span>Total Booking Amount:</span>
                          <strong className="text-slate-100">₹{Number(bkg.total_amount).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between text-emerald-400">
                          <span>Advance Required (20%):</span>
                          <strong>₹{Number(bkg.advance_amount).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                          <span>Outstanding Balance (80%):</span>
                          <strong className="text-slate-200">₹{Number(bkg.outstanding_amount).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    {isPendingAdvance && (
                      <div className="mt-3 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>Advance deposit of 20% (₹{Number(bkg.advance_amount).toLocaleString('en-IN')}) is pending confirmation.</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Services List */}
                {bkg.services && bkg.services.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Selected Services Package
                    </h3>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                      {bkg.services.map((s, idx) => (
                        <div key={idx} className="py-2 flex justify-between">
                          <span className="text-slate-200">
                            {s.name} <strong className="text-amber-400">x{s.quantity}</strong>
                          </span>
                          <span className="font-bold text-slate-100">
                            ₹{(s.price * s.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DYNAMIC PAYMENT OPTIONS BASED ON STATUS */}
                <div className="bg-slate-950/90 p-6 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <CreditCard className="w-4 h-4" />
                        <span>Payment Options & Manager Settlement</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isPendingAdvance && "Booking is pending. Pay the 20% advance to confirm your reservation with the manager."}
                        {isAdvanceConfirmed && "20% Advance has been confirmed by manager! You can now pay the remaining 80% outstanding balance."}
                        {isCompleted && "Event completed & fully paid! Thank you for choosing Safa Elegance."}
                      </p>
                    </div>
                  </div>

                  {isPendingAdvance && (
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Status Pending — Select Payment Option (2 Options Available):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Pay 20% Advance */}
                        <a
                          href={buildWhatsAppPaymentUrl(bkg, 'advance')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Option 1: Pay 20% Advance (₹{Number(bkg.advance_amount).toLocaleString('en-IN')})</span>
                        </a>

                        {/* Option 2: Pay Full Amount */}
                        <a
                          href={buildWhatsAppPaymentUrl(bkg, 'full')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gold-gradient-bg text-slate-950 font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                          <span>Option 2: Pay Full Amount (₹{Number(bkg.total_amount).toLocaleString('en-IN')})</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {isAdvanceConfirmed && (
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Advance Received — Single Settlement Option Remaining:</span>
                      </div>
                      {/* Single 1 Option: Pay Remaining 80% Outstanding Balance */}
                      <a
                        href={buildWhatsAppPaymentUrl(bkg, 'outstanding')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full gold-gradient-bg text-slate-950 font-black text-sm py-4 px-6 rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Pay Outstanding Balance 80% (₹{Number(bkg.outstanding_amount).toLocaleString('en-IN')})</span>
                      </a>
                    </div>
                  )}


                  {isCompleted && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Full Payment Settled (100%)</span>
                      </span>
                      <p className="text-[11px] text-slate-400">Zero outstanding balance remaining. Event successfully completed!</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : null}

    </div>
  );
};

export default TrackingPage;
