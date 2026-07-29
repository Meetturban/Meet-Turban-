import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_SERVICES } from './mockServicesData.js';

const LOCAL_SERVICES_KEY = 'safa_services_db';
const LOCAL_BOOKINGS_KEY = 'safa_bookings_db';
const LOCAL_STAFF_KEY = 'safa_staff_db';
const LOCAL_NOTIFICATIONS_KEY = 'safa_notifications_db';

// Initial Notifications Seed
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'new_booking',
    title: 'New Wedding Booking Received',
    message: 'Maharaja Vikram Singh booked Groom Maharaja Turban package (SAFA-2026-000001).',
    read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'notif-2',
    type: 'payment_update',
    title: 'Advance Payment Intent Logged',
    message: '20% Advance deposit (₹3,700) intent logged for booking SAFA-2026-000001.',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// Safe Memory Storage Polyfill for Node.js (Render / Server) Environment
const memoryStore = new Map();

const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try { return localStorage.getItem(key); } catch (e) { return memoryStore.get(key) || null; }
    }
    return memoryStore.get(key) || null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try { localStorage.setItem(key, value); } catch (e) { memoryStore.set(key, value); }
    }
    memoryStore.set(key, value);
  }
};

// Helper functions for Storage
const getLocalNotifications = () => {
  const stored = safeLocalStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
  if (!stored) {
    safeLocalStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(stored);
};

const saveLocalNotifications = (list) => {
  safeLocalStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(list));
};

const getLocalServices = () => {
  const stored = safeLocalStorage.getItem(LOCAL_SERVICES_KEY);
  if (!stored) {
    safeLocalStorage.setItem(LOCAL_SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  }
  return JSON.parse(stored);
};

const saveLocalServices = (services) => {
  safeLocalStorage.setItem(LOCAL_SERVICES_KEY, JSON.stringify(services));
};


const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const updateBookingInSupabase = async (bookingId, payload) => {
  if (!isSupabaseConfigured || !supabase || !bookingId) return;
  try {
    if (isUUID(bookingId)) {
      await supabase.from('bookings').update(payload).eq('id', bookingId);
    } else {
      await supabase.from('bookings').update(payload).eq('tracking_id', bookingId);
    }
  } catch (err) {
    console.warn('Supabase booking update fallback:', err);
  }
};

const getLocalStaff = () => {
  const stored = safeLocalStorage.getItem(LOCAL_STAFF_KEY);
  if (!stored) {
    const initialStaff = [
      {
        id: 'stf-1',
        name: 'Master Vikram Usta',
        email: 'vikram@safaelegance.com',
        mobile: '9829012345',
        experience: '12 Years',
        address: 'Pink City Heritage Ward 3, Jaipur',
        skills: ['Groom Safa', 'Rajasthani Turban', 'Royal Kalgi Fitting'],
        profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString()
      },
      {
        id: 'stf-2',
        name: 'Karan Singh Rathore',
        email: 'karan@safaelegance.com',
        mobile: '9829098765',
        experience: '8 Years',
        address: 'Lake Palace Gate Road, Udaipur',
        skills: ['Barati Bulk Safa', 'Phoolon Ki Chaddar', 'Shehnai Troupe Lead'],
        profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString()
      }
    ];
    safeLocalStorage.setItem(LOCAL_STAFF_KEY, JSON.stringify(initialStaff));
    return initialStaff;
  }
  return JSON.parse(stored);
};


const saveLocalStaff = (staffList) => {
  safeLocalStorage.setItem(LOCAL_STAFF_KEY, JSON.stringify(staffList));
};

const getLocalBookings = () => {
  const stored = safeLocalStorage.getItem(LOCAL_BOOKINGS_KEY);
  if (!stored) {
    const seedBookings = [
      {
        id: 'bkg-demo-1',
        tracking_id: 'SAFA-2026-000001',
        customer_name: 'Maharaja Vikram Singh',
        customer_mobile: '9876543210',
        customer_alt_mobile: '9876543211',
        venue: 'Rambagh Palace Grand Lawn',
        city: 'Jaipur',
        event_date: new Date().toISOString().split('T')[0],
        event_time: '18:00',
        status: 'Confirmed',
        staff_id: 'stf-1',
        staff_assigned: 'Master Vikram Usta',
        staff_mobile: '9829012345',
        services: [
          { id: 'srv-2', name: 'Groom Maharaja Turban + Royal Kalgi', quantity: 1, price: 3500 },
          { id: 'srv-3', name: 'Barati Safa Tying Service (50 Pcs Package)', quantity: 1, price: 15000 }
        ],
        total_amount: 18500,
        advance_amount: 3700,
        outstanding_amount: 14800,
        created_at: new Date().toISOString()
      },
      {
        id: 'bkg-demo-2',
        tracking_id: 'SAFA-2026-000002',
        customer_name: 'Rajveer Rathore',
        customer_mobile: '9988776655',
        venue: 'City Palace Courtyard',
        city: 'Udaipur',
        event_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        event_time: '11:00',
        status: 'Awaiting Advance',
        staff_id: null,
        staff_assigned: null,
        services: [
          { id: 'srv-4', name: 'Royal Vintage Barat Car Entry', quantity: 1, price: 25000 }
        ],
        total_amount: 25000,
        advance_amount: 5000,
        outstanding_amount: 20000,
        created_at: new Date().toISOString()
      }
    ];
    safeLocalStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }
  return JSON.parse(stored);
};

const saveLocalBookings = (bookings) => {
  safeLocalStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
};


// Tracking ID Generator (Format: SAFA-YYYY-XXXXXX)
export const generateTrackingId = () => {
  const year = new Date().getFullYear();
  const bookings = getLocalBookings();
  const sequenceNumber = (bookings.length + 1).toString().padStart(6, '0');
  return `SAFA-${year}-${sequenceNumber}`;
};

// MICRO TASK 4.6 NOTIFICATIONS API
export const fetchNotifications = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase notifications fetch fallback:', err);
    }
  }
  return getLocalNotifications();
};

