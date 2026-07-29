import React, { useState, useEffect } from 'react';
import { getPaymentLedger } from '@backend/services/bookingService';
import { DollarSign, CreditCard, ShieldCheck, CheckCircle2, TrendingUp, Search } from 'lucide-react';

const PaymentLedger = () => {
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadLedger = async () => {
      const data = await getPaymentLedger();
      setLedger(data);
      setLoading(false);
    };
    loadLedger();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-amber-400">Loading Payment Ledger...</div>;
  }

  const filteredRecords = ledger.ledgerRecords.filter(r => 
    r.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer_mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
          Micro Task 2.6 Ledger
        </span>
        <h1 className="text-3xl font-black text-slate-100 mt-0.5">Financial & Payment Ledger</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete accounting of advance payments (20%), outstanding balances (80%), and full settlements.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            Advance Payments Collected (20%)
          </span>
          <span className="text-3xl font-black text-emerald-400 block">
            ₹{ledger.totalAdvanceCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 block">Confirmed advance deposits</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
            Total Outstanding Balance (80%)
          </span>
          <span className="text-3xl font-black text-rose-400 block">
            ₹{ledger.totalOutstandingBalance.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 block">Due on event date</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 space-y-2">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
            Completed Settlements (100%)
          </span>
          <span className="text-3xl font-black gold-gradient-text block">
            ₹{ledger.totalFullPayments.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 block">Fully paid bookings</span>
        </div>

      </div>

      {/* Search Toolbar */}
      <div className="glass-panel p-4 rounded-3xl border border-amber-500/20 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Tracking ID, Customer Name, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Ledger Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center text-xs text-slate-400">
          No ledger records match your search filter.
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Booking</th>
                <th className="p-3">Advance (20%)</th>
                <th className="p-3">Remaining Balance</th>
                <th className="p-3">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((r) => (
                <tr key={r.id || r.tracking_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-amber-400">{r.tracking_id}</td>
                  <td className="p-3 font-semibold text-slate-100">
                    {r.customer_name} ({r.customer_mobile})
                  </td>
                  <td className="p-3 font-bold text-slate-100">₹{Number(r.total_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-emerald-400">₹{Number(r.advance_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-rose-400">₹{Number(r.outstanding_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="bg-slate-950 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default PaymentLedger;
