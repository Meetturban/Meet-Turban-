import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { selectedServices, updateServiceQuantity, removeService, totalAmount, advanceRequired, outstandingAmount, setStep } = useBooking();

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItemCount = selectedServices.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    setStep(1);
    navigate('/book');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/85 backdrop-blur-md transition-all animate-entrance">
      
      {/* Backdrop Click Close Target */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
        aria-label="Close cart overlay" 
      />

      {/* Drawer Container Panel */}
      <div className="relative z-10 w-full sm:w-[440px] h-full bg-slate-900 border-l border-amber-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-slate-950 shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <span>Booking Bucket & Checkout</span>
              </h2>
              <span className="text-[11px] text-amber-400 font-semibold">
                {totalItemCount} {totalItemCount === 1 ? 'Service Selected' : 'Services Selected'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-amber-400 p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedServices.length === 0 ? (
            <div className="text-center py-14 space-y-4">
              <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Your Bucket is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Browse our royal catalog to add safa tying, groom turbans, or barat entry services to your checkout bucket.
              </p>
              <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/services');
                  }}
                  className="gold-gradient-bg text-slate-950 text-xs font-bold px-5 py-3 rounded-xl shadow hover:scale-105 transition-all"
                >
                  Explore Services Catalog
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-slate-950 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  Proceed to Event Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {selectedServices.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.name}</h4>
                    <span className="text-[11px] text-amber-400/90 font-semibold">
                      ₹{Number(item.price).toLocaleString('en-IN')} each
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
                    <button
                      onClick={() => updateServiceQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-amber-400"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-amber-300 px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateServiceQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-amber-400"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price & Delete */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-slate-100 block">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeService(item.id)}
                      className="text-slate-500 hover:text-red-400 mt-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Summary */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4 shrink-0">
          {selectedServices.length > 0 ? (
            <>
              <div className="space-y-2 text-xs bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal Amount</span>
                  <strong className="text-slate-100">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>20% Advance Deposit</span>
                  <strong>₹{advanceRequired.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                  <span>80% Outstanding on Event</span>
                  <strong>₹{outstandingAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full gold-gradient-bg text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleCheckout}
              className="w-full gold-gradient-bg text-slate-950 font-black text-xs py-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Event Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CartDrawer;
