import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStaffAssignedBookings, updateStaffEventWorkflow } from '@backend/services/bookingService';
import { UserCheck, CheckCircle2, Play, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [assignedBookings, setAssignedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (user) {
      const data = await fetchStaffAssignedBookings(user.mobile || user.email);
      setAssignedBookings(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleWorkflowAction = async (bookingId, action) => {
    await updateStaffEventWorkflow(bookingId, action);
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-xl">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100">{user?.name || 'Master Safa Artist'}</h1>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                Artist Staff Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mobile: {user?.mobile || '9829012345'} | Assigned Event Schedule
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-500/10 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all self-start"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Assigned Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-100">Your Assigned Wedding Events</h2>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {assignedBookings.length} {assignedBookings.length === 1 ? 'Event' : 'Events'} Total
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-emerald-400">Loading your schedule...</div>
        ) : assignedBookings.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-2 border border-slate-800">
            <UserCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Events Assigned Yet</h3>
            <p className="text-xs text-slate-400">
              When the manager assigns a new event to you, it will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignedBookings.map((bkg) => (
              <div key={bkg.id || bkg.tracking_id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Tracking Reference
                    </span>
                    <h3 className="text-xl font-black text-amber-400 mt-0.5">{bkg.tracking_id}</h3>
                  </div>

                  <span className="bg-slate-950 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full">
                    Status: {bkg.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* Customer Info */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">
                      Customer Contact
                    </h4>
                    <p><strong className="text-slate-100">Name:</strong> {bkg.customer_name}</p>
                    <p><strong className="text-slate-100">Mobile:</strong> {bkg.customer_mobile}</p>
                    <div className="pt-2 flex items-center space-x-2">
                      <a
                        href={`tel:${bkg.customer_mobile}`}
                        className="bg-slate-900 border border-slate-800 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl hover:border-amber-500"
                      >
                        Call Customer
                      </a>
                      <a
                        href={`https://wa.me/${bkg.customer_mobile}?text=${encodeURIComponent(`Hello ${bkg.customer_name}, I am your assigned Safa Artist for booking ${bkg.tracking_id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-500"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Venue & Schedule */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">
                      Venue & Schedule
                    </h4>
                    <p><strong className="text-slate-100">Venue:</strong> {bkg.venue}, {bkg.city}</p>
                    <p><strong className="text-slate-100">Date:</strong> {bkg.event_date}</p>
                    <p><strong className="text-slate-100">Time:</strong> {bkg.event_time}</p>
                  </div>

                </div>

                {/* Selected Services Package */}
                {bkg.services && bkg.services.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Required Services & Quantities
                    </h4>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 divide-y divide-slate-800 text-xs">
                      {bkg.services.map((s, idx) => (
                        <div key={idx} className="py-2 flex justify-between">
                          <span className="text-slate-200">{s.name}</span>
                          <strong className="text-amber-400">Qty: {s.quantity}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MICRO TASK 3.5 EVENT COMPLETION WORKFLOW ACTIONS */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Event Workflow Controls
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Action 1: Accept Booking */}
                    <button
                      onClick={() => handleWorkflowAction(bkg.id, 'accept')}
                      disabled={bkg.status === 'Confirmed' || bkg.status === 'In Progress' || bkg.status === 'Completed'}
                      className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                        bkg.status === 'Confirmed' || bkg.status === 'In Progress' || bkg.status === 'Completed'
                          ? 'bg-slate-900 text-slate-600 border border-slate-800'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1. Accept Booking</span>
                    </button>

                    {/* Action 2: Start Event */}
                    <button
                      onClick={() => handleWorkflowAction(bkg.id, 'start')}
                      disabled={bkg.status === 'In Progress' || bkg.status === 'Completed'}
                      className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                        bkg.status === 'In Progress' || bkg.status === 'Completed'
                          ? 'bg-slate-900 text-slate-600 border border-slate-800'
                          : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>2. Start Event (In Progress)</span>
                    </button>

                    {/* Action 3: Complete Event */}
                    <button
                      onClick={() => handleWorkflowAction(bkg.id, 'complete')}
                      disabled={bkg.status === 'Completed'}
                      className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                        bkg.status === 'Completed'
                          ? 'bg-slate-900 text-slate-600 border border-slate-800'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>3. Complete Event</span>
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StaffDashboard;
