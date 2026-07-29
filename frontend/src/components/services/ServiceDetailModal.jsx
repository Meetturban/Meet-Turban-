import React from 'react';
import { X, Check, Plus, Minus, Sparkles, Shield, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const ServiceDetailModal = ({ service, onClose }) => {
  const { selectedServices, addService, updateServiceQuantity, removeService } = useBooking();

  if (!service) return null;

  const selectedItem = selectedServices.find(s => s.id === service.id);
  const qty = selectedItem ? selectedItem.quantity : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-950/80 text-slate-400 hover:text-amber-400 p-2 rounded-full border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="md:w-1/2 relative h-64 md:h-auto bg-slate-950">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
        </div>

        {/* Modal Content */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-3">
              {service.category}
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">{service.name}</h2>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {service.description}
            </p>

            <div className="mt-6 space-y-2 border-t border-b border-slate-800/80 py-4 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>On-site Professional Artist Setup Included</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Custom Timing & Venue Fitting Guarantee</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
              <span className="text-2xl font-black gold-gradient-text">
                ₹{Number(service.price).toLocaleString('en-IN')}
              </span>
            </div>

            {qty > 0 ? (
              <div className="flex items-center space-x-3 bg-slate-950 border border-amber-500/30 p-1.5 rounded-2xl">
                <button
                  onClick={() => updateServiceQuantity(service.id, qty - 1)}
                  className="bg-slate-800 text-slate-300 hover:text-amber-400 p-1.5 rounded-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-amber-300 px-2">{qty}</span>
                <button
                  onClick={() => updateServiceQuantity(service.id, qty + 1)}
                  className="bg-amber-500 text-slate-950 font-bold p-1.5 rounded-xl transition-transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addService(service)}
                className="gold-gradient-bg text-slate-950 text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Booking</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetailModal;
