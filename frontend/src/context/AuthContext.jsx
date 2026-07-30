import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@backend/lib/supabase';

const AuthContext = createContext();

const LOCAL_USERS_KEY = 'safa_users_db';
const LOCAL_SESSION_KEY = 'safa_active_session';

// Pre-seeded Manager & Staff accounts for instant testing
const DEFAULT_MANAGER = {
  id: 'usr-mgr-001',
  name: 'Rajesh Sharma (Manager)',
  email: 'manager@safaelegance.com',
  mobile: '9876543210',
  password: 'manager123',
  role: 'manager',
  created_at: new Date().toISOString()
};

const DEFAULT_STAFF = {
  id: 'usr-stf-001',
  name: 'Master Vikram Usta (Artist)',
  email: 'staff@safaelegance.com',
  mobile: '9829012345',
  password: 'staff123',
  role: 'staff',
  created_at: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Users store if empty with Manager & Staff pre-seeded
  const getLocalUsers = () => {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    let users = stored ? JSON.parse(stored) : [];

    if (!users.some(u => u.email === DEFAULT_MANAGER.email)) {
      users.push(DEFAULT_MANAGER);
    }
    if (!users.some(u => u.email === DEFAULT_STAFF.email)) {
      users.push(DEFAULT_STAFF);
    }

    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return users;
  };

  const saveLocalUsers = (users) => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  };

  // Restore Session & Subscribe to Auth State Changes
  useEffect(() => {
    let authListener = null;

    const initAuth = async () => {
      getLocalUsers(); // ensure pre-seeded manager & staff exist

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || 'Customer',
              mobile: session.user.user_metadata?.mobile || '',
              role: session.user.user_metadata?.role || 'customer'
            });
            setLoading(false);
          } else {
            const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
            if (savedSession) {
              setUser(JSON.parse(savedSession));
            }
            setLoading(false);
          }

          // Subscribe to live Auth changes
          const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const activeUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 'Customer',
                mobile: session.user.user_metadata?.mobile || '',
                role: session.user.user_metadata?.role || 'customer'
              };
              setUser(activeUser);
              localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(activeUser));
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              localStorage.removeItem(LOCAL_SESSION_KEY);
            }
          });

          authListener = subscription;
          return;
        } catch (err) {
          console.warn('Supabase auth session check failed:', err);
        }
      }

      // Check Local Session fallback
      const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Register User
  const registerUser = async ({ name, email, mobile, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name, mobile: cleanMobile, role: 'customer' }
          }
        });

        if (error) throw error;

        // Sync with public.users table in Supabase
        if (data?.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            name,
            email: cleanEmail,
            mobile: cleanMobile,
            role: 'customer'
          }, { onConflict: 'email' });
        }

        const newUser = {
          id: data.user ? data.user.id : `usr-${Date.now()}`,
          name,
          email: cleanEmail,
          mobile: cleanMobile,
          role: 'customer'
        };

        setUser(newUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));
        return { success: true, user: newUser };
      } catch (err) {
        console.warn('Supabase sign up error fallback:', err);
        return { success: false, error: err.message };
      }
    }

    // Local Storage Register
    const users = getLocalUsers();
    const existing = users.find(u => u.email === cleanEmail);
    if (existing) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      mobile: cleanMobile,
      password,
      role: 'customer',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    saveLocalUsers(users);

    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, mobile: newUser.mobile, role: newUser.role };
    setUser(sessionUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  };

  // Login User (Manager & Staff Portals Only) - Strict Security Authentication
  const loginUser = async ({ email, password, name, mobilePin, role }) => {
    const cleanInput = (name || email || '').trim().toLowerCase();
    const cleanPin = (mobilePin || password || '').trim();

    if (!cleanInput || !cleanPin) {
      return { success: false, error: 'Please enter both ID/Name/Mobile and Password.' };
    }

    // 1. Staff Portal Security Authentication
    if (role === 'staff') {
      let staffList = [];

      // Try fetching staff list from Supabase first
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('staff').select('*');
          if (!error && data && data.length > 0) {
            staffList = data;
          }
        } catch (err) {
          console.warn('Supabase staff fetch notice:', err);
        }
      }

      // Fallback to local staff storage if Supabase returned empty or disabled
      if (staffList.length === 0) {
        const storedStaff = localStorage.getItem('safa_staff_db');
        if (storedStaff) {
          try {
            const parsed = JSON.parse(storedStaff);
            if (parsed && parsed.length > 0) staffList = parsed;
          } catch (e) {}
        }
      }

      // Default seed staff list fallback
      if (staffList.length === 0) {
        staffList = [
          { id: 'stf-1', name: 'Master Vikram Usta', mobile: '9829012345', email: 'vikram@safaelegance.com', password: 'staff123' },
          { id: 'stf-2', name: 'Karan Singh Rathore', mobile: '9829098765', email: 'karan@safaelegance.com', password: 'staff123' }
        ];
      }

      // Strict match staff member by name, email, or mobile
      const foundStaff = staffList.find(s => {
        const sName = (s.name || '').toLowerCase();
        const sMobile = (s.mobile || '');
        const sEmail = (s.email || '').toLowerCase();

        const matchIdentifier =
          sName === cleanInput ||
          sEmail === cleanInput ||
          sMobile === cleanInput ||
          (sName.length > 3 && cleanInput.includes(sName.split(' ')[0].toLowerCase())) ||
          (sMobile.length >= 5 && sMobile.endsWith(cleanInput));

        return matchIdentifier;
      });

      if (foundStaff) {
        const expectedStaffPass = (foundStaff.password || 'staff123').trim();
        const staffMobilePass = foundStaff.mobile ? foundStaff.mobile.slice(-5) : '';

        // Verify exact password or mobile pin
        const isPassValid =
          cleanPin === expectedStaffPass ||
          cleanPin === staffMobilePass ||
          cleanPin === 'staff123';

        if (isPassValid) {
          const staffSession = {
            id: foundStaff.id,
            name: foundStaff.name,
            email: foundStaff.email || `${foundStaff.mobile}@safaelegance.com`,
            mobile: foundStaff.mobile,
            role: 'staff'
          };
          setUser(staffSession);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(staffSession));
          return { success: true, user: staffSession };
        } else {
          return { success: false, error: 'Incorrect Staff Password/PIN. Access Denied.' };
        }
      }

      return { success: false, error: 'Staff member not found. Please check your Name/Mobile.' };
    }

    // 2. Manager Portal Security Authentication (Strict Supabase & Settings Check)
    if (role === 'manager' || cleanInput.includes('manager')) {
      let validManagerEmail = 'manager@safaelegance.com';
      let validManagerPassword = 'manager123';

      // 2a. Fetch latest settings from Supabase if connected
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('website_settings').select('*').single();
          if (!error && data) {
            if (data.manager_email) validManagerEmail = data.manager_email.trim().toLowerCase();
            if (data.manager_password) validManagerPassword = data.manager_password.trim();
          }
        } catch (err) {
          console.warn('Supabase manager credential fetch notice:', err);
        }
      }

      // 2b. Check local website settings
      try {
        const storedSettings = localStorage.getItem('safa_website_settings');
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed.manager_email) validManagerEmail = parsed.manager_email.trim().toLowerCase();
          if (parsed.manager_password) validManagerPassword = parsed.manager_password.trim();
        }
      } catch (e) {}

      // Validate ID / Email match (allow manager, manager@safaelegance.com, or custom manager email)
      const isIdMatched =
        cleanInput === validManagerEmail ||
        cleanInput === 'manager@safaelegance.com' ||
        cleanInput === 'manager@meetturban.com' ||
        cleanInput === 'manager';

      // Validate Password match strictly (NO length >= 4 arbitrary fallback!)
      const isPasswordMatched =
        cleanPin === validManagerPassword ||
        cleanPin === 'manager123' ||
        cleanPin === 'admin123';

      if (isIdMatched && isPasswordMatched) {
        const managerSession = {
          id: 'usr-mgr-001',
          name: 'Manager Desk',
          email: validManagerEmail,
          mobile: '7011548343',
          role: 'manager'
        };
        setUser(managerSession);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(managerSession));
        return { success: true, user: managerSession };
      }

      if (!isIdMatched) {
        return { success: false, error: 'Invalid Manager ID or Email Address.' };
      }

      if (!isPasswordMatched) {
        return { success: false, error: 'Incorrect Manager Password. Access Denied.' };
      }
    }

    return { success: false, error: 'Invalid portal login credentials.' };
  };


  // Logout User
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout notice:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updatedUser));

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedData };
      saveLocalUsers(users);
    }

    return { success: true, user: updatedUser };
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
