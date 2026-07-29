import React, { useState, useEffect } from 'react';
import { fetchAllBookings, fetchServices } from '@backend/services/bookingService';
import { TrendingUp, DollarSign, Calendar, Sparkles, Filter, Award, PieChart, BarChart2 } from 'lucide-react';

const RevenueAnalytics = () => {
  const [dateRange, setDateRange] = useState('all'); // 'this_month' | '3_months' | 'all'
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [bkg, srv] = await Promise.all([
        fetchAllBookings(),
        fetchServices(true)
      ]);
      setBookings(bkg);
      setServices(srv);
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-amber-400">Loading Business Intelligence...</div>;
  }

  // Filter Bookings by Date Range
  const filteredBookings = bookings.filter(b => {
    if (dateRange === 'this_month') {
      const bDate = new Date(b.created_at || b.event_date);
      const now = new Date();
      return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalGrossRevenue = filteredBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
  const totalAdvanceCollected = filteredBookings.reduce((sum, b) => sum + Number(b.advance_amount || 0), 0);
  const totalOutstandingDue = filteredBookings.reduce((sum, b) => sum + Number(b.outstanding_amount || 0), 0);

  const collectionRate = totalGrossRevenue > 0 ? Math.round((totalAdvanceCollected / totalGrossRevenue) * 100) : 0;

  // Service Popularity Count Calculation
  const serviceCountMap = {};
  filteredBookings.forEach(b => {
    if (b.services) {
      b.services.forEach(s => {
        serviceCountMap[s.name] = (serviceCountMap[s.name] || 0) + s.quantity;
      });
    }
  });

  const servicePopularityList = Object.entries(serviceCountMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  return (
    <div className="space-y-10">
      
      {/* Page Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Micro Task 4.2 Analytics
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Revenue & Service Intelligence</h1>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setDateRange('this_month')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              dateRange === 'this_month' ? 'gold-gradient-bg text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              dateRange === 'all' ? 'gold-gradient-bg text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Total Revenue Value
          </span>
          <span className="text-3xl font-black gold-gradient-text block">
            ₹{totalGrossRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">Gross booking total</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
            Advance Cash Collected (20%)
          </span>
          <span className="text-3xl font-black text-emerald-400 block">
            ₹{totalAdvanceCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">Immediate deposits</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
            Payment Collection Rate
          </span>
          <span className="text-3xl font-black text-blue-400 block">
            {collectionRate}%
          </span>
          <span className="text-[10px] text-slate-400 block">Advance conversion ratio</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-2">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
            Outstanding Balance (80%)
          </span>
          <span className="text-3xl font-black text-rose-400 block">
            ₹{totalOutstandingDue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">Event date receivables</span>
        </div>

      </div>

      {/* Visual Progress Breakdown Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Service Popularity Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span>Service Popularity & Order Volume</span>
          </h3>

          <div className="space-y-4 pt-2">
            {servicePopularityList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No order data recorded yet.</p>
            ) : (
              servicePopularityList.map((item, idx) => {
                const maxQty = servicePopularityList[0].qty || 1;
                const pct = Math.round((item.qty / maxQty) * 100);

                return (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{item.name}</span>
                      <span className="text-amber-400">{item.qty} Sold</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="gold-gradient-bg h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Financial Flow Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>Financial Settlement Distribution</span>
          </h3>

          <div className="space-y-6 pt-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Advance Deposits (20%)</span>
                <span className="text-emerald-400 font-bold">₹{totalAdvanceCollected.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${totalGrossRevenue > 0 ? (totalAdvanceCollected / totalGrossRevenue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Remaining Event Receivables (80%)</span>
                <span className="text-rose-400 font-bold">₹{totalOutstandingDue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${totalGrossRevenue > 0 ? (totalOutstandingDue / totalGrossRevenue) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RevenueAnalytics;