export const addNotification = async (type, title, message) => {
  const newNotif = {
    type,
    title,
    message,
    read: false,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotif])
        .select()
        .single();
      if (!error && data) {
        const list = getLocalNotifications();
        list.unshift(data);
        saveLocalNotifications(list);
        return data;
      }
    } catch (err) {
      console.warn('Supabase notification insert fallback:', err);
    }
  }

  const list = getLocalNotifications();
  const localNotif = { id: `notif-${Date.now()}`, ...newNotif };
  list.unshift(localNotif);
  saveLocalNotifications(list);
  return localNotif;
};

export const markNotificationRead = async (id) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (err) {
      console.warn('Supabase mark read fallback:', err);
    }
  }

  const list = getLocalNotifications();
  const idx = list.findIndex(n => n.id === id);
  if (idx !== -1) {
    list[idx].read = true;
    saveLocalNotifications(list);
  }
  return { success: true };
};

export const markAllNotificationsRead = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
    } catch (err) {
      console.warn('Supabase mark all read fallback:', err);
    }
  }

  const list = getLocalNotifications().map(n => ({ ...n, read: true }));
  saveLocalNotifications(list);
  return { success: true };
};

// Services Catalog
export const fetchServices = async (includeHidden = false) => {
  let list = getLocalServices();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        list = data;
        saveLocalServices(data);
      }
    } catch (err) {
      console.warn('Supabase service fetch fallback:', err);
    }
  }
  return includeHidden ? list : list.filter(s => !s.hidden);
};

export const addServiceItem = async (serviceData) => {
  const newServicePayload = {
    name: serviceData.name,
    description: serviceData.description,
    price: Number(serviceData.price),
    category: serviceData.category || 'Safa',
    image_url: serviceData.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    hidden: false
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([newServicePayload])
        .select()
        .single();
      if (!error && data) {
        const services = getLocalServices();
        services.unshift(data);
        saveLocalServices(services);
        return { success: true, service: data };
      }
    } catch (err) {
      console.warn('Supabase add service fallback:', err);
    }
  }

  const localService = { id: `srv-${Date.now()}`, ...newServicePayload, popular: Boolean(serviceData.popular), created_at: new Date().toISOString() };
  const services = getLocalServices();
  services.unshift(localService);
  saveLocalServices(services);
  return { success: true, service: localService };
};

