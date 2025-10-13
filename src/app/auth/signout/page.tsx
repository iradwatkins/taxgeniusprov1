'use client'

import { useEffect } from 'react'
import { useClerk } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function SignOutPage() {
  const { signOut } = useClerk()

  useEffect(() => {
    // Sign out and redirect
    signOut({
      redirectUrl: '/auth/login',
    })
  }, [signOut])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="text-2xl font-semibold">Signing out...</h2>
        <p className="text-muted-foreground">Please wait while we sign you out</p>
      </div>
    </div>
  )
}
