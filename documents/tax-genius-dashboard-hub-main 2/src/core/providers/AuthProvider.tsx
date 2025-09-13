import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, AuthUser, UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signUp: (email: string, password: string, role: 'client' | 'referrer' | 'preparer') => Promise<{ data: unknown; error: unknown }>
  signInWithMagicLink: (email: string) => Promise<{ data: unknown; error: unknown }>
  signInWithGoogle: () => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<{ error: unknown }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected for new users
        console.error('Error loading user profile:', error)
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        role: profile?.role,
        profile: profile || undefined
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUser({
        id: authUser.id,
        email: authUser.email || ''
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return result
  }

  const signUp = async (email: string, password: string, role: 'client' | 'referrer' | 'preparer') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data.user && !error) {
      // Create user profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: data.user.id,
            role: role,
          },
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    return { data, error }
  }

  const signInWithMagicLink = async (email: string) => {
    const result = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return result
  }

  const signInWithGoogle = async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    return result
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}