export const updateServiceItem = async (serviceId, updatedFields) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('services').update(updatedFields).eq('id', serviceId);
    } catch (err) {
      console.warn('Supabase update service fallback:', err);
    }
  }

  const services = getLocalServices();
  const idx = services.findIndex(s => s.id === serviceId);
  if (idx !== -1) {
    services[idx] = { ...services[idx], ...updatedFields };
    saveLocalServices(services);
  }
  return { success: true };
};

export const toggleServiceVisibility = async (serviceId) => {
  const services = getLocalServices();
  const target = services.find(s => s.id === serviceId);
  if (target) {
    const newHiddenState = !target.hidden;
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').update({ hidden: newHiddenState }).eq('id', serviceId);
      } catch (err) {
        console.warn('Supabase toggle visibility fallback:', err);
      }
    }
    target.hidden = newHiddenState;
    saveLocalServices(services);
  }
  return { success: true };
};

export const deleteServiceItem = async (serviceId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('services').delete().eq('id', serviceId);
    } catch (err) {
      console.warn('Supabase delete service fallback:', err);
    }
  }

  let services = getLocalServices();
  services = services.filter(s => s.id !== serviceId);
  saveLocalServices(services);
  return { success: true };
};

// Staff Module
export const fetchStaffMembers = async () => {
  let staffList = getLocalStaff();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (!error && data && data.length > 0) {
        staffList = data;
        saveLocalStaff(data);
      }
    } catch (err) {
      console.warn('Supabase staff fetch fallback:', err);
    }
  }

  const bookings = await fetchAllBookings();
  return staffList.map(stf => {
    const assignedBookings = bookings.filter(b => b.staff_id === stf.id || b.staff_assigned === stf.name);
    const totalEvents = assignedBookings.length;
    const completedEvents = assignedBookings.filter(b => b.status === 'Completed').length;
    const activeEvents = assignedBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length;

    return {
      ...stf,
      totalEvents,
      completedEvents,
      activeEvents
    };
  });
};

export const addStaffMember = async (staffData) => {
  const newStaffPayload = {
    name: staffData.name,
    email: staffData.email || '',
    mobile: staffData.mobile,
    password: staffData.password || 'staff123',
    experience: staffData.experience || '5+ Years',
    address: staffData.address || '',
    skills: typeof staffData.skills === 'string' ? staffData.skills.split(',').map(s => s.trim()) : (staffData.skills || ['Safa Tying']),
    profile_photo: staffData.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  };


  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([newStaffPayload])
        .select()
        .single();
      if (!error && data) {
        const staffList = getLocalStaff();
        staffList.unshift(data);
        saveLocalStaff(staffList);
        return { success: true, staff: data };
      }
    } catch (err) {
      console.warn('Supabase add staff fallback:', err);
    }
  }

  const localStaff = { id: `stf-${Date.now()}`, ...newStaffPayload, created_at: new Date().toISOString() };
  const staffList = getLocalStaff();
  staffList.unshift(localStaff);
  saveLocalStaff(staffList);
  return { success: true, staff: localStaff };
};

export const updateStaffMember = async (staffId, updatedFields) => {
  if (typeof updatedFields.skills === 'string') {
    updatedFields.skills = updatedFields.skills.split(',').map(s => s.trim());
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('staff').update(updatedFields).eq('id', staffId);
    } catch (err) {
      console.warn('Supabase update staff fallback:', err);
    }
  }

  const staffList = getLocalStaff();
  const idx = staffList.findIndex(s => s.id === staffId);
  if (idx !== -1) {
    staffList[idx] = { ...staffList[idx], ...updatedFields };
    saveLocalStaff(staffList);
  }
  return { success: true };
};

export const deleteStaffMember = async (staffId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('staff').delete().eq('id', staffId);
    } catch (err) {
      console.warn('Supabase delete staff fallback:', err);
    }
  }

  let staffList = getLocalStaff();
  staffList = staffList.filter(s => s.id !== staffId);
  saveLocalStaff(staffList);
  return { success: true };
};

