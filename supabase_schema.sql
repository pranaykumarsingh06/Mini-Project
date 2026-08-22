-- ==========================================================
-- VOYAGE - Supabase Database Setup Script (1-Click SQL)
-- Project ID: awdvvaxglwbejfxnvngu
-- Copy & paste all of this into Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==========================================================

-- 1. USER LOGINS TRACKING TABLE (Tracks every login attempt)
CREATE TABLE IF NOT EXISTS public.user_logins (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Success'
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRIPS & ITINERARIES TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    destination TEXT NOT NULL,
    budget BIGINT DEFAULT 25000,
    travel_dates TEXT DEFAULT 'Dec 2026',
    companion TEXT DEFAULT 'Family Vacation',
    status TEXT DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    destination TEXT NOT NULL,
    booking_type TEXT DEFAULT 'Hotel & Flight',
    amount BIGINT DEFAULT 18500,
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disable Row Level Security (RLS) so PostgREST API can insert/read instantly
ALTER TABLE public.user_logins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
