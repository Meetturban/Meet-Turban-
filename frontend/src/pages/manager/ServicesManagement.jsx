import React, { useState, useEffect } from 'react';
import { fetchServices, addServiceItem, updateServiceItem, toggleServiceVisibility, deleteServiceItem } from '@backend/services/bookingService';
import { Plus, Edit2, Eye, EyeOff, Trash2, X, Save, Sparkles } from 'lucide-react';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Safa',
    image_url: '',
    popular: false
  });

  const loadServices = async () => {
    const data = await fetchServices(true); // include hidden
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: 'Safa',
      image_url: '',
      popular: false
    });
    setModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingService(srv);
    setForm({
      name: srv.name || '',
      description: srv.description || '',
      price: srv.price || '',
      category: srv.category || 'Safa',
      image_url: srv.image_url || '',
      popular: Boolean(srv.popular)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    if (editingService) {
      await updateServiceItem(editingService.id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image_url: form.image_url,
        popular: form.popular
      });
    } else {
      await addServiceItem(form);
    }

    setModalOpen(false);
    loadServices();
  };

  const handleToggleHide = async (id) => {
    await toggleServiceVisibility(id);
    loadServices();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"?`)) {
      await deleteServiceItem(id);
      loadServices();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
            Micro Task 2.4 Catalog Operations
          </span>
          <h1 className="text-3xl font-black text-slate-100 mt-0.5">Services Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new royal wedding packages, edit pricing, toggle service visibility, or delete catalog items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="gold-gradient-bg text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="text-center py-12 text-amber-400">Loading catalog items...</div>
      ) : services.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center text-xs text-slate-400">
          No services created yet. Click "+ Add New Service" to create your first package.
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-amber-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Service Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Visibility Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={srv.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                        alt={srv.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                      />
                      <div>
                        <span className="font-bold text-slate-100 block">{srv.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{srv.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-amber-400">{srv.category}</td>
                  <td className="p-3 font-extrabold text-slate-100">
                    ₹{Number(srv.price).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    {srv.hidden ? (
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleHide(srv.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                      title={srv.hidden ? 'Show in Catalog' : 'Hide from Catalog'}
                    >
                      {srv.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(srv.id, srv.name)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-100">
                {editingService ? 'Edit Package' : 'Add New Service Package'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-amber-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Rajasthani Silk Safa"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Turban & Safa"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Service package features & inclusions..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                />
                <label htmlFor="popularCheck" className="text-slate-300 font-semibold cursor-pointer">
                  Mark as Popular / Featured Package
                </label>
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-slate-950 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 mt-4"
              >
                <Save className="w-4 h-4" />
                <span>{editingService ? 'Save Package Updates' : 'Add Package'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesManagement;
