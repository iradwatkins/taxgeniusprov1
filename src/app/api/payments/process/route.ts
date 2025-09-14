import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createPayment,
  createCashAppPayment,
  createCustomer,
  calculateFees,
  formatAmount
} from '@/lib/payments/square'

// Payment request schema
const paymentSchema = z.object({
  advanceId: z.string().uuid(),
  amount: z.number().min(100).max(700000), // Amount in cents
  paymentMethod: z.enum(['card', 'cash_app', 'ach']),
  sourceId: z.string().optional(), // Token for card payments
  customerId: z.string().optional(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  preparerId: z.string().uuid().optional(),
  preparerTier: z.enum(['junior', 'senior', 'master']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = paymentSchema.parse(body)

    // Calculate fees
    const fees = calculateFees(validatedData.amount, validatedData.preparerTier)

    // Create or get customer
    let customerId = validatedData.customerId
    if (!customerId) {
      const customerResult = await createCustomer({
        email: validatedData.customerEmail,
        firstName: validatedData.customerName.split(' ')[0],
        lastName: validatedData.customerName.split(' ')[1] || '',
        referenceId: validatedData.advanceId
      })

      if (customerResult.success) {
        customerId = customerResult.customerId
      }
    }

    // Process payment based on method
    let paymentResult
    if (validatedData.paymentMethod === 'cash_app') {
      paymentResult = await createCashAppPayment({
        amount: validatedData.amount,
        customerId: validatedData.customerEmail,
        referenceId: validatedData.advanceId,
        note: `Tax advance for ${validatedData.customerName}`
      })
    } else if (validatedData.paymentMethod === 'card' && validatedData.sourceId) {
      paymentResult = await createPayment({
        amount: validatedData.amount,
        sourceId: validatedData.sourceId,
        customerId: customerId,
        referenceId: validatedData.advanceId,
        note: `Tax advance for ${validatedData.customerName}`,
        appFeeAmount: fees.platformFee
      })
    } else {
      // ACH payment simulation
      paymentResult = {
        success: true,
        paymentId: `ach_${crypto.randomUUID()}`,
        status: 'PENDING',
        amount: validatedData.amount,
        createdAt: new Date().toISOString()
      }
    }

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error, details: paymentResult.errors },
        { status: 400 }
      )
    }

    // Prepare response
    const response = {
      success: true,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      amount: formatAmount(validatedData.amount),
      fees: {
        platform: formatAmount(fees.platformFee),
        preparer: formatAmount(fees.preparerFee),
        total: formatAmount(fees.totalFees)
      },
      netAmount: formatAmount(fees.netAmount),
      receiptUrl: paymentResult.receiptUrl,
      paymentUrl: paymentResult.paymentUrl, // For Cash App Pay
      message: paymentResult.paymentUrl
        ? 'Redirecting to Cash App Pay...'
        : 'Payment processing. Funds will be available shortly.'
    }

    // Log payment (in production, save to database)
    console.log('Payment processed:', {
      advanceId: validatedData.advanceId,
      amount: validatedData.amount,
      method: validatedData.paymentMethod,
      paymentId: paymentResult.paymentId
    })

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}

// GET endpoint to check payment status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paymentId = searchParams.get('id')

  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID required' },
      { status: 400 }
    )
  }

  // Simulate database lookup (in production, query Square API and database)
  const mockPayment = {
    id: paymentId,
    status: 'COMPLETED',
    amount: formatAmount(250000), // $2,500
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    receiptUrl: `https://squareup.com/receipt/preview/${paymentId}`,
    last4: '4242',
    cardBrand: 'VISA'
  }

  return NextResponse.json(mockPayment, { status: 200 })
}