// Staff Assignment Engine
export const assignStaffToBooking = async (bookingId, staffId) => {
  const bookings = await fetchAllBookings();
  const staffList = await fetchStaffMembers();

  const bookingObj = bookings.find(b => b.id === bookingId || b.tracking_id === bookingId);
  const staffObj = staffList.find(s => s.id === staffId);

  if (bookingObj && staffObj) {
    const updatePayload = {
      staff_id: staffObj.id,
      staff_assigned: staffObj.name,
      staff_mobile: staffObj.mobile,
      staff_photo: staffObj.profile_photo,
      staff_experience: staffObj.experience,
      status: 'Staff Assigned'
    };

    await updateBookingInSupabase(bookingObj.id || bookingObj.tracking_id, updatePayload);


    const localBookings = getLocalBookings();
    const idx = localBookings.findIndex(b => b.id === bookingObj.id || b.tracking_id === bookingObj.tracking_id);
    if (idx !== -1) {
      localBookings[idx] = { ...localBookings[idx], ...updatePayload };
      saveLocalBookings(localBookings);
    }

    await addNotification('staff_assignment', 'Staff Artist Assigned', `${staffObj.name} assigned to booking ${bookingObj.tracking_id}.`);
    return { success: true, booking: { ...bookingObj, ...updatePayload } };
  }
  return { success: false, error: 'Booking or Staff not found' };
};

export const removeStaffAssignment = async (bookingId) => {
  const resetPayload = {
    staff_id: null,
    staff_assigned: null,
    staff_mobile: null,
    staff_photo: null,
    staff_experience: null,
    status: 'Confirmed'
  };

  await updateBookingInSupabase(bookingId, resetPayload);

  const bookings = getLocalBookings();
  const bookingIdx = bookings.findIndex(b => b.id === bookingId || b.tracking_id === bookingId);
  if (bookingIdx !== -1) {
    bookings[bookingIdx] = { ...bookings[bookingIdx], ...resetPayload };
    saveLocalBookings(bookings);
  }
  return { success: true };
};

// Staff Dashboard & Workflow
export const fetchStaffAssignedBookings = async (staffMobileOrEmail) => {
  const bookings = await fetchAllBookings();
  const staffList = await fetchStaffMembers();
  const staffMember = staffList.find(s => s.mobile === staffMobileOrEmail || s.name.includes('Vikram'));

  return bookings.filter(b => 
    b.staff_id === staffMember?.id ||
    b.staff_assigned === staffMember?.name ||
    b.staff_mobile === staffMobileOrEmail ||
    staffMobileOrEmail === 'staff@safaelegance.com' ||
    staffMobileOrEmail === '9829012345'
  );
};

export const updateStaffEventWorkflow = async (bookingId, action) => {
  let newStatus = 'Confirmed';
  if (action === 'accept') newStatus = 'Confirmed';
  if (action === 'start') newStatus = 'In Progress';
  if (action === 'complete') newStatus = 'Completed';

  await updateBookingInSupabase(bookingId, { status: newStatus });

  const bookings = getLocalBookings();
  const idx = bookings.findIndex(b => b.id === bookingId || b.tracking_id === bookingId);

  if (idx !== -1) {
    bookings[idx].status = newStatus;
    saveLocalBookings(bookings);
    if (action === 'complete') {
      await addNotification('event_completion', 'Wedding Event Completed', `Booking ${bookings[idx].tracking_id} marked complete by artist.`);
    }
    return { success: true, booking: bookings[idx] };
  }
  return { success: false };
};

