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

  // Login User (Manager & Staff Portals Only)
  const loginUser = async ({ email, password, role }) => {
    const cleanInput = (email || '').trim().toLowerCase();

    // 1. Manager Authentication
    if (
      cleanInput === 'manager@safaelegance.com' ||
      cleanInput === 'manager@meetturban.com' ||
      cleanInput === 'manager' ||
      role === 'manager'
    ) {
      if (password === 'manager123' || password === 'admin123') {
        const managerSession = {
          id: 'usr-mgr-001',
          name: 'Manager Desk',
          email: 'manager@safaelegance.com',
          mobile: '9876543210',
          role: 'manager'
        };
        setUser(managerSession);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(managerSession));
        return { success: true, user: managerSession };
      }
    }

    // 2. Staff Artist Directory Authentication
    const storedStaff = localStorage.getItem('safa_staff_db');
    if (storedStaff) {
      try {
        const staffList = JSON.parse(storedStaff);
        const foundStaff = staffList.find(s => 
          (s.email && s.email.toLowerCase() === cleanInput) ||
          (s.mobile && s.mobile === cleanInput) ||
          (s.name && s.name.toLowerCase().includes(cleanInput))
        );

        if (foundStaff) {
          const expectedPassword = foundStaff.password || 'staff123';
          if (password === expectedPassword || password === 'staff123') {
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
          }
        }
      } catch (err) {
        console.warn('Staff auth parse error:', err);
      }
    }

    // 3. Pre-seeded Staff Fallback
    if (cleanInput === 'staff@safaelegance.com' || cleanInput === 'staff' || role === 'staff') {
      if (password === 'staff123') {
        const staffSession = {
          id: 'usr-stf-001',
          name: 'Master Vikram Usta',
          email: 'staff@safaelegance.com',
          mobile: '9829012345',
          role: 'staff'
        };
        setUser(staffSession);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(staffSession));
        return { success: true, user: staffSession };
      }
    }

    // 4. Fallback Local Storage Users
    const users = getLocalUsers();
    const foundUser = users.find(u => 
      (u.email === cleanInput || u.mobile === cleanInput) && u.password === password
    );

    if (foundUser && (foundUser.role === 'manager' || foundUser.role === 'staff' || foundUser.role === 'admin')) {
      const sessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        mobile: foundUser.mobile,
        role: foundUser.role
      };
      setUser(sessionUser);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    return { success: false, error: 'Invalid credentials. Only Manager and Staff credentials are authorized.' };
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
