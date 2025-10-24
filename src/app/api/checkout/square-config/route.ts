import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSquareApplicationId, getSquareLocationId } from '@/lib/services/square-payment.service';

/**
 * GET /api/checkout/square-config
 * Get Square configuration for Web SDK initialization
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationId = getSquareApplicationId();
    const locationId = getSquareLocationId();

    return NextResponse.json({
      applicationId,
      locationId,
      environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Square not configured' },
      { status: 500 }
    );
  }
}
