import React, { useState, useEffect } from 'react';
import { getCustomersCRM } from '@backend/services/bookingService';
import { Search, User, Phone, ShoppingBag, DollarSign, X, Calendar, MessageCircle } from 'lucide-react';

const CustomerCRM = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadCRM = async () => {
      const data = await getCustomersCRM();
      setCustomers(data);
      setLoading(false);
    };
    loadCRM();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
          Micro Task 2.5 CRM
        </span>
        <h1 className="text-3xl font-black text-slate-100 mt-0.5">Customer Relationship Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Directory of all client accounts, total bookings placed, and cumulative revenue generated.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel p-4 rounded-3xl border border-amber-500/20 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      {loading ? (
        <div className="text-center py-12 text-amber-400">Loading Customer Directory...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center text-xs text-slate-400">
          No customer records match your search filter.
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Mobile Contact</th>
                <th className="p-3">Total Bookings</th>
                <th className="p-3">Cumulative Revenue</th>
                <th className="p-3 text-right">History Drawer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((cust) => (
                <tr key={cust.mobile} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-slate-100">{cust.name}</td>
                  <td className="p-3 font-medium text-slate-300">{cust.mobile}</td>
                  <td className="p-3">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {cust.bookingsCount} {cust.bookingsCount === 1 ? 'Booking' : 'Bookings'}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-amber-300">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer History Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-100">{selectedCustomer.name}</h3>
                <p className="text-xs text-amber-400 font-semibold">{selectedCustomer.mobile}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-amber-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Booking History ({selectedCustomer.bookings.length})
              </h4>

              {selectedCustomer.bookings.map((bkg) => (
                <div key={bkg.id || bkg.tracking_id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-400">{bkg.tracking_id}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {bkg.status}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Venue: <strong>{bkg.venue}, {bkg.city}</strong> Date: <strong>{bkg.event_date}</strong>
                  </p>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>Total Amount:</span>
                    <strong className="text-slate-100">₹{Number(bkg.total_amount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <a
                href={`https://wa.me/${selectedCustomer.mobile}?text=${encodeURIComponent(`Hello ${selectedCustomer.name}, this is Safa Elegance Manager.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center space-x-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerCRM;
