import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth'
import { NotificationService } from '@/lib/services/notification.service'

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      )
    }

    // Remove subscription from database
    await NotificationService.unsubscribeFromPush(user.id, endpoint)

    return NextResponse.json({
      success: true,
      message: 'Push subscription removed successfully'
    })
  } catch (error) {
    console.error('Push unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 }
    )
  }
}