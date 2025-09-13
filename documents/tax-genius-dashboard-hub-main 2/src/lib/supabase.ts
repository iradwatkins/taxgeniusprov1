import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our authentication
export type AuthUser = {
  id: string
  email: string
  role?: 'client' | 'referrer' | 'preparer'
  profile?: UserProfile
}

export type UserProfile = {
  id: string
  user_id: string
  role: 'client' | 'referrer' | 'preparer'
  first_name?: string
  last_name?: string
  phone?: string
  vanity_slug?: string
  created_at: string
  updated_at: string
}

// Types for referrer system
export type Referral = {
  id: string
  referrer_id: string
  client_id: string
  referral_code: string
  signup_date: string
  status: 'pending' | 'active' | 'completed' | 'inactive'
  return_filed_date?: string
  commission_earned: number
  created_at: string
  updated_at: string
}

export type ReferralAnalytics = {
  id: string
  referrer_id: string
  event_type: 'link_click' | 'signup' | 'return_filed' | 'commission_earned'
  event_date: string
  referral_id?: string
  ip_address?: string
  user_agent?: string
  referral_source?: string
  metadata: Record<string, unknown>
  created_at: string
}

export type Contest = {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  contest_type: 'most_referrals' | 'most_returns' | 'highest_earnings'
  prize_description?: string
  rules: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContestLeaderboardEntry = {
  id: string
  contest_id: string
  referrer_id: string
  rank: number
  score: number
  last_calculated: string
  referrer?: {
    first_name?: string
    last_name?: string
    vanity_slug?: string
  }
}

export type MarketingMaterial = {
  id: string
  title: string
  description?: string
  material_type: 'image' | 'text' | 'video' | 'template'
  image_url?: string
  ad_copy?: string
  template_html?: string
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: 'trip_reward' | 'contest_win' | 'milestone' | 'general'
  title: string
  message: string
  action_url?: string
  action_label?: string
  is_read: boolean
  is_actioned: boolean
  metadata: Record<string, unknown>
  created_at: string
  read_at?: string
  actioned_at?: string
}

// Aggregated data types for dashboard
export type ReferrerStats = {
  total_referrals: number
  completed_returns: number
  total_earnings: number
  contest_rank?: number
  referrals_this_month: number
  earnings_this_month: number
}

export type ReferralActivity = {
  client_name: string
  action: string
  date: string
  amount: number
}