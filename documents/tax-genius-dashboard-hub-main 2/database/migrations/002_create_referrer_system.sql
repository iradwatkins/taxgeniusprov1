-- Create referrer tracking system tables
-- This migration adds tables for tracking referrals, contests, and marketing materials

-- Table for tracking referral relationships
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    referral_code TEXT NOT NULL,
    signup_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'inactive')),
    return_filed_date TIMESTAMP WITH TIME ZONE,
    commission_earned DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure unique referral relationship
    UNIQUE(referrer_id, client_id)
);

-- Table for tracking referral link clicks and analytics
CREATE TABLE IF NOT EXISTS public.referral_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('link_click', 'signup', 'return_filed', 'commission_earned')),
    event_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referral_source TEXT, -- 'direct', 'social', 'qr_code', etc.
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for contests and leaderboards
CREATE TABLE IF NOT EXISTS public.contests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    contest_type TEXT NOT NULL CHECK (contest_type IN ('most_referrals', 'most_returns', 'highest_earnings')),
    prize_description TEXT,
    rules JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for contest leaderboard entries (calculated periodically)
CREATE TABLE IF NOT EXISTS public.contest_leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rank INTEGER NOT NULL,
    score DECIMAL(10, 2) NOT NULL, -- referrals count, earnings amount, etc.
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Unique constraint for contest-referrer pairs
    UNIQUE(contest_id, referrer_id)
);

-- Table for marketing materials
CREATE TABLE IF NOT EXISTS public.marketing_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL CHECK (material_type IN ('image', 'text', 'video', 'template')),
    image_url TEXT,
    ad_copy TEXT,
    template_html TEXT,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('trip_reward', 'contest_win', 'milestone', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_label TEXT,
    is_read BOOLEAN DEFAULT false,
    is_actioned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    actioned_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_client_id_idx ON public.referrals(client_id);
CREATE INDEX IF NOT EXISTS referrals_status_idx ON public.referrals(status);
CREATE INDEX IF NOT EXISTS referrals_signup_date_idx ON public.referrals(signup_date);

CREATE INDEX IF NOT EXISTS referral_analytics_referrer_id_idx ON public.referral_analytics(referrer_id);
CREATE INDEX IF NOT EXISTS referral_analytics_event_type_idx ON public.referral_analytics(event_type);
CREATE INDEX IF NOT EXISTS referral_analytics_event_date_idx ON public.referral_analytics(event_date);

CREATE INDEX IF NOT EXISTS contests_is_active_idx ON public.contests(is_active);
CREATE INDEX IF NOT EXISTS contests_date_range_idx ON public.contests(start_date, end_date);

CREATE INDEX IF NOT EXISTS contest_leaderboard_contest_id_idx ON public.contest_leaderboard(contest_id);
CREATE INDEX IF NOT EXISTS contest_leaderboard_rank_idx ON public.contest_leaderboard(contest_id, rank);

CREATE INDEX IF NOT EXISTS marketing_materials_type_idx ON public.marketing_materials(material_type);
CREATE INDEX IF NOT EXISTS marketing_materials_active_idx ON public.marketing_materials(is_active);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications(type);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);

-- Add triggers for updated_at timestamps
CREATE TRIGGER referrals_updated_at
    BEFORE UPDATE ON public.referrals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER contests_updated_at
    BEFORE UPDATE ON public.contests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER marketing_materials_updated_at
    BEFORE UPDATE ON public.marketing_materials
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create RLS (Row Level Security) policies
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals table
CREATE POLICY "Users can view their own referrals as referrer" ON public.referrals
    FOR SELECT USING (referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own referrals as client" ON public.referrals
    FOR SELECT USING (client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert referrals for themselves" ON public.referrals
    FOR INSERT WITH CHECK (referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own referrals" ON public.referrals
    FOR UPDATE USING (referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for referral analytics table
CREATE POLICY "Users can view their own analytics" ON public.referral_analytics
    FOR SELECT USING (referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own analytics" ON public.referral_analytics
    FOR INSERT WITH CHECK (referrer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for contest leaderboard (read-only for users)
CREATE POLICY "Users can view contest leaderboards" ON public.contest_leaderboard
    FOR SELECT USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Marketing materials are public read-only
ALTER TABLE public.marketing_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active marketing materials" ON public.marketing_materials
    FOR SELECT USING (is_active = true);

-- Contests are public read-only
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active contests" ON public.contests
    FOR SELECT USING (is_active = true);

-- Insert sample marketing materials
INSERT INTO public.marketing_materials (title, description, material_type, image_url, ad_copy, tags) VALUES
    ('Tax Season Social Media Post', 'General tax preparation promotion', 'image', 'https://placehold.co/800x600/1e3a8a/ffffff/png?text=Tax+Genius+Social', 'Save time and money this tax season with Tax Genius! Get your refund faster with our expert preparation services. #TaxGenius #TaxPrep #GetYourRefund', ARRAY['social', 'general', 'tax-prep']),
    ('Referral Bonus Announcement', 'Promote the referral program benefits', 'image', 'https://placehold.co/800x600/10b981/ffffff/png?text=Refer+%26+Earn', 'Refer friends and family to Tax Genius and earn $50 for every successful referral! Plus, they get a discount on their tax preparation. Win-Win! #ReferralBonus #TaxGenius', ARRAY['referral', 'bonus', 'social']),
    ('End of Tax Season Rush', 'Urgency-driven marketing for deadline approach', 'image', 'https://placehold.co/800x600/dc2626/ffffff/png?text=Deadline+Approaching', 'Don''t wait until the last minute! Tax deadline is approaching fast. Get your taxes done professionally with Tax Genius today! #TaxDeadline #LastChance #TaxGenius', ARRAY['urgent', 'deadline', 'tax-prep']),
    ('Free Consultation Offer', 'Promote free initial consultation', 'text', null, 'Get a FREE tax consultation with Tax Genius! Our certified professionals will review your situation and help you maximize your refund. Book your appointment today!', ARRAY['free', 'consultation', 'offer']);

-- Insert sample contest
INSERT INTO public.contests (title, description, start_date, end_date, contest_type, prize_description, rules) VALUES
    ('Monthly Referral Challenge', 'Compete to refer the most clients this month and win amazing prizes!', 
     date_trunc('month', CURRENT_DATE), 
     (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day'),
     'most_referrals', 
     '🏆 1st Place: $500 cash bonus + Trip to Las Vegas
🥈 2nd Place: $300 cash bonus  
🥉 3rd Place: $150 cash bonus',
     '{"min_referrals": 5, "must_be_completed_returns": true, "qualification_period": "current_month"}'::jsonb);