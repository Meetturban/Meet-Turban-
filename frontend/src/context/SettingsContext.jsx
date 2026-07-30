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

  // Load Settings & Live Manager Credentials from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      let loadedSettings = { ...DEFAULT_SETTINGS };

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('website_settings').select('*').single();
          if (!error && data) {
            loadedSettings = { ...loadedSettings, ...data };
          }
        } catch (err) {
          console.warn('Supabase website_settings fetch notice:', err);
        }

        // Fetch credentials directly from Supabase manager table
        try {
          const { data: mgrData, error: mgrError } = await supabase.from('manager').select('*').limit(1);
          if (!mgrError && mgrData && mgrData.length > 0) {
            loadedSettings.manager_email = mgrData[0].email;
            loadedSettings.manager_password = mgrData[0].password;
          }
        } catch (err) {
          console.warn('Supabase manager table fetch notice:', err);
        }

        setSettings(loadedSettings);
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(loadedSettings));
        setLoading(false);
        return;
      }

      const stored = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch (e) {
          setSettings(DEFAULT_SETTINGS);
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
