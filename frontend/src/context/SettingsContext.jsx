import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@backend/lib/supabase';

const SettingsContext = createContext();

const LOCAL_SETTINGS_KEY = 'safa_website_settings';

const DEFAULT_SETTINGS = {
  business_name: 'MEET TURBAN',
  contact_phone: '7011548343',
  whatsapp_number: '7011548343',
  business_address: 'DESHRAJ GARDEN DELHI',
  logo_url: '',
  instagram_url: 'https://instagram.com/meetturban',
  facebook_url: 'https://facebook.com/meetturban',
  twitter_url: 'https://x.com/meetturban',
  youtube_url: 'https://youtube.com/@meetturban',
  manager_email: 'manager@safaelegance.com',
  manager_password: 'manager123'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load Settings
  useEffect(() => {
    const loadSettings = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('website_settings').select('*').single();
          if (!error && data) {
            setSettings({ ...DEFAULT_SETTINGS, ...data });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase settings fetch error:', err);
        }
      }

      const stored = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.business_name === 'Safa Elegance' || !parsed.business_name) {
          const updated = { ...parsed, ...DEFAULT_SETTINGS };
          localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
          setSettings(updated);
        } else {
          setSettings(parsed);
        }
      } else {
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  // Update Settings CMS
  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('website_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase settings update error:', err);
      }
    }

    return { success: true, settings: updated };
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
