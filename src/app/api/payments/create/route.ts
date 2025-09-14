import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { PaymentService } from '@/lib/services/payment.service'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  sourceId: z.string().min(1, 'Payment source is required'),
  taxReturnId: z.string().optional(),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { amount, sourceId, taxReturnId, description } = paymentSchema.parse(body)

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

    // Create payment
    const result = await PaymentService.createPayment({
      amount: Math.round(amount * 100), // Convert to cents
      sourceId,
      profileId: profile.id,
      taxReturnId,
      description: description || 'Tax preparation services',
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentId: result.paymentId,
      message: 'Payment processed successfully',
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

    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}