// Booking Creation & Manager Helpers
export const createBooking = async (bookingData) => {
  const trackingId = generateTrackingId();
  
  const totalAmount = bookingData.services.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  const advanceAmount = Math.round(totalAmount * 0.20);
  const outstandingAmount = totalAmount - advanceAmount;

  const newBookingPayload = {
    tracking_id: trackingId,
    customer_name: bookingData.customerName,
    customer_email: bookingData.customerEmail || '',
    customer_mobile: bookingData.customerMobile,
    customer_alt_mobile: bookingData.customerAltMobile || '',
    venue: bookingData.venue,
    city: bookingData.city,
    event_date: bookingData.eventDate,
    event_time: bookingData.eventTime,
    status: 'pending',
    total_amount: totalAmount,
    advance_amount: advanceAmount,
    outstanding_amount: outstandingAmount
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([newBookingPayload])
        .select()
        .single();
      if (!error && data) {
        const currentBookings = getLocalBookings();
        currentBookings.unshift({ ...data, services: bookingData.services });
        saveLocalBookings(currentBookings);
        const notifTitle = `New Booking Received (${trackingId})`;
        const notifMsg = `${data.customer_name} placed booking for ${data.venue}, ${data.city}. Total: ₹${totalAmount.toLocaleString('en-IN')} | Advance: ₹${advanceAmount.toLocaleString('en-IN')} | Remaining Due: ₹${outstandingAmount.toLocaleString('en-IN')}`;
        await addNotification('new_booking', notifTitle, notifMsg);
        return { success: true, booking: { ...data, services: bookingData.services } };
      }
    } catch (err) {
      console.warn('Supabase create booking fallback:', err);
    }
  }

  const localBooking = {
    id: `bkg-${Date.now()}`,
    ...newBookingPayload,
    status: 'Pending',
    staff_id: null,
    staff_assigned: null,
    services: bookingData.services,
    created_at: new Date().toISOString()
  };

  const currentBookings = getLocalBookings();
  currentBookings.unshift(localBooking);
  saveLocalBookings(currentBookings);

  const notifTitle = `New Booking Received (${trackingId})`;
  const notifMsg = `${localBooking.customer_name} placed booking for ${localBooking.venue}, ${localBooking.city}. Total: ₹${totalAmount.toLocaleString('en-IN')} | Advance: ₹${advanceAmount.toLocaleString('en-IN')} | Remaining Due: ₹${outstandingAmount.toLocaleString('en-IN')}`;
  await addNotification('new_booking', notifTitle, notifMsg);
  return { success: true, booking: localBooking };
};

export const fetchAllBookings = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        saveLocalBookings(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch bookings fallback:', err);
    }
  }
  return getLocalBookings();
};

export const updateBookingStatus = async (bookingId, newStatus) => {
  await updateBookingInSupabase(bookingId, { status: newStatus });

  const bookings = getLocalBookings();
  const idx = bookings.findIndex(b => b.id === bookingId || b.tracking_id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = newStatus;
    saveLocalBookings(bookings);
    const targetBkg = bookings[idx];
    const dueAmt = targetBkg.outstanding_amount ?? (targetBkg.total_amount - (targetBkg.advance_amount || 0));
    const notifTitle = `Booking Status Updated (${targetBkg.tracking_id})`;
    const notifMsg = `${targetBkg.customer_name} - Status: ${newStatus} | Total: ₹${Number(targetBkg.total_amount).toLocaleString('en-IN')} | Advance: ₹${Number(targetBkg.advance_amount || 0).toLocaleString('en-IN')} | Remaining Due: ₹${Number(dueAmt).toLocaleString('en-IN')}`;
    await addNotification('payment_update', notifTitle, notifMsg);
  }
  return { success: true };
};

export const updateBookingDetails = async (bookingId, updatedFields) => {
  await updateBookingInSupabase(bookingId, updatedFields);


  const bookings = getLocalBookings();
  const idx = bookings.findIndex(b => b.id === bookingId || b.tracking_id === bookingId);
  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], ...updatedFields };
    saveLocalBookings(bookings);
  }
  return { success: true };
};

