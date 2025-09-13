-- Enable Row Level Security (RLS) on the profiles table
-- This ensures users can only access their own profile data

-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users cannot delete their own profile (prevent accidental deletion)
-- If deletion is needed, it should be done through a secure admin function
CREATE POLICY "Prevent profile deletion" 
ON public.profiles 
FOR DELETE 
USING (false);

-- Policy: Allow service role to manage all profiles (for admin functions)
CREATE POLICY "Service role can manage all profiles" 
ON public.profiles 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Additional policy: Referrers can view other referrers' public information for leaderboards
-- This will be used for the contest/leaderboard system in Epic 2
CREATE POLICY "Referrers can view public referrer data" 
ON public.profiles 
FOR SELECT 
USING (
    role = 'referrer' 
    AND auth.uid() IN (
        SELECT user_id FROM public.profiles WHERE role = 'referrer'
    )
);