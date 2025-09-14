import { NextRequest, NextResponse } from 'next/server'
import { ReferrerService } from '@/lib/services/referrer.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const leaderboard = await ReferrerService.getContestLeaderboard(limit)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching contest leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}