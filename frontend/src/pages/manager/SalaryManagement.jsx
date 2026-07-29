import React, { useState, useEffect } from 'react';
import { fetchStaffMembers, fetchSalaryRecords, saveSalaryRecord } from '@backend/services/bookingService';
import { DollarSign, CheckCircle2, AlertCircle, Edit2, Save, Calendar, UserCheck, ShieldCheck } from 'lucide-react';

const SalaryManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const [salaryAdjustments, setSalaryAdjustments] = useState({});
  const [paidStatusMap, setPaidStatusMap] = useState({});

  useEffect(() => {
    const loadSalaryData = async () => {
      const staff = await fetchStaffMembers();
      setStaffList(staff);

      const dbRecords = await fetchSalaryRecords(currentMonth);

      const initialAdj = {};
      const initialStatus = {};
      staff.forEach(stf => {
        const existing = dbRecords.find(r => r.staff_id === stf.id);
        initialAdj[stf.id] = { bonus: existing?.bonus || 0, deductions: existing?.deductions || 0 };
        initialStatus[stf.id] = existing?.status === 'paid' ? 'Paid' : (existing?.status === 'Paid' ? 'Paid' : 'Pending');
      });
      setSalaryAdjustments(initialAdj);
      setPaidStatusMap(initialStatus);
      setLoading(false);
    };
    loadSalaryData();
  }, [currentMonth]);

  const handleBonusChange = (id, val) => {
    setSalaryAdjustments(prev => ({
      ...prev,
      [id]: { ...prev[id], bonus: Number(val) || 0 }
    }));
  };

  const handleDeductionsChange = (id, val) => {
    setSalaryAdjustments(prev => ({
      ...prev,
      [id]: { ...prev[id], deductions: Number(val) || 0 }
    }));
  };

  const toggleSalaryStatus = async (stf) => {
    const newStatus = paidStatusMap[stf.id] === 'Paid' ? 'Pending' : 'Paid';
    setPaidStatusMap(prev => ({
      ...prev,
      [stf.id]: newStatus
    }));

    const base = Number(stf.base_salary || 15000);
    const perEvent = Number(stf.per_event_pay || 500);
    const events = stf.completedEvents || 0;
    const bonus = salaryAdjustments[stf.id]?.bonus || 0;
    const ded = salaryAdjustments[stf.id]?.deductions || 0;
    const totalPayout = base + (perEvent * events) + bonus - ded;

    await saveSalaryRecord({
      staff_id: stf.id,
      month: currentMonth,
      base_salary: base,
      per_event_pay: perEvent,
      events_count: events,
      bonus,
      deductions: ded,
      total_payout: totalPayout,
      status: newStatus.toLowerCase()
    });
  };

  if (loading) {
    return <div className="py-12 text-center text-amber-400">Calculating Salary Records...</div>;
  }

  const grandTotalPayout = staffList.reduce((sum, stf) => {
    const base = Number(stf.base_salary || 15000);
    const perEvent = Number(stf.per_event_pay || 500);
    const events = stf.completedEvents || 0;
    const bonus = salaryAdjustments[stf.id]?.bonus || 0;
    const ded = salaryAdjustments[stf.id]?.deductions || 0;
    return sum + (base + (perEvent * events) + bonus - ded);
  }, 0);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Micro Task 4.1 Salary Module
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Staff Salary Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monthly payroll calculations, completed event bonuses, and payout status reports for {currentMonth}.
          </p>
        </div>

        <div className="glass-panel px-5 py-3 rounded-2xl border border-emerald-500/30 text-right">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Payroll Payout</span>
          <span className="text-xl font-black text-slate-100">₹{grandTotalPayout.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Salary Records Table */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3">Staff Artist</th>
              <th className="p-3">Base Salary</th>
              <th className="p-3">Completed Events</th>
              <th className="p-3">Event Pay</th>
              <th className="p-3">Bonus (₹)</th>
              <th className="p-3">Deduction (₹)</th>
              <th className="p-3">Total Payout</th>
              <th className="p-3 text-right">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {staffList.map((stf) => {
              const base = Number(stf.base_salary || 15000);
              const perEvent = Number(stf.per_event_pay || 500);
              const events = stf.completedEvents || 0;
              const bonus = salaryAdjustments[stf.id]?.bonus || 0;
              const ded = salaryAdjustments[stf.id]?.deductions || 0;
              const totalPayout = base + (perEvent * events) + bonus - ded;
              const isPaid = paidStatusMap[stf.id] === 'Paid';

              return (
                <tr key={stf.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-slate-100">
                    {stf.name}
                    <span className="block text-[10px] text-slate-400 font-normal">{stf.mobile}</span>
                  </td>
                  <td className="p-3 font-semibold">₹{base.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {events} Events Done
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">₹{(perEvent * events).toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={bonus || ''}
                      placeholder="0"
                      onChange={(e) => handleBonusChange(stf.id, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-1 text-right focus:outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={ded || ''}
                      placeholder="0"
                      onChange={(e) => handleDeductionsChange(stf.id, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg p-1 text-right focus:outline-none focus:border-amber-500"
                    />
                  </td>
                  <td className="p-3 font-black text-amber-300 text-sm">
                    ₹{totalPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleSalaryStatus(stf)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                        isPaid
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'gold-gradient-bg text-slate-950 shadow-md'
                      }`}
                    >
                      {isPaid ? '✓ Salary Paid' : 'Mark as Paid'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SalaryManagement;
