/**
 * Admin Analytics Overview API
 *
 * GET /api/admin/analytics/overview
 * Returns platform-wide performance metrics and overview stats
 *
 * Part of Epic 6: Lead Tracking Dashboard Enhancement - Story 6.3
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { logger } from '@/lib/logger'
import {
  getPlatformOverview,
  parseDateRange,
} from '@/lib/services/admin-analytics.service'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or super admin
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const role = user.publicMetadata?.role as string

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const dateRangeParam = url.searchParams.get('dateRange') || 'month'
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')

    // Parse date range
    let dateRange
    if (startDateParam && endDateParam) {
      dateRange = {
        start: new Date(startDateParam),
        end: new Date(endDateParam),
      }
    } else {
      dateRange = parseDateRange(dateRangeParam)
    }

    // Get platform overview
    const overview = await getPlatformOverview(dateRange)

    // Get breakdowns for different time periods
    const breakdowns = {
      today: await getPlatformOverview(parseDateRange('today')),
      thisWeek: await getPlatformOverview(parseDateRange('week')),
      thisMonth: await getPlatformOverview(parseDateRange('month')),
      allTime: await getPlatformOverview(),
    }

    return NextResponse.json({
      overview,
      breakdowns,
      dateRange: {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Admin analytics overview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overview metrics' },
      { status: 500 }
    )
  }
}
