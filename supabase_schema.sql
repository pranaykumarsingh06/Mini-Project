-- ==========================================================
-- VOYAGE - Supabase Database Tables Schema Migration
-- Project ID: awdvvaxglwbejfxnvngu
-- Copy & paste this into Supabase Dashboard -> SQL Editor -> Run
-- ==========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRIPS & ITINERARIES TABLE
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

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    destination TEXT NOT NULL,
    booking_type TEXT DEFAULT 'Hotel & Flight',
    amount BIGINT DEFAULT 18500,
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) & Public Insert Policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select users" ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow public insert trips" ON public.trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select trips" ON public.trips FOR SELECT USING (true);

CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select bookings" ON public.bookings FOR SELECT USING (true);
