'use client'

/**
 * Username Manager Component
 *
 * Reusable component for claiming and managing short link usernames
 * Can be embedded in any dashboard
 *
 * Features:
 * - Real-time availability checking
 * - Smart username suggestions
 * - Copy-to-clipboard for short URLs
 * - One-time change enforcement
 *
 * Part of Epic 6: Lead Tracking Dashboard Enhancement
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Loader2, Copy, Check, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface UsernameManagerProps {
  className?: string
  onSuccess?: (username: string) => void
}

interface UsernameInfo {
  username: string | null
  hasUsername: boolean
  canChange: boolean
  leadUrl: string | null
  intakeUrl: string | null
}

interface CheckResult {
  available: boolean
  username: string
  suggestions?: string[]
  error?: string
}

export function UsernameManager({ className, onSuccess }: UsernameManagerProps) {
  const [usernameInfo, setUsernameInfo] = useState<UsernameInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [checking, setChecking] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch current username info on mount
  useEffect(() => {
    fetchUsernameInfo()
  }, [])

  const fetchUsernameInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/username/info')

      if (!response.ok) {
        throw new Error('Failed to fetch username info')
      }

      const data = await response.json()
      setUsernameInfo(data)

      if (data.username) {
        setInputValue(data.username)
      }
    } catch (err) {
      logger.error('Failed to fetch username info', { error: err })
      setError('Failed to load username information')
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setCheckResult(null)
      return
    }

    try {
      setChecking(true)
      setCheckResult(null)

      const response = await fetch(`/api/username/check?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      setCheckResult(data)
    } catch (err) {
      logger.error('Failed to check username', { error: err })
      setCheckResult({
        available: false,
        username,
        error: 'Failed to check availability'
      })
    } finally {
      setChecking(false)
    }
  }

  const claimUsername = async () => {
    if (!inputValue) return

    try {
      setClaiming(true)
      setError(null)

      const response = await fetch('/api/username/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim username')
      }

      // Refresh username info
      await fetchUsernameInfo()

      // Clear check result
      setCheckResult(null)

      // Call success callback
      onSuccess?.(data.username)

      logger.info('Username claimed successfully', { username: data.username })
    } catch (err: any) {
      setError(err.message || 'Failed to claim username')
      logger.error('Failed to claim username', { error: err })
    } finally {
      setClaiming(false)
    }
  }

  const copyToClipboard = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(type)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      logger.error('Failed to copy to clipboard', { error: err })
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setError(null)

    // Debounced availability check
    const timeoutId = setTimeout(() => {
      if (value && value !== usernameInfo?.username) {
        checkAvailability(value)
      } else {
        setCheckResult(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Short Link Username</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Display mode: User already has username
  if (usernameInfo?.hasUsername && !usernameInfo.canChange) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Short Links</CardTitle>
          <CardDescription>
            Share these links to track leads and earn commissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username Display */}
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p className="text-lg font-semibold">{usernameInfo.username}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>

          {/* Lead Generation Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Lead Generation Link</label>
            <div className="flex space-x-2">
              <Input
                value={usernameInfo.leadUrl || ''}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(usernameInfo.leadUrl!, 'lead')}
              >
                {copiedUrl === 'lead' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(usernameInfo.leadUrl!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to generate customer leads
            </p>
          </div>

          {/* Tax Intake Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tax Intake Link</label>
            <div className="flex space-x-2">
              <Input
                value={usernameInfo.intakeUrl || ''}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(usernameInfo.intakeUrl!, 'intake')}
              >
                {copiedUrl === 'intake' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(usernameInfo.intakeUrl!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link for direct tax filing intake
            </p>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              Your username is permanent and cannot be changed. If you need assistance, contact support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Claim mode: User needs to claim username
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Claim Your Short Link Username</CardTitle>
        <CardDescription>
          Choose a unique username for your personalized referral links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Username Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="johnsmith"
                className="pr-10"
                disabled={claiming}
              />
              {checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {checkResult && !checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkResult.available ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={claimUsername}
              disabled={!checkResult?.available || claiming || checking}
            >
              {claiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim'
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Only lowercase letters, numbers, and underscores. 3-30 characters.
          </p>
        </div>

        {/* Availability Status */}
        {checkResult && !checking && (
          <div className={cn(
            'p-3 rounded-lg border',
            checkResult.available
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
          )}>
            <p className={cn(
              'text-sm font-medium',
              checkResult.available ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
            )}>
              {checkResult.available ? '✓ Available' : '✗ Not Available'}
            </p>
            {checkResult.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {checkResult.error}
              </p>
            )}
          </div>
        )}

        {/* Suggestions */}
        {checkResult?.suggestions && checkResult.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {checkResult.suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(suggestion)
                    checkAvailability(suggestion)
                  }}
                  className="font-mono"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        {inputValue && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground">Your links will be:</p>
            <div className="space-y-1 font-mono text-xs">
              <p className="text-muted-foreground">
                Lead: <span className="text-foreground">taxgeniuspro.tax/lead/{inputValue}</span>
              </p>
              <p className="text-muted-foreground">
                Intake: <span className="text-foreground">taxgeniuspro.tax/intake/{inputValue}</span>
              </p>
            </div>
          </div>
        )}

        {usernameInfo?.canChange && (
          <Alert>
            <AlertDescription className="text-sm">
              You can only change your username once. Choose carefully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
