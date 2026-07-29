import React from 'react';
import { Plus, Check, Eye, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const ServiceCard = ({ service, onSelectDetail }) => {
  const { selectedServices, addService, removeService } = useBooking();

  const isSelected = selectedServices.some(s => s.id === service.id);
  const selectedItem = selectedServices.find(s => s.id === service.id);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Service Image */}
        <div className="relative h-52 overflow-hidden bg-slate-900">
          <img
            src={service.image_url || 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80'}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
            {service.category || 'Safa'}
          </span>

          {service.popular && (
            <span className="absolute top-3 right-3 gold-gradient-bg text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Popular</span>
            </span>
          )}

          {/* Quick View Trigger */}
          <button
            onClick={() => onSelectDetail(service)}
            className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 p-2 rounded-xl backdrop-blur-md transition-all shadow-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
            {service.name}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      {/* Pricing & Selection Footer */}
      <div className="p-5 pt-0 mt-auto border-t border-slate-800/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
          <span className="text-lg font-extrabold gold-gradient-text">
            ₹{Number(service.price).toLocaleString('en-IN')}
          </span>
        </div>

        {isSelected ? (
          <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Selected ({selectedItem?.quantity})</span>
          </div>
        ) : (
          <button
            onClick={() => addService(service)}
            className="gold-gradient-bg hover:scale-105 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
