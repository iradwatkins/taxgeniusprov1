import { supabase } from '@/lib/supabase'
import type { 
  ReferrerStats, 
  ReferralActivity, 
  ContestLeaderboardEntry, 
  Contest, 
  MarketingMaterial,
  Notification 
} from '@/lib/supabase'

export class ReferrerService {
  
  /**
   * Get comprehensive stats for a referrer dashboard
   */
  static async getReferrerStats(referrerId: string): Promise<ReferrerStats> {
    // Get current date and start of month for calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Get total referrals count
    const { count: totalReferrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', referrerId)
    
    // Get completed returns count
    const { count: completedReturns } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', referrerId)
      .eq('status', 'completed')
    
    // Get total earnings
    const { data: earningsData } = await supabase
      .from('referrals')
      .select('commission_earned')
      .eq('referrer_id', referrerId)
    
    const totalEarnings = earningsData?.reduce((sum, r) => sum + (r.commission_earned || 0), 0) || 0
    
    // Get referrals this month
    const { count: referralsThisMonth } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', referrerId)
      .gte('signup_date', startOfMonth.toISOString())
    
    // Get earnings this month
    const { data: monthlyEarningsData } = await supabase
      .from('referrals')
      .select('commission_earned')
      .eq('referrer_id', referrerId)
      .gte('signup_date', startOfMonth.toISOString())
    
    const earningsThisMonth = monthlyEarningsData?.reduce((sum, r) => sum + (r.commission_earned || 0), 0) || 0
    
    // Get contest rank (from active contests)
    const { data: contestRankData } = await supabase
      .from('contest_leaderboard')
      .select('rank, contests!inner(*)')
      .eq('referrer_id', referrerId)
      .eq('contests.is_active', true)
      .order('rank', { ascending: true })
      .limit(1)
    
    const contestRank = contestRankData?.[0]?.rank
    
    return {
      total_referrals: totalReferrals || 0,
      completed_returns: completedReturns || 0,
      total_earnings: totalEarnings,
      contest_rank: contestRank,
      referrals_this_month: referralsThisMonth || 0,
      earnings_this_month: earningsThisMonth
    }
  }
  
  /**
   * Get recent referral activity for dashboard
   */
  static async getRecentActivity(referrerId: string, limit: number = 10): Promise<ReferralActivity[]> {
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        commission_earned,
        signup_date,
        return_filed_date,
        status,
        profiles!referrals_client_id_fkey(first_name, last_name)
      `)
      .eq('referrer_id', referrerId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (!referrals) return []
    
    return referrals.map(referral => {
      const clientProfile = referral.profiles as { first_name?: string; last_name?: string } | null
      const clientName = clientProfile 
        ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() || 'Anonymous'
        : 'Anonymous'
      
      // Determine action and date based on referral status
      let action = 'Signed up'
      let date = referral.signup_date
      let amount = 50 // Base signup bonus
      
      if (referral.status === 'completed' && referral.return_filed_date) {
        action = 'Return filed'
        date = referral.return_filed_date
        amount = referral.commission_earned || 100
      }
      
      return {
        client_name: clientName,
        action,
        date,
        amount
      }
    })
  }
  
  /**
   * Get current contest leaderboard
   */
  static async getContestLeaderboard(limit: number = 10): Promise<ContestLeaderboardEntry[]> {
    // First get the active contest
    const { data: activeContest } = await supabase
      .from('contests')
      .select('id')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (!activeContest || activeContest.length === 0) {
      return []
    }
    
    const { data: leaderboard } = await supabase
      .from('contest_leaderboard')
      .select(`
        id,
        contest_id,
        referrer_id,
        rank,
        score,
        last_calculated,
        profiles!contest_leaderboard_referrer_id_fkey(first_name, last_name, vanity_slug)
      `)
      .eq('contest_id', activeContest[0].id)
      .order('rank', { ascending: true })
      .limit(limit)
    
    if (!leaderboard) return []
    
    return leaderboard.map(entry => ({
      id: entry.id,
      contest_id: entry.contest_id,
      referrer_id: entry.referrer_id,
      rank: entry.rank,
      score: entry.score,
      last_calculated: entry.last_calculated,
      referrer: entry.profiles as { first_name?: string; last_name?: string; vanity_slug?: string } | undefined
    }))
  }
  
  /**
   * Get active contests
   */
  static async getActiveContests(): Promise<Contest[]> {
    const { data: contests } = await supabase
      .from('contests')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return contests || []
  }
  
  /**
   * Get marketing materials
   */
  static async getMarketingMaterials(): Promise<MarketingMaterial[]> {
    const { data: materials } = await supabase
      .from('marketing_materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return materials || []
  }
  
  /**
   * Get user notifications
   */
  static async getNotifications(userId: string): Promise<Notification[]> {
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return notifications || []
  }
  
  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId)
  }
  
  /**
   * Mark notification as actioned
   */
  static async markNotificationAsActioned(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ 
        is_actioned: true, 
        actioned_at: new Date().toISOString() 
      })
      .eq('id', notificationId)
  }
  
  /**
   * Generate referral code for user
   */
  static generateReferralCode(userName: string): string {
    const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${cleanName}${randomSuffix}`
  }
  
  /**
   * Get referrer's vanity URL
   */
  static async getVanityUrl(referrerId: string): Promise<string | null> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('vanity_slug')
      .eq('id', referrerId)
      .single()
    
    return profile?.vanity_slug || null
  }
  
  /**
   * Set referrer's vanity slug
   */
  static async setVanitySlug(referrerId: string, slug: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ vanity_slug: slug })
        .eq('id', referrerId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }
  
  /**
   * Check if vanity slug is available
   */
  static async isVanitySlugAvailable(slug: string): Promise<boolean> {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('vanity_slug', slug)
      .limit(1)
    
    return !data || data.length === 0
  }
}