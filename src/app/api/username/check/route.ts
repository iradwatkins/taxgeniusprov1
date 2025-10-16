/**
 * Username Availability Check API
 *
 * GET /api/username/check?username=johndoe
 * Returns availability status and suggestions if taken
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkUsernameAvailability } from '@/lib/services/username.service'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      )
    }

    const result = await checkUsernameAvailability(username)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    logger.error('Error in username check API', { error })
    return NextResponse.json(
      { error: 'Failed to check username availability' },
      { status: 500 }
    )
  }
}
