import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe only if key is available (avoid build-time errors)
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
};

// CRITICAL: This endpoint handles real money transactions
// Webhook signature verification is MANDATORY for security
export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (required for signature verification)
    const body = await request.text();

    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ Webhook Error: No stripe-signature header');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature (CRITICAL SECURITY)
    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const error = err as Error;
      console.error('❌ Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Webhook verified: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('💰 Processing completed checkout session:', session.id);

      // Extract metadata
      const userId = session.metadata?.userId;
      const cartItemsJson = session.metadata?.cartItems;

      if (!userId || !cartItemsJson) {
        console.error('❌ Missing metadata in session:', session.id);
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        );
      }

      const cartItems = JSON.parse(cartItemsJson);
      const total = (session.amount_total ?? 0) / 100; // Convert cents to dollars

      // Idempotency check - prevent duplicate order creation
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder) {
        console.log(`⚠️  Order already exists for session ${session.id}`);
        return NextResponse.json({ received: true, orderId: existingOrder.id });
      }

      // Create order in database
      const order = await prisma.order.create({
        data: {
          userId,
          stripeSessionId: session.id,
          items: cartItems,
          total,
          status: 'COMPLETED',
          email: session.customer_email ?? session.customer_details?.email ?? '',
        },
      });

      console.log(`✅ Order created: ${order.id} for user ${userId}`);

      // TODO: Send order confirmation email via Resend
      // await sendOrderConfirmationEmail(order);

      return NextResponse.json({ received: true, orderId: order.id });
    }

    // Handle checkout.session.expired event
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('⏱️  Checkout session expired:', session.id);

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder && existingOrder.status === 'PENDING') {
        // Update order status to FAILED
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: { status: 'FAILED' },
        });

        console.log(`❌ Order marked as FAILED: ${existingOrder.id}`);
      }

      return NextResponse.json({ received: true });
    }

    // Acknowledge receipt of unhandled event types
    console.log(`ℹ️  Unhandled event type: ${event.type}`);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Prevent Next.js from parsing the body (we need raw body for signature verification)
export const dynamic = 'force-dynamic';
