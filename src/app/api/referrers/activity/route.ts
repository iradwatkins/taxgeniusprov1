import { NextRequest, NextResponse } from 'next/server'
import { requireOneOfRoles } from '@/lib/auth'
import { ReferrerService } from '@/lib/services/referrer.service'

export async function GET(request: NextRequest) {
  try {
    // Allow both referrer and affiliate roles to access activity
    const { profile } = await requireOneOfRoles(['referrer', 'affiliate'])

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const activity = await ReferrerService.getRecentActivity(profile.id, limit)

    return NextResponse.json(activity)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Error fetching referrer activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}