import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { ReferrerService } from '@/lib/services/referrer.service'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireRole('REFERRER')

    const stats = await ReferrerService.getReferrerStats(profile.id)

    return NextResponse.json(stats)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Error fetching referrer stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}