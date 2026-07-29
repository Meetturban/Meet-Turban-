import React, { useState, useEffect } from 'react';
import { fetchAllBookings, updateBookingStatus, updateBookingDetails, fetchStaffMembers, assignStaffToBooking, removeStaffAssignment } from '@backend/services/bookingService';
import { Search, Filter, Edit3, X, Save, CheckCircle2, MessageCircle, Calendar, MapPin, User, Clock, UserCheck, UserMinus } from 'lucide-react';

const ALL_STATUSES = [
  'All',
  'Pending',
  'Awaiting Advance',
  'Advance Received',
  'Staff Assigned',
  'Confirmed',
  'Completed',
  'Cancelled'
];

const BookingOperationsHub = () => {
  const [bookings, setBookings] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    venue: '',
    city: '',
    event_date: '',
    event_time: '',
    status: '',
    staff_assigned: ''
  });

  const loadData = async () => {
    const [bkgData, stfData] = await Promise.all([
      fetchAllBookings(),
      fetchStaffMembers()
    ]);
    setBookings(bkgData);
    setStaffList(stfData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateBookingStatus(id, newStatus);
    loadData();
  };

  const handleAssignStaff = async (bookingId, staffId) => {
    if (!staffId) return;
    await assignStaffToBooking(bookingId, staffId);
    loadData();
  };

  const handleRemoveStaff = async (bookingId) => {
    await removeStaffAssignment(bookingId);
    loadData();
  };

  const openEditModal = (bkg) => {
    setEditingBooking(bkg);
    setEditForm({
      venue: bkg.venue || '',
      city: bkg.city || '',
      event_date: bkg.event_date || '',
      event_time: bkg.event_time || '',
      status: bkg.status || 'Pending',
      staff_assigned: bkg.staff_assigned || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    await updateBookingDetails(editingBooking.id, editForm);
    setEditingBooking(null);
    loadData();
  };

  const filteredBookings = bookings.filter(bkg => {
    const matchesStatus = selectedStatus === 'All' || bkg.status === selectedStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      bkg.tracking_id.toLowerCase().includes(term) ||
      bkg.customer_name.toLowerCase().includes(term) ||
      bkg.customer_mobile.includes(term) ||
      bkg.city.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
          Operations & Assignments Hub
        </span>
        <h1 className="text-3xl font-black text-slate-100 mt-0.5">Booking Operations Hub</h1>
        <p className="text-xs text-slate-400 mt-1">
          Full administrative lifecycle control, status updates, staff assignments, and booking edits.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-5 rounded-3xl border border-amber-500/20 space-y-4">
        
        {/* Status Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {ALL_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'gold-gradient-bg text-slate-950 shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Tracking ID (SAFA-...), Customer Name, Mobile, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Bookings Operations Table */}
      {loading ? (
        <div className="text-center py-12 text-amber-400">Loading Bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-2 border border-slate-800">
          <Filter className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No bookings match the selected status or search filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((bkg) => (
            <div key={bkg.id || bkg.tracking_id} className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-amber-500/40 transition-all space-y-4">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-black text-amber-400 tracking-wider">
                      {bkg.tracking_id}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-amber-300">
                      {bkg.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                    <span className="font-semibold text-slate-200">{bkg.customer_name}</span>
                    <span>•</span>
                    <span>{bkg.customer_mobile}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={bkg.status}
                    onChange={(e) => handleStatusChange(bkg.id || bkg.tracking_id, e.target.value)}
                    className="bg-slate-950 border border-amber-500/30 text-xs font-bold text-amber-300 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Awaiting Advance">Awaiting Advance</option>
                    <option value="Advance Received">Advance Received</option>
                    <option value="Staff Assigned">Staff Assigned</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => openEditModal(bkg)}
                    className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 p-2 rounded-xl transition-colors"
                    title="Edit Booking"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Venue & Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Venue & Time</span>
                  <p className="font-bold text-slate-100">{bkg.venue}, {bkg.city}</p>
                  <p className="text-slate-400">{bkg.event_date} at {bkg.event_time}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Financial Breakdown</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <strong className="text-slate-100">₹{Number(bkg.total_amount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>20% Advance:</span>
                    <strong>₹{Number(bkg.advance_amount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* MICRO TASK 3.2 STAFF ASSIGNMENT ENGINE DROPDOWN */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5 inline" />
                    <span>Staff Artist Assignment</span>
                  </span>

                  {bkg.staff_assigned ? (
                    <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-emerald-500/30">
                      <div>
                        <p className="font-bold text-slate-100">{bkg.staff_assigned}</p>
                        <p className="text-[10px] text-slate-400">{bkg.staff_mobile || '9829012345'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveStaff(bkg.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove Assignment"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => handleAssignStaff(bkg.id, e.target.value)}
                      defaultValue=""
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="" disabled>Select Staff Artist...</option>
                      {staffList.map(stf => (
                        <option key={stf.id} value={stf.id}>
                          {stf.name} ({stf.experience || '5+ yrs'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-100">
                Edit Booking ({editingBooking.tracking_id})
              </h3>
              <button onClick={() => setEditingBooking(null)} className="text-slate-400 hover:text-amber-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Venue Name</label>
                <input
                  type="text"
                  value={editForm.venue}
                  onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Event Date</label>
                  <input
                    type="date"
                    value={editForm.event_date}
                    onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Event Time</label>
                  <input
                    type="time"
                    value={editForm.event_time}
                    onChange={(e) => setEditForm({ ...editForm, event_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Assigned Staff Name</label>
                  <input
                    type="text"
                    placeholder="Artist team leader"
                    value={editForm.staff_assigned}
                    onChange={(e) => setEditForm({ ...editForm, staff_assigned: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-slate-950 border border-amber-500/30 text-amber-300 rounded-xl py-2.5 px-3 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Awaiting Advance">Awaiting Advance</option>
                  <option value="Advance Received">Advance Received</option>
                  <option value="Staff Assigned">Staff Assigned</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-slate-950 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 mt-4"
              >
                <Save className="w-4 h-4" />
                <span>Save Booking Changes</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingOperationsHub;
