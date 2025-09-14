import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { ReferrerService } from '@/lib/services/referrer.service'
import { withErrorHandler, createServiceUnavailableError } from '@/lib/api-error-handler'

export const GET = withErrorHandler(async function(request: NextRequest) {
  const { profile } = await requireRole('REFERRER')

  try {
    const stats = await ReferrerService.getReferrerStats(profile.id)
    return NextResponse.json(stats)
  } catch (error) {
    // If ReferrerService fails (likely Redis or DB issue), provide fallback
    console.warn('ReferrerService failed, using fallback:', error)

    // Throw service unavailable error that will be handled by withErrorHandler
    throw createServiceUnavailableError('Statistics service')
  }
})