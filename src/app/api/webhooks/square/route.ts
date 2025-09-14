import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/payments/square'

// Square webhook event types
enum SquareEventType {
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_UPDATED = 'payment.updated',
  REFUND_CREATED = 'refund.created',
  REFUND_UPDATED = 'refund.updated',
  DISPUTE_CREATED = 'dispute.evidence.created',
  PAYOUT_PAID = 'payout.paid',
  CUSTOMER_CREATED = 'customer.created'
}

// Handle Square webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-square-hmacsha256-signature') || ''
    const webhookKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || ''

    // Verify webhook signature
    if (webhookKey && !verifyWebhookSignature(body, signature, webhookKey)) {
      console.error('Invalid Square webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const eventType = event.type
    const eventData = event.data

    console.log('Square webhook received:', {
      type: eventType,
      id: event.event_id,
      timestamp: event.created_at
    })

    // Process event based on type
    switch (eventType) {
      case SquareEventType.PAYMENT_CREATED:
        await handlePaymentCreated(eventData)
        break

      case SquareEventType.PAYMENT_UPDATED:
        await handlePaymentUpdated(eventData)
        break

      case SquareEventType.REFUND_CREATED:
        await handleRefundCreated(eventData)
        break

      case SquareEventType.REFUND_UPDATED:
        await handleRefundUpdated(eventData)
        break

      case SquareEventType.DISPUTE_CREATED:
        await handleDisputeCreated(eventData)
        break

      case SquareEventType.PAYOUT_PAID:
        await handlePayoutPaid(eventData)
        break

      case SquareEventType.CUSTOMER_CREATED:
        await handleCustomerCreated(eventData)
        break

      default:
        console.log('Unhandled Square event type:', eventType)
    }

    // Return success response
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('Square webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle payment created event
async function handlePaymentCreated(data: any) {
  const payment = data.object.payment

  console.log('Payment created:', {
    id: payment.id,
    amount: payment.amount_money?.amount,
    status: payment.status,
    referenceId: payment.reference_id
  })

  // Update advance status in database
  if (payment.reference_id) {
    // In production, update advance status to 'funded'
    // await updateAdvanceStatus(payment.reference_id, 'funded')
  }

  // Send confirmation email
  if (payment.buyer_email_address) {
    // In production, send email
    // await sendPaymentConfirmation(payment.buyer_email_address, payment)
  }

  // Calculate and distribute commissions
  if (payment.reference_id) {
    // In production, calculate preparer commission
    // await calculateCommission(payment.reference_id, payment.amount_money?.amount)
  }
}

// Handle payment updated event
async function handlePaymentUpdated(data: any) {
  const payment = data.object.payment

  console.log('Payment updated:', {
    id: payment.id,
    status: payment.status,
    updatedAt: payment.updated_at
  })

  // Update payment status in database
  // In production, update payment record
  // await updatePaymentStatus(payment.id, payment.status)

  // Handle failed payments
  if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
    // In production, handle failed payment
    // await handleFailedPayment(payment.id, payment.reference_id)

    // Notify customer
    if (payment.buyer_email_address) {
      // await sendPaymentFailedNotification(payment.buyer_email_address, payment)
    }
  }
}

// Handle refund created event
async function handleRefundCreated(data: any) {
  const refund = data.object.refund

  console.log('Refund created:', {
    id: refund.id,
    paymentId: refund.payment_id,
    amount: refund.amount_money?.amount,
    reason: refund.reason
  })

  // Update advance status
  // In production, update advance and payment records
  // await updateRefundStatus(refund.payment_id, refund.id, 'processing')

  // Reverse commissions
  // await reverseCommissions(refund.payment_id, refund.amount_money?.amount)

  // Notify customer
  // await sendRefundNotification(refund.payment_id, refund)
}

// Handle refund updated event
async function handleRefundUpdated(data: any) {
  const refund = data.object.refund

  console.log('Refund updated:', {
    id: refund.id,
    status: refund.status,
    updatedAt: refund.updated_at
  })

  // Update refund status
  // In production, update refund record
  // await updateRefundStatus(refund.payment_id, refund.id, refund.status)

  if (refund.status === 'COMPLETED') {
    // Notify customer of completed refund
    // await sendRefundCompletedNotification(refund.payment_id, refund)
  }
}

// Handle dispute created event
async function handleDisputeCreated(data: any) {
  const dispute = data.object.dispute

  console.log('ALERT: Dispute created:', {
    id: dispute.id,
    paymentId: dispute.disputed_payment?.payment_id,
    amount: dispute.amount_money?.amount,
    reason: dispute.reason,
    state: dispute.state
  })

  // Flag advance for review
  // In production, flag advance and notify team
  // await flagAdvanceForReview(dispute.disputed_payment?.payment_id)
  // await notifyDisputeTeam(dispute)

  // Prepare evidence
  // await prepareDisputeEvidence(dispute.id)
}

// Handle payout paid event
async function handlePayoutPaid(data: any) {
  const payout = data.object.payout

  console.log('Payout completed:', {
    id: payout.id,
    amount: payout.amount_money?.amount,
    arrivalDate: payout.arrival_date
  })

  // Update payout records
  // In production, record payout for accounting
  // await recordPayout(payout)
}

// Handle customer created event
async function handleCustomerCreated(data: any) {
  const customer = data.object.customer

  console.log('Customer created:', {
    id: customer.id,
    email: customer.email_address,
    referenceId: customer.reference_id
  })

  // Create user account if needed
  // In production, sync with user database
  // await syncCustomerWithUser(customer)

  // Send welcome email
  if (customer.email_address) {
    // await sendWelcomeEmail(customer.email_address, customer)
  }
}

// Webhook configuration endpoint (for Square webhook setup)
export async function GET(request: NextRequest) {
  // Return webhook configuration info
  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/square`,
    events: [
      'payment.created',
      'payment.updated',
      'refund.created',
      'refund.updated',
      'dispute.evidence.created',
      'payout.paid',
      'customer.created'
    ],
    status: 'configured',
    signatureKeyConfigured: !!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  }, { status: 200 })
}