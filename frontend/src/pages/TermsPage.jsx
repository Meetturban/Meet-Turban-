import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowLeft, Crown, Clock, DollarSign } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      
      {/* Back Button & Header */}
      <div className="space-y-4 text-center sm:text-left">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center justify-center sm:justify-start space-x-3">
          <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950 shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100">
            Terms & Conditions
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Official service guidelines, reservation policies, payment terms, and cancellation rules for Meet Turban royal wedding services.
        </p>
      </div>

      {/* Terms Content Cards */}
      <div className="space-y-8">
        
        {/* Section 1: Reservation & Advance Payment */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all apple-card-hover">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">1. Booking Reservation & Advance Deposit</h2>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              • A <strong>20% Advance Deposit</strong> of the total booking estimate is required to confirm and lock artist team availability for your requested event date and location.
            </p>
            <p>
              • Bookings remain in <strong className="text-amber-400">"Pending"</strong> status until the advance payment is received and acknowledged by the Meet Turban manager desk.
            </p>
            <p>
              • The remaining <strong>80% Outstanding Balance</strong> is due on or before the event date upon completion of the requested safa tying or entry services.
            </p>
          </div>
        </div>

        {/* Section 2: Cancellation & Date Rescheduling */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all apple-card-hover">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">2. Cancellation & Rescheduling Policy</h2>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              • <strong>Free Date Rescheduling:</strong> Wedding date changes requested at least <strong>7 days prior</strong> to the original event date will be accommodated without extra charges, subject to artist schedule availability.
            </p>
            <p>
              • <strong>Cancellation:</strong> Cancellations made 7 days prior to the event are eligible for an advance deposit credit for future dates. Advance deposits for cancellations within 72 hours of the event are non-refundable due to inventory allocation and artist reservation commitments.
            </p>
          </div>
        </div>

        {/* Section 3: On-Site Service Protocol & Client Cooperation */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all apple-card-hover">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">3. On-Site Artist Protocol & Venue Access</h2>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              • Our safa artists will arrive at the designated venue or hotel room at the agreed scheduled time.
            </p>
            <p>
              • For bulk Barati safa tying (50 to 500+ guests), the client must provide an adequate, well-lit seating space at the venue for smooth artist operations.
            </p>
            <p>
              • Any delay exceeding 1 hour caused by venue access restrictions or unready guests may affect the overall baraat styling timeline.
            </p>
          </div>
        </div>

        {/* Section 4: Material Care & Royal Craftsmanship */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all apple-card-hover">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">4. Material Quality & Heritage Craftsmanship</h2>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              • All safa fabrics, royal silk turbans, kalgis, and accessories provided by Meet Turban are crafted using authentic Rajasthani heritage standards.
            </p>
            <p>
              • Royal kalgi and brooch accessories provided on rental basis must be returned to the head artist after the wedding ceremony concludes.
            </p>
          </div>
        </div>

      </div>

      {/* Footer Contact CTA */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Have Questions Regarding Terms?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Contact our customer desk directly on WhatsApp or Call for special event customizations and terms clarification.
        </p>
        <a
          href="https://wa.me/917011548343?text=Hello%20Meet%20Turban,%20I%20have%20a%20question%20regarding%20the%20Terms%20and%20Conditions."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 gold-gradient-bg text-slate-950 font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:scale-105 transition-all"
        >
          <span>Contact Manager Support</span>
        </a>
      </div>

    </div>
  );
};

export default TermsPage;
