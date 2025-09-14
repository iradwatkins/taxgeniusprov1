import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { PaymentService } from '@/lib/services/payment.service'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const checkoutSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  redirectUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { amount, description, redirectUrl } = checkoutSchema.parse(body)

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Create checkout link
    const result = await PaymentService.createCheckoutLink(
      profile.id,
      Math.round(amount * 100), // Convert to cents
      description,
      redirectUrl
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create checkout' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}