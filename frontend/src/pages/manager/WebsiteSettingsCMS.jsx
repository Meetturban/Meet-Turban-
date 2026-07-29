import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Globe, Share2, Save, CheckCircle2 } from 'lucide-react';

const WebsiteSettingsCMS = () => {
  const { settings, updateSettings } = useSettings();

  const [form, setForm] = useState({
    business_name: settings.business_name || 'Safa Elegance',
    contact_phone: settings.contact_phone || '9876543210',
    whatsapp_number: settings.whatsapp_number || '919876543210',
    business_address: settings.business_address || 'Heritage Palace Road, Jaipur, Rajasthan',
    logo_url: settings.logo_url || '',
    instagram_url: settings.instagram_url || 'https://instagram.com/safaelegance',
    facebook_url: settings.facebook_url || 'https://facebook.com/safaelegance',
    twitter_url: settings.twitter_url || 'https://x.com/safaelegance',
    youtube_url: settings.youtube_url || 'https://youtube.com/@safaelegance'
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(form);
    setSavedMessage('Website Settings & Social Links updated successfully across entire platform.');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
          Micro Tasks 4.4 & 4.5 CMS
        </span>
        <h1 className="text-3xl font-black text-slate-100 mt-0.5">Website Settings & Social CMS</h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize business name, phone, WhatsApp manager number, address, logo, and social media handles.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-2xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Business Info Section */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4" />
            <span>Business Branding & Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Business Name</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">WhatsApp Manager Number (No +)</label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Logo Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Physical Address</label>
              <input
                type="text"
                value={form.business_address}
                onChange={(e) => setForm({ ...form, business_address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Share2 className="w-4 h-4" />
            <span>Social Media Handles (Footer Integration)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Instagram Profile URL</label>
              <input
                type="url"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">Facebook Page URL</label>
              <input
                type="url"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">X (Twitter) Profile URL</label>
              <input
                type="url"
                value={form.twitter_url}
                onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">YouTube Channel URL</label>
              <input
                type="url"
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 rounded-xl py-3 px-3 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="gold-gradient-bg text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Website Settings & Social Links</span>
        </button>

      </form>

    </div>
  );
};

export default WebsiteSettingsCMS;
