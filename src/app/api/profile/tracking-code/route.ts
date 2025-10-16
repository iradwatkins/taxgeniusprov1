/**
 * Tracking Code API
 *
 * GET: Get current user's tracking code data
 * PATCH: Customize tracking code (one-time only)
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import {
  getUserTrackingCode,
  customizeTrackingCode,
  validateCustomTrackingCode,
  isTrackingCodeAvailable,
} from '@/lib/services/tracking-code.service'

/**
 * GET: Get user's current tracking code
 */
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

    // Get tracking code data
    const trackingData = await getUserTrackingCode(profile.id)

    if (!trackingData) {
      return NextResponse.json(
        { error: 'Tracking code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: trackingData,
    })
  } catch (error) {
    logger.error('Error getting tracking code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH: Customize tracking code (one-time only)
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await req.json()
    const { customCode } = body

    if (!customCode || typeof customCode !== 'string') {
      return NextResponse.json(
        { error: 'Custom code is required and must be a string' },
        { status: 400 }
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

    // Customize tracking code
    const result = await customizeTrackingCode(
      profile.id,
      customCode.trim(),
      process.env.NEXT_PUBLIC_APP_URL || 'https://taxgeniuspro.tax'
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Tracking code customized successfully',
    })
  } catch (error) {
    logger.error('Error customizing tracking code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
