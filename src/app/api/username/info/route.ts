/**
 * Username Info API
 *
 * GET /api/username/info
 * Returns current username info for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { getUsernameInfo } from '@/lib/services/username.service'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Get username info
    const info = await getUsernameInfo(profile.id)

    if (!info) {
      return NextResponse.json(
        { error: 'Failed to retrieve username info' },
        { status: 500 }
      )
    }

    return NextResponse.json(info, { status: 200 })
  } catch (error) {
    logger.error('Error in username info API', { error })
    return NextResponse.json(
      { error: 'Failed to retrieve username info' },
      { status: 500 }
    )
  }
}