export const searchBooking = async ({ trackingId, mobile, eventDate }) => {
  let matches = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('bookings').select('*');
      if (trackingId && trackingId.trim()) {
        const cleanId = trackingId.trim();
        query = query.ilike('tracking_id', `%${cleanId}%`);
      } else if (mobile && mobile.trim()) {
        query = query.ilike('customer_mobile', `%${mobile.trim()}%`);
        if (eventDate) {
          query = query.eq('event_date', eventDate);
        }
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        matches = data;
      }
    } catch (err) {
      console.warn('Supabase search booking fallback:', err);
    }
  }

  if (matches.length === 0) {
    const localBookings = getLocalBookings();
    if (trackingId && trackingId.trim()) {
      const cleanId = trackingId.trim().toUpperCase();
      matches = localBookings.filter(b => b.tracking_id.toUpperCase().includes(cleanId));
    } else if (mobile && mobile.trim()) {
      matches = localBookings.filter(b => {
        const matchMobile = b.customer_mobile.includes(mobile.trim());
        const matchDate = eventDate ? b.event_date === eventDate : true;
        return matchMobile && matchDate;
      });
    }
  }

  const staffList = await fetchStaffMembers();

  return matches.map(bkg => {
    const stf = staffList.find(s => s.id === bkg.staff_id || s.name === bkg.staff_assigned);
    return {
      ...bkg,
      assignedStaffInfo: stf || (bkg.staff_assigned ? {
        name: bkg.staff_assigned,
        mobile: bkg.staff_mobile || '9829012345',
        experience: '8+ Years',
        profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      } : null)
    };
  });
};

export const fetchUserBookings = async (userEmailOrMobile) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`customer_mobile.eq.${userEmailOrMobile},customer_name.eq.${userEmailOrMobile}`)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase user bookings fetch fallback:', err);
    }
  }

  const localBookings = getLocalBookings();
  return localBookings.filter(
    b => b.customer_mobile === userEmailOrMobile || b.customer_name === userEmailOrMobile
  );
};

export const getDashboardMetrics = async () => {
  const bookings = await fetchAllBookings();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const todayEvents = bookings.filter(b => b.event_date === todayStr && b.status !== 'Cancelled').length;
  const upcomingEvents = bookings.filter(b => new Date(b.event_date) > new Date() && b.status !== 'Cancelled').length;
  
  const pendingPayments = bookings.reduce((sum, b) => {
    return b.status !== 'Cancelled' ? sum + Number(b.outstanding_amount || 0) : sum;
  }, 0);

  const totalRevenue = bookings.reduce((sum, b) => {
    return b.status !== 'Cancelled' ? sum + Number(b.total_amount || 0) : sum;
  }, 0);

  return {
    totalBookings,
    todayEvents,
    upcomingEvents,
    pendingPayments,
    totalRevenue,
    recentBookings: bookings.slice(0, 5)
  };
};

export const getCustomersCRM = async () => {
  const bookings = await fetchAllBookings();
  const customerMap = {};

  bookings.forEach(bkg => {
    const key = bkg.customer_mobile;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: bkg.customer_name,
        mobile: bkg.customer_mobile,
        bookingsCount: 0,
        totalSpent: 0,
        bookings: []
      };
    }
    customerMap[key].bookingsCount += 1;
    customerMap[key].totalSpent += Number(bkg.total_amount || 0);
    customerMap[key].bookings.push(bkg);
  });

  return Object.values(customerMap);
};

export const getPaymentLedger = async () => {
  const bookings = await fetchAllBookings();
  
  const totalAdvanceCollected = bookings.reduce((sum, b) => {
    return (b.status === 'Advance Received' || b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'advance_received' || b.status === 'confirmed' || b.status === 'completed') 
      ? sum + Number(b.advance_amount || 0) : sum;
  }, 0);

  const totalOutstandingBalance = bookings.reduce((sum, b) => {
    return (b.status !== 'Completed' && b.status !== 'completed' && b.status !== 'Cancelled' && b.status !== 'cancelled')
      ? sum + Number(b.outstanding_amount || 0) : sum;
  }, 0);

  const totalFullPayments = bookings.reduce((sum, b) => {
    return (b.status === 'Completed' || b.status === 'completed') ? sum + Number(b.total_amount || 0) : sum;
  }, 0);

  return {
    totalAdvanceCollected,
    totalOutstandingBalance,
    totalFullPayments,
    ledgerRecords: bookings
  };
};

export const fetchSalaryRecords = async (monthStr) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('salary_records').select('*').eq('month', monthStr);
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch salary records fallback:', err);
    }
  }
  return [];
};

export const saveSalaryRecord = async (recordData) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('salary_records').upsert(recordData, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase save salary record fallback:', err);
    }
  }
  return { success: true };
};


