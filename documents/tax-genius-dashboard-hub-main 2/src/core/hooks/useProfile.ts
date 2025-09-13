import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, UserProfile } from '@/lib/supabase'
import { useAuth } from '@/core/providers/AuthProvider'

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  phone?: string
  vanity_slug?: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - this is expected for new users
          return null
        }
        throw error
      }

      return data
    },
    enabled: !!user?.id,
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: UpdateProfileData): Promise<UserProfile> => {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Update the cache
      queryClient.setQueryData(['profile', user?.id], data)
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
  })

  // Check vanity slug availability
  const checkVanitySlugAvailability = async (slug: string): Promise<boolean> => {
    if (!slug.trim()) return false

    const { data, error } = await supabase
      .from('profiles')
      .select('vanity_slug')
      .eq('vanity_slug', slug.toLowerCase().trim())
      .maybeSingle()

    if (error) {
      console.error('Error checking vanity slug:', error)
      return false
    }

    // Return true if no existing profile found with this slug
    return !data
  }

  // Set vanity slug (for referrers)
  const setVanitySlug = async (slug: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanSlug = slug.toLowerCase().trim()
      
      // Validate slug format (alphanumeric and hyphens only)
      if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
        return { success: false, error: 'Vanity URL can only contain letters, numbers, and hyphens' }
      }

      // Check availability
      const isAvailable = await checkVanitySlugAvailability(cleanSlug)
      if (!isAvailable) {
        return { success: false, error: 'This vanity URL is already taken' }
      }

      // Update profile
      await updateProfileMutation.mutateAsync({ vanity_slug: cleanSlug })
      return { success: true }
    } catch (error) {
      console.error('Error setting vanity slug:', error)
      return { success: false, error: 'Failed to set vanity URL' }
    }
  }

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileLoading: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    checkVanitySlugAvailability,
    setVanitySlug,
  }
}