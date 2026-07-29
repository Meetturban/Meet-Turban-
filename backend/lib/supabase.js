import { createClient } from '@supabase/supabase-js';

const getEnvVar = (name) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
      return import.meta.env[name];
    }
  } catch (e) {
    // import.meta fallback
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://lwircrwakmcaqqqwgpfz.supabase.co';
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3aXJjcndha21jYXFxcXdncGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNTI0NTksImV4cCI6MjEwMDcyODQ1OX0.PPovzdTj4m6zjDP-_PzJTNcyQUsAk3Yy_r0NkSQ-6dg';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project-url.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
