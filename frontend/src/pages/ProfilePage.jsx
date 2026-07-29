import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserBookings } from '@backend/services/bookingService';
import { User, Mail, Phone, Calendar, Clock, Crown, Shield, Edit3, Save, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || 'Heritage Palace Ward 4',
    city: user?.city || 'Jaipur'
  });

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      if (user?.mobile || user?.email) {
        const data = await fetchUserBookings(user.mobile || user.email);
        setBookings(data);
      }
      setLoadingBookings(false);
    };
    loadBookings();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      setIsEditing(false);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Profile Overview Card */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl gold-gradient-bg flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100">{user?.name}</h1>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{user?.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{user?.mobile}</span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-800 text-slate-400 text-xs font-semibold px-4 py-2.5 rounded-xl"
            >
              Cancel
            </button>
          )}

          <button
            onClick={logout}
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl">
          {message}
        </div>
      )}

      {/* Edit Form Drawer */}
      {isEditing && (
        <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Update Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="gold-gradient-bg text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </form>
      )}

      {/* Customer Booking History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-100">Your Booking History</h2>
          <Link to="/book" className="text-xs font-bold text-amber-400 underline">
            + New Booking
          </Link>
        </div>

        {loadingBookings ? (
          <div className="text-center py-8 text-amber-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">No previous bookings recorded yet.</p>
            <Link
              to="/book"
              className="inline-block gold-gradient-bg text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Create First Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((bkg) => (
              <div key={bkg.id || bkg.tracking_id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-amber-400">{bkg.tracking_id}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {bkg.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Venue: <strong>{bkg.venue}, {bkg.city}</strong> | Date: <strong>{bkg.event_date}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                    <span className="text-sm font-extrabold text-slate-100">
                      ₹{Number(bkg.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to={`/track?id=${bkg.tracking_id}`}
                    className="bg-slate-900 border border-slate-800 text-amber-300 text-xs font-bold px-4 py-2 rounded-xl hover:border-amber-500"
                  >
                    View Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;
