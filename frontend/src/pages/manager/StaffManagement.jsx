import React, { useState, useEffect } from 'react';
import { fetchStaffMembers, addStaffMember, updateStaffMember, deleteStaffMember } from '@backend/services/bookingService';
import { Plus, Phone, Edit2, Trash2, X, Save, Mail } from 'lucide-react';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    experience: '5+ Years',
    address: '',
    skills: 'Safa Tying, Groom Turban',
    profile_photo: ''
  });

  const loadStaff = async () => {
    const data = await fetchStaffMembers();
    setStaffList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const openAddModal = () => {
    setEditingStaff(null);
    setForm({
      name: '',
      email: '',
      mobile: '',
      password: 'staff123',
      experience: '5+ Years',
      address: '',
      skills: 'Groom Safa, Rajasthani Turban, Kalgi Fitting',
      profile_photo: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (stf) => {
    setEditingStaff(stf);
    setForm({
      name: stf.name || '',
      email: stf.email || '',
      mobile: stf.mobile || '',
      password: stf.password || 'staff123',
      experience: stf.experience || '5+ Years',
      address: stf.address || '',
      skills: Array.isArray(stf.skills) ? stf.skills.join(', ') : (stf.skills || ''),
      profile_photo: stf.profile_photo || ''
    });
    setModalOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;

    if (editingStaff) {
      await updateStaffMember(editingStaff.id, form);
    } else {
      await addStaffMember(form);
    }

    setModalOpen(false);
    loadStaff();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove staff member "${name}"?`)) {
      await deleteStaffMember(id);
      loadStaff();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Stage 3 Workforce Control
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Staff & Artist Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage master turban tying artists, track event assignments, and review completion metrics.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-gradient-bg text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff Artist</span>
        </button>
      </div>

      {/* Staff Cards & Performance Tracking Grid */}
      {loading ? (
        <div className="text-center py-12 text-amber-400">Loading Staff Directory...</div>
      ) : staffList.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center text-xs text-slate-400">
          No staff artists registered yet. Click "+ Add New Staff Artist" to register your first team member.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staffList.map((stf) => (
            <div key={stf.id} className="glass-card p-6 rounded-3xl space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={stf.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                      alt={stf.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30"
                    />
                    <div>
                      <h3 className="text-base font-black text-slate-100">{stf.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold flex items-center space-x-2 mt-0.5">
                        <Phone className="w-3.5 h-3.5 inline" />
                        <span>{stf.mobile}</span>
                      </p>
                      {stf.email && (
                        <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 inline" />
                          <span>{stf.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(stf)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
                      title="Edit Staff Member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(stf.id, stf.name)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Staff Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info & Skills */}
                <div className="text-xs space-y-2 text-slate-300">
                  {stf.email && <p><strong className="text-slate-100">Email:</strong> {stf.email}</p>}
                  <p><strong className="text-slate-100">Experience:</strong> {stf.experience || '5+ Years'}</p>
                  <p><strong className="text-slate-100">Address:</strong> {stf.address || 'Rajasthan Central'}</p>
                  <div>
                    <strong className="text-slate-100 block mb-1">Expertise & Skills:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(stf.skills) ? stf.skills : (stf.skills ? stf.skills.split(',') : ['Safa Tying'])).map((sk, idx) => (
                        <span key={idx} className="bg-slate-950 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MICRO TASK 3.6 PERFORMANCE METRICS */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Events</span>
                  <span className="text-base font-black text-slate-100 mt-0.5 block">{stf.totalEvents || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Completed</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">{stf.completedEvents || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Active</span>
                  <span className="text-base font-black text-amber-400 mt-0.5 block">{stf.activeEvents || 0}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Artist'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-amber-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Master Vikram Usta"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. artist@safaelegance.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Login Password *</label>
                  <input
                    type="text"
                    placeholder="e.g. staff123"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>


              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Experience Level</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Address / Base Location</label>
                <input
                  type="text"
                  placeholder="e.g. Heritage Ward 3, Jaipur"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Groom Safa, Rajasthani Turban, Kalgi Fitting"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.profile_photo}
                  onChange={(e) => setForm({ ...form, profile_photo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-slate-950 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 mt-4"
              >
                <Save className="w-4 h-4" />
                <span>{editingStaff ? 'Save Staff Updates' : 'Add Staff Member'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManagement;
