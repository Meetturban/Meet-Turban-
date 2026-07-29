import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { fetchServices } from '@backend/services/bookingService';
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';

const Step3Services = () => {
  const { selectedServices, addService, removeService, updateServiceQuantity, totalAmount, setStep } = useBooking();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCatalog = async () => {
      const data = await fetchServices();
      setCatalog(data);
      setLoading(false);
    };
    loadCatalog();
  }, []);

  const handleNext = () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service for your booking.');
      return;
    }
    setError('');
    setStep(4);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            Step 3 of 4
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-0.5">Select Royal Services</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose safas, turbans, barat entries, or musical troupes for your event.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950 px-5 py-3 rounded-2xl border border-amber-500/30">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Selected Items</span>
            <span className="text-sm font-bold text-slate-100">
              {selectedServices.reduce((a, b) => a + b.quantity, 0)} Items (₹{totalAmount.toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Selected Items Cart Box */}
      {selectedServices.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your Selected Booking Cart</span>
          </h3>

          <div className="divide-y divide-slate-800">
            {selectedServices.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                  <span className="text-xs text-amber-400/90 font-medium">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </span>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-1.5 rounded-xl">
                  <button
                    onClick={() => updateServiceQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:text-amber-400 text-slate-400"
                    title="Decrease Quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-100 px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateServiceQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:text-amber-400 text-slate-400"
                    title="Increase Quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right w-24">
                  <span className="text-sm font-bold text-slate-100">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeService(item.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Catalog Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
          Available Catalog
        </h3>

        {loading ? (
          <div className="text-center py-12 text-amber-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalog.map((service) => {
              const selected = selectedServices.find(s => s.id === service.id);
              const qty = selected ? selected.quantity : 0;

              return (
                <div
                  key={service.id}
                  className="glass-card p-5 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {service.category}
                      </span>
                      <span className="text-sm font-extrabold text-slate-100">
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{service.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{service.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    {qty > 0 ? (
                      <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
                        <button
                          onClick={() => updateServiceQuantity(service.id, qty - 1)}
                          className="text-slate-400 hover:text-amber-400 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-amber-300 px-2">{qty} in cart</span>
                        <button
                          onClick={() => updateServiceQuantity(service.id, qty + 1)}
                          className="text-slate-400 hover:text-amber-400 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addService(service)}
                        className="gold-gradient-bg text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow hover:scale-105 transition-all flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Service</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button
          onClick={() => setStep(2)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-3 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleNext}
          className="gold-gradient-bg text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <span>Proceed to Amount Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Step3Services;
