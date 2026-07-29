import React from 'react';
import { useBooking } from '../context/BookingContext';
import Step1Customer from '../components/booking/Step1Customer';
import Step2Event from '../components/booking/Step2Event';
import Step3Services from '../components/booking/Step3Services';
import Step4Summary from '../components/booking/Step4Summary';
import { User, Calendar, ShoppingBag, CheckCircle2 } from 'lucide-react';

const BookingPage = () => {
  const { step, setStep } = useBooking();

  const stepsList = [
    { number: 1, title: 'Customer', icon: User },
    { number: 2, title: 'Event Details', icon: Calendar },
    { number: 3, title: 'Services', icon: ShoppingBag },
    { number: 4, title: 'Summary & Pay', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Wizard Progress Stepper Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 max-w-3xl mx-auto">
        <div className="grid grid-cols-4 gap-2 relative">
          
          {stepsList.map((st) => {
            const Icon = st.icon;
            const isCompleted = step > st.number;
            const isCurrent = step === st.number;

            return (
              <div
                key={st.number}
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() => {
                  if (isCompleted) setStep(st.number);
                }}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'gold-gradient-bg text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50 scale-110'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-2 uppercase tracking-wider hidden sm:block ${
                    isCurrent ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Wizard Step Render */}
      <div className="animate-fade-in">
        {step === 1 && <Step1Customer />}
        {step === 2 && <Step2Event />}
        {step === 3 && <Step3Services />}
        {step === 4 && <Step4Summary />}
      </div>

    </div>
  );
};

export default BookingPage;
