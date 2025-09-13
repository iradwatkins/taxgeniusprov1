import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ReferrerService } from '@/services/referrerService'
import type { 
  ReferrerStats, 
  ReferralActivity, 
  ContestLeaderboardEntry, 
  Contest, 
  MarketingMaterial,
  Notification 
} from '@/lib/supabase'

// Query keys
export const referrerQueryKeys = {
  all: ['referrer'] as const,
  stats: (referrerId: string) => [...referrerQueryKeys.all, 'stats', referrerId] as const,
  activity: (referrerId: string) => [...referrerQueryKeys.all, 'activity', referrerId] as const,
  leaderboard: () => [...referrerQueryKeys.all, 'leaderboard'] as const,
  contests: () => [...referrerQueryKeys.all, 'contests'] as const,
  materials: () => [...referrerQueryKeys.all, 'materials'] as const,
  notifications: (userId: string) => [...referrerQueryKeys.all, 'notifications', userId] as const,
  vanityUrl: (referrerId: string) => [...referrerQueryKeys.all, 'vanityUrl', referrerId] as const,
}

/**
 * Hook to get referrer dashboard statistics
 */
export function useReferrerStats(referrerId: string | undefined) {
  return useQuery<ReferrerStats>({
    queryKey: referrerQueryKeys.stats(referrerId || ''),
    queryFn: () => ReferrerService.getReferrerStats(referrerId!),
    enabled: !!referrerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get recent referral activity
 */
export function useRecentActivity(referrerId: string | undefined, limit: number = 10) {
  return useQuery<ReferralActivity[]>({
    queryKey: referrerQueryKeys.activity(referrerId || ''),
    queryFn: () => ReferrerService.getRecentActivity(referrerId!, limit),
    enabled: !!referrerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get contest leaderboard
 */
export function useContestLeaderboard(limit: number = 10) {
  return useQuery<ContestLeaderboardEntry[]>({
    queryKey: referrerQueryKeys.leaderboard(),
    queryFn: () => ReferrerService.getContestLeaderboard(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get active contests
 */
export function useActiveContests() {
  return useQuery<Contest[]>({
    queryKey: referrerQueryKeys.contests(),
    queryFn: () => ReferrerService.getActiveContests(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get marketing materials
 */
export function useMarketingMaterials() {
  return useQuery<MarketingMaterial[]>({
    queryKey: referrerQueryKeys.materials(),
    queryFn: () => ReferrerService.getMarketingMaterials(),
    staleTime: 30 * 60 * 1000, // 30 minutes - materials don't change often
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to get user notifications
 */
export function useNotifications(userId: string | undefined) {
  return useQuery<Notification[]>({
    queryKey: referrerQueryKeys.notifications(userId || ''),
    queryFn: () => ReferrerService.getNotifications(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch notifications when returning to app
  })
}

/**
 * Hook to get vanity URL
 */
export function useVanityUrl(referrerId: string | undefined) {
  return useQuery<string | null>({
    queryKey: referrerQueryKeys.vanityUrl(referrerId || ''),
    queryFn: () => ReferrerService.getVanityUrl(referrerId!),
    enabled: !!referrerId,
    staleTime: 60 * 60 * 1000, // 1 hour - vanity URLs don't change often
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => ReferrerService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: referrerQueryKeys.all })
    },
  })
}

/**
 * Hook to mark notification as actioned
 */
export function useMarkNotificationAsActioned() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => ReferrerService.markNotificationAsActioned(notificationId),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({ queryKey: referrerQueryKeys.all })
    },
  })
}

/**
 * Hook to set vanity slug
 */
export function useSetVanitySlug() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ referrerId, slug }: { referrerId: string; slug: string }) => 
      ReferrerService.setVanitySlug(referrerId, slug),
    onSuccess: (_, variables) => {
      // Invalidate vanity URL query for this referrer
      queryClient.invalidateQueries({ 
        queryKey: referrerQueryKeys.vanityUrl(variables.referrerId) 
      })
    },
  })
}

/**
 * Hook to check vanity slug availability
 */
export function useCheckVanitySlugAvailability() {
  return useMutation({
    mutationFn: (slug: string) => ReferrerService.isVanitySlugAvailable(slug),
  })
}

/**
 * Hook to refresh all referrer data
 */
export function useRefreshReferrerData(referrerId: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // Invalidate all referrer-related queries
      await queryClient.invalidateQueries({ queryKey: referrerQueryKeys.all })
      
      // Optionally refetch critical data immediately
      if (referrerId) {
        await Promise.all([
          queryClient.refetchQueries({ queryKey: referrerQueryKeys.stats(referrerId) }),
          queryClient.refetchQueries({ queryKey: referrerQueryKeys.activity(referrerId) }),
        ])
      }
      
      if (userId) {
        await queryClient.refetchQueries({ queryKey: referrerQueryKeys.notifications(userId) })
      }
    },
  })
}