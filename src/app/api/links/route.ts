/**
 * Short Links API
 *
 * GET /api/links - Get all user's short links
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserShortLinks } from '@/lib/services/short-link.service'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get profile
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get user's short links
    const links = await getUserShortLinks(profile.id)

    return NextResponse.json({
      success: true,
      data: links,
      count: links.length,
    })
  } catch (error) {
    logger.error('Error fetching short links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
