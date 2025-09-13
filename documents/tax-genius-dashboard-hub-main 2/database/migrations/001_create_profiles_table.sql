-- Create profiles table for user role management
-- This table links to the auth.users table and stores additional user information

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'referrer', 'preparer')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    vanity_slug TEXT UNIQUE, -- For referrer custom URLs like TaxGenius.com/YourName
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one profile per user
    UNIQUE(user_id)
);

-- Create an index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- Create an index on role for filtering by user type
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Create an index on vanity_slug for referrer URL lookups
CREATE INDEX IF NOT EXISTS profiles_vanity_slug_idx ON public.profiles(vanity_slug);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at field
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();