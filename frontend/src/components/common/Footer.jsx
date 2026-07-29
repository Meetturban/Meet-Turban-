import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Crown, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();

  const managerPhone = settings.whatsapp_number || '7011548343';
  const whatsappUrl = `https://wa.me/${managerPhone}?text=${encodeURIComponent('Hello Meet Turban, I would like to inquire about wedding turban and safa services.')}`;

  return (
    <footer className="bg-slate-950 border-t border-amber-500/20 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Col 1: Brand Info & Social Media Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.business_name} className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-lg gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Crown className="w-5 h-5 text-slate-950" />
                </div>
              )}
              <span className="text-lg font-bold gold-gradient-text uppercase tracking-wider">
                {settings.business_name || 'MEET TURBAN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier royal wedding safa tying, groom turbans, and Barat entry arrangements. Elevating your royal celebration with traditional craft and elegance.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors" title="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors" title="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors" title="X (Twitter)">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors" title="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home Showcase</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">All Royal Services</Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-amber-400 transition-colors">Book Wedding Event</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-400 transition-colors">Track Booking Status</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-400 font-semibold text-amber-300/90 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs mb-4">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.business_address || 'DESHRAJ GARDEN DELHI'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 {settings.contact_phone || '7011548343'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@meetturban.com</span>
              </li>
            </ul>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.business_name || 'MEET TURBAN'}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with Royalty & Excellence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
