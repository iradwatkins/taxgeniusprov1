/**
 * Check Short Code Availability API
 *
 * POST /api/links/check-availability
 *
 * Checks if a short code is available for use
 */

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import {
  validateShortCode,
  isShortCodeAvailable,
} from '@/lib/services/short-link.service'

export async function POST(req: Request) {
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
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate format
    const validation = validateShortCode(code.trim())
    if (!validation.valid) {
      return NextResponse.json({
        available: false,
        reason: validation.error,
      })
    }

    // Check availability
    const available = await isShortCodeAvailable(code.trim())

    return NextResponse.json({
      available,
      reason: available ? undefined : 'Code is already taken',
    })
  } catch (error) {
    logger.error('Error checking code availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
