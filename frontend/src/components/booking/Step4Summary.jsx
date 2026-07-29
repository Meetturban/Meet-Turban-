import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, MessageCircle, CreditCard, Sparkles, ShieldCheck, ArrowLeft, RotateCcw, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Step4Summary = () => {
  const {
    customerDetails,
    eventDetails,
    selectedServices,
    totalAmount,
    advanceRequired,
    outstandingAmount,
    submitBooking,
    submittedBooking,
    resetBooking,
    setStep
  } = useBooking();

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const managerPhone = import.meta.env.VITE_MANAGER_WHATSAPP || '919876543210';

  const handleConfirmBooking = async () => {
    setLoading(true);
    await submitBooking();
    setLoading(false);
  };

  // Generate WhatsApp Message URL
  const buildWhatsAppUrl = (paymentMode = 'advance') => {
    if (!submittedBooking) return '#';
    const paymentLabel = paymentMode === 'full' ? 'FULL PAYMENT (100%)' : 'ADVANCE PAYMENT (20%)';
    const payAmount = paymentMode === 'full' ? totalAmount : advanceRequired;

    const message = 
`👑 *NEW WEDDING BOOKING CONFIRMATION* 👑
----------------------------------------
*Tracking ID:* ${submittedBooking.tracking_id}

*CUSTOMER DETAILS:*
• Name: ${customerDetails.name}
• Mobile: ${customerDetails.mobile}
${customerDetails.altMobile ? `• Alt Mobile: ${customerDetails.altMobile}` : ''}

*EVENT DETAILS:*
• Venue: ${eventDetails.venue} (${eventDetails.city})
• Date: ${eventDetails.eventDate}
• Time: ${eventDetails.eventTime}

*SELECTED SERVICES:*
${selectedServices.map((s, idx) => `${idx + 1}. ${s.name} x ${s.quantity} (₹${(s.price * s.quantity).toLocaleString('en-IN')})`).join('\n')}

*FINANCIAL SUMMARY:*
• Total Amount: ₹${totalAmount.toLocaleString('en-IN')}
• *Selected Payment Option:* ${paymentLabel}
• *Amount Due Now:* ₹${payAmount.toLocaleString('en-IN')}
• Outstanding Balance: ₹${(totalAmount - payAmount).toLocaleString('en-IN')}

Please confirm booking & send payment link. Thank you!`;

    return `https://wa.me/${managerPhone}?text=${encodeURIComponent(message)}`;
  };

  const copyTrackingId = () => {
    if (submittedBooking?.tracking_id) {
      navigator.clipboard.writeText(submittedBooking.tracking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 text-center">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
          Step 4 of 4
        </span>
        <h2 className="text-2xl font-black text-slate-100 mt-1">Booking & Financial Summary</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review your selection and generate your royal booking tracking ID.
        </p>
      </div>

      {!submittedBooking ? (
        /* Confirmation Overview Before Submission */
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
          
          {/* Customer & Event Brief */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-amber-400 uppercase font-bold text-[10px] tracking-wider block mb-1">
                Customer Info
              </span>
              <p className="font-bold text-slate-100">{customerDetails.name}</p>
              <p className="text-slate-400">{customerDetails.mobile}</p>
            </div>
            <div>
              <span className="text-amber-400 uppercase font-bold text-[10px] tracking-wider block mb-1">
                Event Schedule
              </span>
              <p className="font-bold text-slate-100">{eventDetails.venue}, {eventDetails.city}</p>
              <p className="text-slate-400">{eventDetails.eventDate} at {eventDetails.eventTime}</p>
            </div>
          </div>

          {/* Selected Services breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Services Breakdown
            </span>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
              {selectedServices.map(item => (
                <div key={item.id} className="py-2 flex justify-between">
                  <span className="text-slate-300 font-medium">
                    {item.name} <span className="text-amber-400 font-bold">x{item.quantity}</span>
                  </span>
                  <span className="text-slate-100 font-bold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Total Amount
              </span>
              <span className="text-xl font-black text-slate-100 block mt-1">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                Advance Required (20%)
              </span>
              <span className="text-xl font-black gold-gradient-text block mt-1">
                ₹{advanceRequired.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Outstanding (80%)
              </span>
              <span className="text-xl font-black text-slate-300 block mt-1">
                ₹{outstandingAmount.toLocaleString('en-IN')}
              </span>
            </div>

          </div>

          {/* Confirm Action Button */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Services</span>
            </button>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="gold-gradient-bg text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
            >
              {loading ? (
                <span>Generating Tracking ID...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Booking & Tracking ID</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* Booking Successfully Submitted View */
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-6 animate-fade-in">
          
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Booking Registered Successfully!
            </span>
            <h3 className="text-2xl font-extrabold text-slate-100 mt-1">
              Your Royal Tracking ID
            </h3>

            {/* Tracking ID Badge */}
            <div className="inline-flex items-center space-x-3 bg-slate-950 border border-amber-500/40 px-6 py-3 rounded-2xl mt-4">
              <span className="text-2xl font-black tracking-widest text-amber-400">
                {submittedBooking.tracking_id}
              </span>
              <button
                onClick={copyTrackingId}
                className="text-slate-400 hover:text-amber-400 p-1.5 rounded-lg transition-colors"
                title="Copy Tracking ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-[10px] text-emerald-400 mt-1">Copied to clipboard!</p>}
          </div>

          {/* Payment Option Buttons & WhatsApp Integration */}
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-lg mx-auto">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Send Booking Details to Manager via WhatsApp
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No payment gateway required right now. Click below to prefill WhatsApp message for the manager to finalize your 20% advance or full payment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Option A: Pay Advance */}
              <a
                href={buildWhatsAppUrl('advance')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Pay Advance (₹{advanceRequired.toLocaleString('en-IN')})</span>
              </a>

              {/* Option B: Pay Full */}
              <a
                href={buildWhatsAppUrl('full')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold py-3 px-4 rounded-xl shadow flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Full (₹{totalAmount.toLocaleString('en-IN')})</span>
              </a>

            </div>
          </div>

          <div className="pt-4 flex items-center justify-center space-x-4">
            <Link
              to={`/track?id=${submittedBooking.tracking_id}`}
              className="text-xs font-bold text-amber-400 underline hover:text-amber-300"
            >
              Go to Live Tracking Page
            </Link>
            <button
              onClick={resetBooking}
              className="text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Book Another Event</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Step4Summary;
