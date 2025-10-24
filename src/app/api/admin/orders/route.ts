import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/orders
 * Fetch all orders (admin only)
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
    });

    if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize orders (convert Decimal to number)
    const serializedOrders = orders.map((order) => ({
      ...order,
      total: Number(order.total),
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    logger.error('Failed to fetch orders', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
