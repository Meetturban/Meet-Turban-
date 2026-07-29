import React, { useState, useEffect } from 'react';
import { getDashboardMetrics, updateBookingStatus } from '@backend/services/bookingService';
import { Calendar, Clock, CreditCard, DollarSign, TrendingUp, AlertCircle, Eye, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const data = await getDashboardMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickStatusChange = async (id, status) => {
    setMetrics(prev => {
      if (!prev) return prev;
      const updatedRecent = prev.recentBookings.map(bkg => {
        if (bkg.id === id || bkg.tracking_id === id) {
          return { ...bkg, status };
        }
        return bkg;
      });
      return { ...prev, recentBookings: updatedRecent };
    });

    updateBookingStatus(id, status).catch(e => console.warn(e));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-amber-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 mx-auto"></div>
        <p className="text-xs mt-3">Loading Operations Metrics...</p>
      </div>
    );
  }

  const widgets = [
    {
      title: 'Total Bookings',
      value: metrics.totalBookings,
      subtitle: 'All-time reservations',
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: "Today's Events",
      value: metrics.todayEvents,
      subtitle: 'Scheduled for today',
      icon: Clock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Upcoming Events',
      value: metrics.upcomingEvents,
      subtitle: 'Future reservations',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      title: 'Pending Payments',
      value: `₹${metrics.pendingPayments.toLocaleString('en-IN')}`,
      subtitle: 'Outstanding balance',
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30'
    },
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
      subtitle: 'Projected total value',
      icon: DollarSign,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20 border-amber-500/40'
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Executive Control
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Manager Operations Overview</h1>
        </div>

        <Link
          to="/manager/bookings"
          className="gold-gradient-bg text-slate-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center space-x-2 self-start"
        >
          <span>Manage All Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Micro Task 2.2 Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {widgets.map((w) => {
          const Icon = w.icon;
          return (
            <div key={w.title} className={`glass-panel p-5 rounded-2xl border ${w.bg} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {w.title}
                </span>
                <Icon className={`w-5 h-5 ${w.color}`} />
              </div>
              <div>
                <span className={`text-2xl font-black ${w.color} block`}>
                  {w.value}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{w.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Activity Table */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-100">Recent Booking Requests</h2>
          <Link to="/manager/bookings" className="text-xs font-bold text-amber-400 hover:underline">
            View All Hub
          </Link>
        </div>

        {metrics.recentBookings.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent bookings registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Venue & City</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Advance Paid</th>
                  <th className="p-3">Remaining Due</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.recentBookings.map((bkg) => {
                  const advance = Number(bkg.advance_amount || 0);
                  const total = Number(bkg.total_amount || 0);
                  const due = bkg.outstanding_amount !== undefined ? Number(bkg.outstanding_amount) : (total - advance);

                  return (
                    <tr key={bkg.id || bkg.tracking_id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-amber-400">{bkg.tracking_id}</td>
                      <td className="p-3 font-semibold text-slate-100">{bkg.customer_name}</td>
                      <td className="p-3">{bkg.venue}, {bkg.city}</td>
                      <td className="p-3">{bkg.event_date}</td>
                      <td className="p-3 font-bold text-slate-100">₹{total.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-semibold text-emerald-400">₹{advance.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-black">
                        {due > 0 ? (
                          <span className="text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] uppercase inline-block">
                            ₹{due.toLocaleString('en-IN')} Due
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] uppercase inline-block">
                            Fully Paid
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                          {bkg.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={bkg.status}
                          onChange={(e) => handleQuickStatusChange(bkg.id || bkg.tracking_id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-lg p-1 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Awaiting Advance">Awaiting Advance</option>
                          <option value="Advance Received">Advance Received</option>
                          <option value="Staff Assigned">Staff Assigned</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ManagerDashboard;
