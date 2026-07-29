import React, { useState, useEffect } from 'react';
import { fetchAllBookings, fetchStaffMembers } from '@backend/services/bookingService';
import { Download, Printer } from 'lucide-react';

const AdvancedReports = () => {
  const [activeReport, setActiveReport] = useState('bookings'); // 'bookings' | 'revenue' | 'staff'
  const [bookings, setBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [bkg, stf] = await Promise.all([
        fetchAllBookings(),
        fetchStaffMembers()
      ]);
      setBookings(bkg);
      setStaffList(stf);
      setLoading(false);
    };
    loadData();
  }, []);

  // Export CSV Helper Function
  const exportToCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `Safa_Elegance_${activeReport}_report.csv`;

    if (activeReport === 'bookings') {
      headers = ['Tracking ID', 'Customer Name', 'Mobile', 'Venue', 'City', 'Event Date', 'Status', 'Total Amount (INR)'];
      rows = bookings.map(b => [
        b.tracking_id,
        `"${b.customer_name}"`,
        b.customer_mobile,
        `"${b.venue}"`,
        b.city,
        b.event_date,
        b.status,
        b.total_amount
      ]);
    } else if (activeReport === 'revenue') {
      headers = ['Tracking ID', 'Customer', 'Total Amount', 'Advance 20%', 'Outstanding 80%', 'Status'];
      rows = bookings.map(b => [
        b.tracking_id,
        `"${b.customer_name}"`,
        b.total_amount,
        b.advance_amount,
        b.outstanding_amount,
        b.status
      ]);
    } else if (activeReport === 'staff') {
      headers = ['Staff Name', 'Mobile', 'Experience', 'Total Events', 'Completed Events', 'Active Events'];
      rows = staffList.map(s => [
        `"${s.name}"`,
        s.mobile,
        `"${s.experience}"`,
        s.totalEvents || 0,
        s.completedEvents || 0,
        s.activeEvents || 0
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="py-12 text-center text-amber-400">Preparing Report Datasets...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Micro Task 4.3 Exports
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Advanced Reports & Exports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal operational reports and export to CSV/Excel or Print PDF.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="gold-gradient-bg text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl hover:border-amber-500 transition-all flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="glass-panel p-3 rounded-2xl border border-amber-500/20 flex space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveReport('bookings')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeReport === 'bookings' ? 'gold-gradient-bg text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Booking Summary Report
        </button>
        <button
          onClick={() => setActiveReport('revenue')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeReport === 'revenue' ? 'gold-gradient-bg text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Revenue & Settlement Report
        </button>
        <button
          onClick={() => setActiveReport('staff')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeReport === 'staff' ? 'gold-gradient-bg text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Staff Artist Performance Report
        </button>
      </div>

      {/* Report Tables */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-x-auto">
        
        {activeReport === 'bookings' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Venue & City</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.map(b => (
                <tr key={b.id || b.tracking_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-amber-400">{b.tracking_id}</td>
                  <td className="p-3 font-semibold text-slate-100">{b.customer_name} ({b.customer_mobile})</td>
                  <td className="p-3">{b.venue}, {b.city}</td>
                  <td className="p-3">{b.event_date}</td>
                  <td className="p-3 font-bold text-slate-100">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3"><span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeReport === 'revenue' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Booking</th>
                <th className="p-3">Advance (20%)</th>
                <th className="p-3">Outstanding Balance</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.map(b => (
                <tr key={b.id || b.tracking_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-amber-400">{b.tracking_id}</td>
                  <td className="p-3 font-semibold text-slate-100">{b.customer_name}</td>
                  <td className="p-3 font-bold text-slate-100">₹{Number(b.total_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-emerald-400">₹{Number(b.advance_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold text-rose-400">₹{Number(b.outstanding_amount).toLocaleString('en-IN')}</td>
                  <td className="p-3"><span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeReport === 'staff' && (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Staff Artist</th>
                <th className="p-3">Mobile Contact</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Total Assigned</th>
                <th className="p-3">Completed Events</th>
                <th className="p-3">Active Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffList.map(s => (
                <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-slate-100">{s.name}</td>
                  <td className="p-3 font-medium text-slate-300">{s.mobile}</td>
                  <td className="p-3 text-amber-400">{s.experience}</td>
                  <td className="p-3 font-bold text-slate-100">{s.totalEvents || 0}</td>
                  <td className="p-3 font-bold text-emerald-400">{s.completedEvents || 0}</td>
                  <td className="p-3 font-bold text-amber-300">{s.activeEvents || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
};

export default AdvancedReports;
