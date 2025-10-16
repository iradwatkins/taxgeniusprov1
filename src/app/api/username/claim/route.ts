/**
 * Username Claim API
 *
 * POST /api/username/claim
 * Body: { username: string }
 * Claims username for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { claimUsername } from '@/lib/services/username.service'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Claim username
    const result = await claimUsername(profile.id, username)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, canChange: result.canChange },
        { status: 400 }
      )
    }

    logger.info('Username claimed via API', {
      userId,
      profileId: profile.id,
      username: result.username
    })

    return NextResponse.json(
      {
        success: true,
        username: result.username,
        shortUrl: result.shortUrl,
        leadUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/lead/${result.username}`,
        intakeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}/intake/${result.username}`
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Error in username claim API', { error })
    return NextResponse.json(
      { error: 'Failed to claim username' },
      { status: 500 }
    )
  }
}
