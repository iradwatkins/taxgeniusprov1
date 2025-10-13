'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@/lib/auth'

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'client',
    label: 'Tax Client',
    description: 'I need tax preparation services',
  },
  {
    value: 'tax_preparer',
    label: 'Tax Preparer',
    description: 'I prepare taxes and want customized marketing materials',
  },
  {
    value: 'affiliate',
    label: 'Affiliate Marketer',
    description: 'I want to market tax services and earn referral commissions',
  },
  {
    value: 'referrer',
    label: 'Referrer',
    description: 'I refer clients to Tax Genius Pro',
  },
]

export default function SelectRolePage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return

    setIsLoading(true)
    setError(null)

    try {
      await user.update({
        publicMetadata: {
          role: selectedRole,
        },
      })

      // Redirect to role-specific dashboard
      const dashboardUrls: Record<UserRole, string> = {
        super_admin: '/dashboard/admin',
        admin: '/dashboard/admin',
        client: '/dashboard/client',
        tax_preparer: '/dashboard/tax-preparer',
        referrer: '/dashboard/referrer',
        affiliate: '/dashboard/affiliate',
      }

      router.push(dashboardUrls[selectedRole])
    } catch (err) {
      console.error('Error updating role:', err)
      setError('Failed to update role. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
          <CardDescription>
            Choose the option that best describes how you'll use Tax Genius Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`rounded-lg border-2 p-6 text-left transition-all hover:border-primary ${
                  selectedRole === role.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                disabled={isLoading}
              >
                <h3 className="mb-2 font-semibold">{role.label}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Setting up your account...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
