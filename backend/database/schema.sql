-- ==========================================
-- SAFA ELEGANCE - DATABASE SCHEMA (STAGE 1-4)
-- ==========================================

-- 1. ENUMS FOR USER ROLES & STATUSES
CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin', 'staff');
CREATE TYPE booking_status AS ENUM ('pending', 'awaiting_advance', 'advance_received', 'staff_assigned', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE salary_status AS ENUM ('pending', 'paid');
CREATE TYPE notification_type AS ENUM ('new_booking', 'payment_update', 'staff_assignment', 'event_completion');

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role DEFAULT 'customer',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100) DEFAULT 'Safa',
    image_url TEXT,
    hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STAFF TABLE
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    password VARCHAR(255) DEFAULT 'staff123',
    experience VARCHAR(50) DEFAULT '5+ Years',
    address TEXT,
    skills TEXT[],
    profile_photo TEXT,
    base_salary DECIMAL(10,2) DEFAULT 15000.00,
    per_event_pay DECIMAL(10,2) DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    customer_alt_mobile VARCHAR(20),
    venue VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    status booking_status DEFAULT 'pending',
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    advance_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    outstanding_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SALARY RECORDS TABLE (MICRO TASK 4.1)
CREATE TABLE IF NOT EXISTS public.salary_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    base_salary DECIMAL(10,2) DEFAULT 0.00,
    per_event_pay DECIMAL(10,2) DEFAULT 0.00,
    events_count INT DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    total_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status salary_status DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. WEBSITE SETTINGS CMS TABLE (MICRO TASK 4.4 & 4.5)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) DEFAULT 'Safa Elegance',
    contact_phone VARCHAR(20) DEFAULT '9876543210',
    whatsapp_number VARCHAR(20) DEFAULT '919876543210',
    business_address TEXT DEFAULT 'Heritage Palace Road, Jaipur, Rajasthan',
    logo_url TEXT,
    instagram_url TEXT DEFAULT 'https://instagram.com/safaelegance',
    facebook_url TEXT DEFAULT 'https://facebook.com/safaelegance',
    twitter_url TEXT DEFAULT 'https://x.com/safaelegance',
    youtube_url TEXT DEFAULT 'https://youtube.com/@safaelegance',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. NOTIFICATIONS TABLE (MICRO TASK 4.6)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) HARDENING (TASK 4.7)
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services & website settings
CREATE POLICY "Public Services Read" ON public.services FOR SELECT USING (hidden = FALSE);
CREATE POLICY "Public Website Settings Read" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public Booking Insert" ON public.bookings FOR INSERT WITH CHECK (true);
